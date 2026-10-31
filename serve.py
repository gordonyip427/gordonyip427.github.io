#!/usr/bin/env python3
"""
Zero-dependency local preview builder & server for gordonkhy.com.
Uses macOS/Linux built-in Ruby YAML parser + Python's http.server to render
the Jekyll templates & _data/*.yml files into _site/ and serve at http://localhost:4000.

Usage:
  python3 serve.py              # Build and start local preview server at http://localhost:4000
  python3 serve.py --build-only # Validate YAML data and build _site/ without serving
"""

import argparse
import datetime
import functools
import http.server
import json
import os
import re
import shutil
import signal
import socketserver
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SITE_DIR = ROOT / "_site"


def load_yaml_via_ruby(path: Path):
    cmd = [
        "ruby",
        "-ryaml",
        "-rjson",
        "-e",
        "puts JSON.generate(YAML.load_file(ARGV[0]))",
        str(path),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return json.loads(res.stdout)


def parse_front_matter(text: str):
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            fm_raw = text[4:end]
            body = text[end + 5 :]
            cmd = [
                "ruby",
                "-ryaml",
                "-rjson",
                "-e",
                "puts JSON.generate(YAML.load(STDIN.read) || {})",
            ]
            res = subprocess.run(cmd, input=fm_raw, capture_output=True, text=True, check=True)
            return json.loads(res.stdout), body
    return {}, text


def resolve_lookup(expr: str, ctx: dict):
    expr = expr.strip()
    parts = [p.strip() for p in expr.split("|")]
    base = parts[0]
    if (base.startswith('"') and base.endswith('"')) or (base.startswith("'") and base.endswith("'")):
        val = base[1:-1]
    else:
        val = ctx
        for key in base.split("."):
            if isinstance(val, dict) and key in val:
                val = val[key]
            else:
                val = ""
                break
    for filt in parts[1:]:
        filt = filt.strip()
        if filt.startswith("default:"):
            arg = filt.split(":", 1)[1].strip()
            if not val:
                val = resolve_lookup(arg, ctx)
        elif filt == "relative_url":
            val = str(val)
        elif filt.startswith("date:"):
            val = str(datetime.datetime.now().year)
    return val


def eval_condition(cond: str, ctx: dict) -> bool:
    cond = cond.strip()
    if " or " in cond:
        return any(eval_condition(c, ctx) for c in cond.split(" or "))
    if " and " in cond:
        return all(eval_condition(c, ctx) for c in cond.split(" and "))
    if "!=" in cond:
        left, right = cond.split("!=", 1)
        return str(resolve_lookup(left, ctx)) != str(resolve_lookup(right, ctx))
    if "==" in cond:
        left, right = cond.split("==", 1)
        return str(resolve_lookup(left, ctx)) == str(resolve_lookup(right, ctx))
    if " contains " in cond:
        left, right = cond.split(" contains ", 1)
        return str(resolve_lookup(right, ctx)) in str(resolve_lookup(left, ctx))
    val = resolve_lookup(cond, ctx)
    return bool(val)


TOKEN_RE = re.compile(r"(\{%.*?%\}|\{\{.*?\}\})", re.S)


def render_liquid(template: str, ctx: dict) -> str:
    tokens = TOKEN_RE.split(template)
    idx = 0

    def parse_block(stop_tags=()):
        nonlocal idx
        out = []
        while idx < len(tokens):
            tok = tokens[idx]
            if tok.startswith("{%"):
                inner = tok[2:-2].strip()
                if any(inner == st or inner.startswith(st + " ") for st in stop_tags):
                    return "".join(out), inner
                idx += 1
                if inner.startswith("for "):
                    m = re.match(r"for\s+(\w+)\s+in\s+(.+)", inner)
                    var_name, list_expr = m.group(1), m.group(2)
                    loop_start = idx
                    body_str, _ = parse_block(("endfor",))
                    idx += 1  # consume endfor
                    items = resolve_lookup(list_expr, ctx) or []
                    for i, item in enumerate(items, 1):
                        sub_ctx = dict(ctx)
                        sub_ctx[var_name] = item
                        sub_ctx["forloop"] = {
                            "index": i,
                            "index0": i - 1,
                            "first": i == 1,
                            "last": i == len(items),
                        }
                        saved_idx = idx
                        out.append(render_liquid(tokens_slice(loop_start, idx - 1), sub_ctx))
                        idx = saved_idx
                elif inner.startswith("if "):
                    branches = []
                    else_raw = ""
                    curr_cond = inner[3:].strip()
                    branch_start = idx
                    while True:
                        _, end_tag = parse_block(("elsif", "else", "endif"))
                        branch_raw = tokens_slice(branch_start, idx)
                        branches.append((curr_cond, branch_raw))
                        if end_tag.startswith("elsif "):
                            curr_cond = end_tag[6:].strip()
                            idx += 1  # consume elsif
                            branch_start = idx
                        elif end_tag == "else":
                            idx += 1  # consume else
                            else_start = idx
                            parse_block(("endif",))
                            else_raw = tokens_slice(else_start, idx)
                            break
                        else:
                            break
                    idx += 1  # consume endif
                    matched = False
                    for cond_expr, raw_block in branches:
                        if eval_condition(cond_expr, ctx):
                            out.append(render_liquid(raw_block, ctx))
                            matched = True
                            break
                    if not matched and else_raw:
                        out.append(render_liquid(else_raw, ctx))
            elif tok.startswith("{{"):
                expr = tok[2:-2].strip()
                out.append(str(resolve_lookup(expr, ctx)))
                idx += 1
            else:
                out.append(tok)
                idx += 1
        return "".join(out), ""

    def tokens_slice(start, end):
        return "".join(tokens[start:end])

    rendered, _ = parse_block()
    return rendered


def build_site(verbose=True):
    SITE_DIR.mkdir(parents=True, exist_ok=True)

    # Copy assets, preview, and CNAME in-place without unlinking SITE_DIR inode
    if (ROOT / "assets").exists():
        shutil.copytree(ROOT / "assets", SITE_DIR / "assets", dirs_exist_ok=True)
    if (ROOT / "preview").exists():
        shutil.copytree(ROOT / "preview", SITE_DIR / "preview", dirs_exist_ok=True)
    if (ROOT / "CNAME").exists():
        shutil.copy2(ROOT / "CNAME", SITE_DIR / "CNAME")

    site_cfg = load_yaml_via_ruby(ROOT / "_config.yml")
    site_cfg["time"] = str(datetime.datetime.now().year)
    site_cfg["data"] = {}
    for yml_file in sorted((ROOT / "_data").glob("*.yml")):
        site_cfg["data"][yml_file.stem] = load_yaml_via_ruby(yml_file)

    layouts = {}
    for lfile in (ROOT / "_layouts").glob("*.html"):
        lfm, lbody = parse_front_matter(lfile.read_text(encoding="utf-8"))
        layouts[lfile.stem] = (lfm, lbody)

    page_files = [ROOT / "index.html"] + sorted((ROOT / "pages").glob("*"))
    for pfile in page_files:
        if not pfile.is_file():
            continue
        pfm, pbody = parse_front_matter(pfile.read_text(encoding="utf-8"))
        permalink = pfm.get("permalink", f"/{pfile.stem}/")
        page_ctx = dict(pfm)
        page_ctx["url"] = permalink
        ctx = {"site": site_cfg, "page": page_ctx}

        rendered_content = render_liquid(pbody, ctx)
        layout_name = pfm.get("layout")
        while layout_name and layout_name in layouts:
            lfm, lbody = layouts[layout_name]
            ctx["content"] = rendered_content
            rendered_content = render_liquid(lbody, ctx)
            layout_name = lfm.get("layout")

        if permalink == "/":
            out_path = SITE_DIR / "index.html"
        elif permalink.endswith(".html"):
            out_path = SITE_DIR / permalink.lstrip("/")
        else:
            out_path = SITE_DIR / permalink.strip("/") / "index.html"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(rendered_content, encoding="utf-8")
        if verbose:
            print(f"  Built {permalink:20s} -> {out_path.relative_to(ROOT)}")


class AutoRebuildHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self):
        clean_path = self.path.split("?", 1)[0]
        if clean_path == "/" or clean_path.endswith("/") or clean_path.endswith(".html") or clean_path.endswith(".css"):
            try:
                build_site(verbose=False)
            except Exception as e:
                print(f"Rebuild warning: {e}")
        return super().do_GET()


class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


def free_port_if_busy(port: int):
    try:
        res = subprocess.run(["lsof", "-ti", f":{port}"], capture_output=True, text=True)
        pids = [int(p) for p in res.stdout.split() if p.strip().isdigit()]
        my_pid = os.getpid()
        for pid in pids:
            if pid != my_pid:
                print(f"Stopping previous server process (PID {pid}) on port {port}...")
                os.kill(pid, signal.SIGKILL)
    except Exception:
        pass


def main():
    parser = argparse.ArgumentParser(description="Build and preview gordonkhy.com locally.")
    parser.add_argument("--build-only", action="store_true", help="Build _site/ and exit")
    parser.add_argument("--port", type=int, default=4000, help="Port to serve on (default: 4000)")
    args = parser.parse_args()

    print("Building site from _config.yml, _data/*.yml, and pages/...")
    build_site(verbose=True)
    print("Build complete!")

    if args.build_only:
        return

    free_port_if_busy(args.port)

    def handle_exit(signum, frame):
        print("\nStopped local server.")
        os._exit(0)

    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)

    handler = functools.partial(AutoRebuildHandler, directory=str(SITE_DIR))
    with ThreadedHTTPServer(("", args.port), handler) as httpd:
        print(f"\nServing site locally at: http://localhost:{args.port}")
        print("Live auto-rebuild enabled: any edits to _data/, pages/, or assets/ appear on refresh.")
        print("Press Ctrl+C to stop the server.\n")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
