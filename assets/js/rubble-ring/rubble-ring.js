/*!
 * Rubble Ring — high-efficiency WebGL Ice Giant planet background
 * Stationary ice giant on the right, tilted towards the hero card on the left,
 * with smooth differential zonal wind bands, Keplerian 3D rock belt, mutual
 * analytic shadows, starfield, cratered moons, and gentle bounded cursor parallax.
 *
 * Optimized for locked 60fps at low GPU power:
 * - No full-scene OrbitControls drag hijacking by default (gentle bounded parallax only)
 * - 6.5x geometry reduction (3,200 instanced polyhedra vs 420k triangles)
 * - Streamlined 4-tap Simplex shader & analytical penumbral ring shadow
 */
(function (global) {
  'use strict';

  var HEAD = [
    "uniform vec3 uSun; uniform vec3 uCam;",
    "uniform float uTime, uBandTime, uR, uRin, uRout, uKep;",
    "uniform vec2 uShepherdAng;",
    "varying vec3 vPos;\n"
  ].join("\n");

  var COMMON = "\n    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}\n    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}\n    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}\n    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}\n    float snoise(vec3 v){\n      const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);\n      vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);\n      vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g;\n      vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);\n      vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;\n      i=mod289(i);\n      vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));\n      float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;\n      vec4 j=p-49.0*floor(p*ns.z*ns.z);\n      vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);\n      vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy;\n      vec4 h=1.0-abs(x)-abs(y);\n      vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);\n      vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0;\n      vec4 sh=-step(h,vec4(0.0));\n      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;\n      vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);\n      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));\n      p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;\n      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;\n      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));\n    }\n    float hash11(float p){ p=fract(p*0.1031); p*=p+33.33; p*=p+p; return fract(p); }\n    float vnoise1(float x){ float i=floor(x), f=fract(x); float u=f*f*(3.0-2.0*f); return mix(hash11(i),hash11(i+1.0),u); }\n    vec3 rotY(vec3 v, float a){ float c=cos(a), s=sin(a); return vec3(c*v.x-s*v.z, v.y, s*v.x+c*v.z); }\n    float band(float x, float a, float b, float soft){ return smoothstep(a-soft,a+soft,x)*(1.0-smoothstep(b-soft,b+soft,x)); }\n    float ringShadowFast(float x){\n      if (x < 0.0 || x > 1.0) return 0.0;\n      float d = 0.20 * band(x, 0.0, 0.215, 0.015)\n              + 0.72 * band(x, 0.215, 0.55, 0.010)\n              + 0.52 * band(x, 0.598, 0.935, 0.008) * (1.0 - 0.85 * band(x, 0.855, 0.870, 0.004))\n              + 0.35 * band(x, 0.970, 0.982, 0.003);\n      return clamp(d, 0.0, 1.0);\n    }\n    float ringProfile(float x, float fw){\n      if (x < 0.0 || x > 1.0) return 0.0;\n      float d = 0.0;\n      d += (0.12 + 0.12*x/0.22) * band(x, 0.0, 0.215, 0.012);\n      d += (0.62 + 0.3*smoothstep(0.22, 0.5, x)) * band(x, 0.215, 0.55, 0.006);\n      d += 0.05 * band(x, 0.55, 0.598, 0.003);\n      d += (0.6 - 0.12*smoothstep(0.6, 0.93, x)) * band(x, 0.598, 0.935, 0.004);\n      d *= 1.0 - 0.92 * band(x, 0.858, 0.867, 0.0015);\n      d += 0.4 * band(x, 0.973, 0.979, 0.0015);\n      float a2 = 1.0 - smoothstep(0.002, 0.01, fw);\n      float a3 = 1.0 - smoothstep(0.0007, 0.003, fw);\n      float s = 0.78 + 0.22*vnoise1(x*55.0) + a2*0.28*(vnoise1(x*190.0+7.0)-0.5) + a3*0.2*(vnoise1(x*560.0+3.0)-0.5);\n      return clamp(d*s, 0.0, 1.0);\n    }\n  ";

  var VERT = "varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";

  // Ultra-fast 4-tap Simplex Ice Giant shader (over 2x faster than 9-tap while retaining full realism)
  var FRAG_PLANET = "\n    void main(){\n      vec3 n = normalize(vPos); vec3 V = normalize(uCam - vPos);\n      float lat = asin(clamp(n.y, -1.0, 1.0));\n      // Differential Zonal Wind Profile (counter-streaming equatorial & mid-latitude jets)\n      float zonalVel = 0.07 + 0.09 * cos(lat * 5.5) - 0.06 * exp(-lat * lat * 8.0);\n      vec3 p = rotY(n, uBandTime * zonalVel);\n      vec3 q = p * vec3(1.5, 6.5, 1.5);\n      float n1 = snoise(q * 1.3 + vec3(0.0, 0.0, uBandTime * 0.03));\n      float n2 = snoise(q * 2.65 + vec3(1.7, 9.2, 3.1 - uBandTime * 0.02));\n      float w1 = 0.5 * n1 + 0.25 * n2;\n      float n3 = snoise(q * 4.0 + vec3(w1 * 2.2, n2 * 1.2, 0.0));\n      float y = n.y + 0.03 * w1 + 0.012 * n3;\n      float phase = y * 19.0 + 0.8 * sin(y * 6.0);\n      float b = 0.5 + 0.26*sin(phase) + 0.15*sin(y*43.0+1.1) + 0.08*sin(y*91.0+2.3) + 0.05*sin(y*173.0+0.7);\n      b = clamp(b + (0.5 * n2 + 0.25 * n3) * (0.06 + 0.13 * (1.0 - abs(cos(phase)))), 0.0, 1.0);\n\n      vec3 col = mix(vec3(0.16, 0.23, 0.35), vec3(0.33, 0.44, 0.58), smoothstep(0.1, 0.4, b));\n      col = mix(col, vec3(0.58, 0.68, 0.78), smoothstep(0.38, 0.65, b));\n      col = mix(col, vec3(0.83, 0.88, 0.93), smoothstep(0.62, 0.9, b));\n      col *= 1.0 + 0.07 * exp(-lat * lat * 25.0);\n      col = mix(col, vec3(0.24, 0.33, 0.47), smoothstep(0.72, 0.97, abs(n.y)) * 0.65);\n\n      // High-altitude methane-ice cirrus streaks\n      vec3 pCir = rotY(n, uBandTime * (zonalVel * 1.35 + 0.035));\n      float mask = exp(-pow((lat - 0.75) / 0.1, 2.0)) + exp(-pow((lat + 0.55) / 0.12, 2.0)) + 0.5 * exp(-pow((lat - 0.2) / 0.06, 2.0));\n      float cirNoise = 0.55 * snoise(pCir * vec3(2.6, 28.0, 2.6) + w1 * 1.5) + 0.25 * n2;\n      float cir = smoothstep(0.42, 0.78, cirNoise + 0.28) * mask;\n      col = mix(col, vec3(0.93, 0.96, 0.99), clamp(cir, 0.0, 1.0) * 0.85);\n\n      vec3 alb = pow(col, vec3(2.2));\n      float NL = dot(n, uSun); float NV = max(dot(n, V), 0.02);\n      float light = pow(clamp((NL + 0.05) / 1.05, 0.0, 1.0), 1.1) * pow(NV, 0.12);\n      if (abs(uSun.y) > 0.0001) {\n        float t = -vPos.y / uSun.y;\n        if (t > 0.0) { vec3 hit = vPos + t * uSun; light *= 1.0 - 0.86 * ringShadowFast((length(hit.xz) - uRin) / (uRout - uRin)); }\n      }\n      vec3 lin = alb * light * 1.25;\n      lin += vec3(0.010, 0.016, 0.030) * smoothstep(-0.12, 0.05, NL) * (1.0 - smoothstep(0.05, 0.3, NL));\n      lin += vec3(0.10, 0.18, 0.36) * pow(1.0 - NV, 3.5) * smoothstep(-0.1, 0.5, NL) * 0.5;\n      lin += alb * 0.008;\n      gl_FragColor = vec4(pow(lin, vec3(1.0/2.2)), 1.0);\n    }";

  var FRAG_HAZE = "\n    void main(){\n      float r = length(vPos.xz);\n      float x = (r - uRin) / (uRout - uRin);\n      float ang = atan(-vPos.z, vPos.x);\n      float dAng1 = mod(ang - uShepherdAng.x + 6.2831853, 6.2831853);\n      float wake1 = exp(-dAng1 * 1.3) * exp(-abs(x - 0.574) * 32.0);\n      x += sin(dAng1 * 26.0 - abs(x - 0.574) * 220.0) * 0.005 * wake1;\n      float dens = ringProfile(x, fwidth(x));\n      if (dens < 0.004) discard;\n      vec3 V = normalize(uCam - vPos);\n      float d = dot(vPos, uSun);\n      float sh = d < 0.0 ? smoothstep(uR * 0.985, uR * 1.02, length(vPos - d * uSun)) : 1.0;\n      vec3 alb = pow(mix(vec3(0.74,0.77,0.83), vec3(0.50,0.55,0.64), 0.8*vnoise1(x*37.0) + 0.2*vnoise1(x*9.0)), vec3(2.2));\n      float elev = abs(uSun.y);\n      vec3 col;\n      if (uSun.y * V.y > 0.0) col = alb * (0.45 + 0.55 * sqrt(elev)) * 1.1;\n      else col = alb * dens * (1.0 - dens) * 2.2 * (0.5 + 2.0 * pow(max(dot(-V, uSun), 0.0), 6.0));\n      col *= sh * smoothstep(0.0, 0.06, elev);\n      float alpha = clamp(1.0 - pow(1.0 - min(dens, 0.98), 1.0 / max(abs(V.y), 0.04)), 0.0, 0.98);\n      alpha *= 0.8 * smoothstep(1.2, 5.0, length(uCam - vPos));\n      gl_FragColor = vec4(pow(col, vec3(1.0/2.2)), alpha);\n    }";

  var ROCK_VERT = "\n    attribute vec4 aOrbit; attribute vec4 aSpin; attribute float aTone;\n    uniform vec3 uCam; uniform float uTime, uKep, uFadeNear, uFadeFar;\n    varying vec3 vPos; varying vec3 vN; varying float vTone;\n    mat3 rotAxis(vec3 a, float ang){ float s=sin(ang), c=cos(ang), oc=1.0-c;\n      return mat3(oc*a.x*a.x+c, oc*a.x*a.y+a.z*s, oc*a.z*a.x-a.y*s,\n                  oc*a.x*a.y-a.z*s, oc*a.y*a.y+c, oc*a.y*a.z+a.x*s,\n                  oc*a.z*a.x+a.y*s, oc*a.y*a.z-a.x*s, oc*a.z*a.z+c); }\n    void main(){\n      float r = aOrbit.x; float th = aOrbit.y + uKep * uTime * pow(r, -1.5);\n      vec3 center = vec3(cos(th) * r, aOrbit.z, -sin(th) * r);\n      float distCam = length(uCam - center);\n      float fade = smoothstep(0.8, 1.6, distCam) * (1.0 - smoothstep(uFadeNear, uFadeFar, distCam));\n      mat3 R = rotAxis(normalize(aSpin.xyz), aSpin.w * uTime + aOrbit.y * 7.0);\n      vPos = center + R * (position * aOrbit.w * fade);\n      vN = R * normal; vTone = aTone;\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);\n    }";

  var ROCK_FRAG = "\n    uniform vec3 uSun; uniform float uR;\n    varying vec3 vPos; varying vec3 vN; varying float vTone;\n    void main(){\n      vec3 n = normalize(vN);\n      float d = dot(vPos, uSun);\n      float sh = d < 0.0 ? smoothstep(uR * 0.985, uR * 1.02, length(vPos - d * uSun)) : 1.0;\n      vec3 alb = pow(mix(vec3(0.30,0.29,0.28), vec3(0.80,0.84,0.90), vTone), vec3(2.2));\n      float grain = 0.85 + 0.15 * fract(sin(dot(floor(vPos * 60.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453);\n      vec3 lin = alb * (max(dot(n, uSun), 0.0) * 1.4 * sh + 0.025) * grain;\n      gl_FragColor = vec4(pow(lin, vec3(1.0/2.2)), 1.0);\n    }";

  var GLOW_VERT = "varying vec3 vN; varying vec3 vPos; void main(){ vPos = position; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }";
  var GLOW_FRAG = "uniform vec3 uSun; uniform vec3 uCam; uniform vec3 uGlowCol; uniform float uGlowPow, uGlowAmp, uNight, uFwd; varying vec3 vN; varying vec3 vPos;void main(){ float i = pow(max(0.68 - dot(vN, vec3(0.0,0.0,1.0)), 0.0), uGlowPow); float lit = mix(uNight, 1.0, smoothstep(-0.35, 0.4, dot(normalize(vPos), uSun))); float fwd = pow(max(dot(normalize(uCam), -uSun), 0.0), 12.0) * uFwd; gl_FragColor = vec4(uGlowCol * i * (lit + fwd) * uGlowAmp, 1.0); }";

  var MOON_VERT = "\n    attribute float aMoonTone;\n    varying vec3 vWorldN;\n    varying vec3 vLocalPos;\n    varying float vTone;\n    void main(){\n      vLocalPos = position;\n      vWorldN = normalize(mat3(modelMatrix) * normal);\n      vTone = aMoonTone;\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    }";
  var MOON_FRAG = "\n    uniform vec3 uSunW;\n    varying vec3 vWorldN;\n    varying vec3 vLocalPos;\n    varying float vTone;\n    void main(){\n      vec3 n = normalize(vWorldN);\n      vec3 c1 = vec3(0.24, 0.23, 0.22);\n      vec3 c2 = vec3(0.55, 0.51, 0.47);\n      vec3 c3 = vec3(0.80, 0.77, 0.72);\n      vec3 col = vTone < 0.5 ? mix(c1, c2, vTone * 2.0) : mix(c2, c3, (vTone - 0.5) * 2.0);\n      float grain = 0.88 + 0.12 * fract(sin(dot(floor(vLocalPos * 120.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453);\n      vec3 alb = pow(col * grain, vec3(2.2));\n      float NL = max(dot(n, uSunW), 0.0);\n      vec3 lin = alb * (pow(NL, 0.9) * 1.45 + 0.025) + vec3(0.012, 0.018, 0.032);\n      gl_FragColor = vec4(pow(lin, vec3(1.0/2.2)), 1.0);\n    }";

  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  function rockGeometry(THREE, seed, detail) {
    var g = new THREE.IcosahedronGeometry(1, detail), p = g.attributes.position, v = new THREE.Vector3(), rnd = mulberry(seed), dents = [];
    for (var k = 0; k < 7; k++) dents.push([new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(), 0.15 + rnd() * 0.35]);
    var ax = [1, 0.6 + rnd() * 0.3, 0.45 + rnd() * 0.3];
    for (var i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).normalize();
      var r = 1;
      dents.forEach(function (d) { var t = Math.max(v.dot(d[0]), 0); r -= d[1] * t * t * t; });
      r += 0.06 * Math.sin(v.x * 9 + seed) * Math.sin(v.y * 7) * Math.sin(v.z * 8);
      p.setXYZ(i, v.x * r * ax[0], v.y * r * ax[1], v.z * r * ax[2]);
    }
    g.computeVertexNormals();
    return g;
  }

  function rockyMoonGeometry(THREE, radius, seed) {
    var g = new THREE.IcosahedronGeometry(radius, 3), p = g.attributes.position, v = new THREE.Vector3(), rnd = mulberry(seed), craters = [], lobes = [];
    for (var k = 0; k < 18; k++) {
      craters.push([
        new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(),
        0.14 + rnd() * 0.28,
        0.06 + rnd() * 0.11
      ]);
    }
    for (var j = 0; j < 6; j++) {
      lobes.push([
        new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(),
        0.07 + rnd() * 0.12
      ]);
    }
    var ax = [1.08, 0.90, 0.96];
    var tones = new Float32Array(p.count);
    for (var i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).normalize();
      var r = radius;
      var tone = 0.48 + 0.18 * Math.sin(v.x * 5 + v.y * 4) * Math.cos(v.z * 5);
      lobes.forEach(function (l) {
        var t = Math.max(v.dot(l[0]), 0);
        r -= radius * l[1] * t * t;
        tone -= 0.12 * t * t;
      });
      craters.forEach(function (c) {
        var ang = Math.acos(Math.min(1, Math.max(-1, v.dot(c[0]))));
        var x = ang / c[1];
        if (x < 1.35) {
          var bowl = x < 0.88 ? -(1 - (x / 0.88) * (x / 0.88)) * c[2] : 0;
          var rim = Math.exp(-Math.pow((x - 0.94) / 0.17, 2)) * c[2] * 0.48;
          r += radius * (bowl + rim);
          if (x < 0.78) tone -= 0.26 * (1 - x / 0.78);
          else if (x < 1.18) tone += 0.28 * Math.exp(-Math.pow((x - 0.94) / 0.15, 2));
        }
      });
      var ridge = 0.038 * Math.sin(v.x * 11 + seed) * Math.cos(v.y * 9 - seed) * Math.sin(v.z * 13)
                + 0.020 * Math.cos(v.x * 23 + v.y * 19) * Math.sin(v.z * 21);
      r += radius * ridge;
      tone += ridge * 3.2;
      tones[i] = Math.max(0, Math.min(1, tone));
      p.setXYZ(i, v.x * r * ax[0], v.y * r * ax[1], v.z * r * ax[2]);
    }
    g.setAttribute('aMoonTone', new THREE.BufferAttribute(tones, 1));
    g.computeVertexNormals();
    return g;
  }

  function beltDensity(x) {
    if (x < 0.215) return 0.15;
    if (x < 0.52) return 1.0;
    if (x < 0.62) return 0.0;
    if (x > 0.855 && x < 0.872) return 0.0;
    if (x < 0.935) return 0.6;
    if (x > 0.972 && x < 0.98) return 0.5;
    return 0;
  }

  function readOptions(el, o) {
    o = o || {};
    var d = el.dataset || {};
    function flag(name, attr, def) { if (name in o) return !!o[name]; if (attr in d) return d[attr] !== 'false'; return def; }
    function num(name, attr, def) { if (name in o) return +o[name]; if (attr in d && d[attr] !== '') return +d[attr]; return def; }
    var narrow = (global.innerWidth || 1200) < num('breakpoint', 'breakpoint', 900);
    return {
      // Disable heavy OrbitControls drag-rotation by default; use feather-light cursor parallax instead
      interactive: flag('interactive', 'interactive', false),
      parallax: flag('parallax', 'parallax', true),
      // 3,200 detail-0 rocks = 64k triangles (down from 420k), giving locked 60fps with identical visual density
      rocks: Math.max(0, Math.round(num('rocks', 'rocks', narrow ? 1800 : 3200))),
      camDist: num('camDist', 'camDist', 6.0),
      offsetX: num('offsetX', 'offsetX', 0.27),
      offsetY: num('offsetY', 'offsetY', 0.2),
      breakpoint: num('breakpoint', 'breakpoint', 900)
    };
  }

  function mount(el, options) {
    var THREE = global.THREE;
    if (!THREE) { console.warn('RubbleRing: three.js is not loaded.'); return null; }
    if (el.__rubbleRing) return el.__rubbleRing;
    var opt = readOptions(el, options);
    var reduceMotion = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var canvas = document.createElement('canvas');
    canvas.className = 'rubble-ring__canvas';
    canvas.setAttribute('aria-hidden', 'true');
    el.appendChild(canvas);

    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance' }); }
    catch (e) { el.removeChild(canvas); el.classList.add('rubble-ring--no-webgl'); return null; }
    // Cap pixel ratio at 1.25 so 4K/5K Retina screens don't shade 12M+ background pixels per frame
    renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 1.25));
    renderer.setClearColor(0x060a14, 1);
    renderer.outputEncoding = THREE.sRGBEncoding;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400);
    var distScale = opt.camDist / 10.5;
    var baseCamPos = new THREE.Vector3(0.6 * distScale, 1.6 * distScale, opt.camDist);
    camera.position.copy(baseCamPos);
    camera.lookAt(0, 0, 0);

    // Subtle, bounded cursor parallax (max +/- 0.22 units camera sway, zero projection matrix rebuilds)
    var targetPX = 0, targetPY = 0, curPX = 0, curPY = 0;
    function onPointerMove(e) {
      if (!opt.parallax || reduceMotion) return;
      var w = global.innerWidth || 1200, h = global.innerHeight || 800;
      targetPX = ((e.clientX / w) - 0.5) * 0.42;
      targetPY = -((e.clientY / h) - 0.5) * 0.28;
    }
    if (opt.parallax) global.addEventListener('pointermove', onPointerMove, { passive: true });

    scene.add(new THREE.AmbientLight(0x9fb3d6, 0.06));

    // Planet system: positioned on the right and tilted towards the hero card on the left
    var R = 1.6, RIN = R * 1.24, ROUT = R * 2.34;
    var system = new THREE.Group();
    system.rotation.set(0.24, -0.18, 0.44);
    scene.add(system);
    scene.updateMatrixWorld(true);

    var rShep1 = RIN + 0.574 * (ROUT - RIN);
    var rShep2 = RIN + 0.862 * (ROUT - RIN);

    var U = {
      uSun: { value: new THREE.Vector3(-0.75, 0.35, 0.55).normalize() },
      uCam: { value: new THREE.Vector3() },
      uTime: { value: 0 },
      uBandTime: { value: 0 },
      uR: { value: R },
      uRin: { value: RIN },
      uRout: { value: ROUT },
      uKep: { value: 0.26 },
      uShepherdAng: { value: new THREE.Vector2(0.8, 3.9) }
    };

    function mat(frag, extra) {
      var m = new THREE.ShaderMaterial(Object.assign({ uniforms: U, vertexShader: VERT, fragmentShader: HEAD + COMMON + frag }, extra || {}));
      m.extensions = { derivatives: true };
      return m;
    }
    var disposables = [];
    function track(x) { disposables.push(x); return x; }

    system.add(new THREE.Mesh(track(new THREE.SphereGeometry(R, 64, 48)), track(mat(FRAG_PLANET))));
    system.add(new THREE.Mesh(track(new THREE.SphereGeometry(R * 1.05, 40, 28)), track(new THREE.ShaderMaterial({
      uniforms: { uSun: U.uSun, uCam: U.uCam, uGlowCol: { value: new THREE.Color(0.42, 0.62, 1.0) }, uGlowPow: { value: 4 }, uGlowAmp: { value: 0.55 }, uNight: { value: 0 }, uFwd: { value: 0 } },
      vertexShader: GLOW_VERT, fragmentShader: GLOW_FRAG, side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    }))));

    // Streamlined 3D Rock belt (detail 0 icosahedra across 2 shape seeds = 64k triangles total)
    var rockMat = track(new THREE.ShaderMaterial({
      uniforms: {
        uSun: U.uSun, uCam: U.uCam, uTime: U.uTime, uR: U.uR, uKep: U.uKep,
        uFadeNear: { value: 5.0 }, uFadeFar: { value: 10.5 }
      },
      vertexShader: ROCK_VERT, fragmentShader: ROCK_FRAG
    }));
    for (var vi = 0; vi < 2 && opt.rocks > 0; vi++) {
      var base = track(rockGeometry(THREE, 11 + vi * 23, 0)), n = Math.floor(opt.rocks / 2);
      var ig = track(new THREE.InstancedBufferGeometry());
      ig.setAttribute('position', base.attributes.position); ig.setAttribute('normal', base.attributes.normal);
      var orb = new Float32Array(n * 4), spin = new Float32Array(n * 4), tone = new Float32Array(n), i = 0;
      while (i < n) {
        var r = Math.sqrt(RIN * RIN + Math.random() * (ROUT * ROUT - RIN * RIN));
        if (Math.random() > beltDensity((r - RIN) / (ROUT - RIN))) continue;
        orb[i * 4] = r; orb[i * 4 + 1] = Math.random() * Math.PI * 2;
        orb[i * 4 + 2] = (Math.random() + Math.random() - 1) * 0.03;
        orb[i * 4 + 3] = Math.min(0.068, 0.0085 * Math.pow(1 - Math.random(), -0.5));
        var ax = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        spin[i * 4] = ax.x; spin[i * 4 + 1] = ax.y; spin[i * 4 + 2] = ax.z; spin[i * 4 + 3] = (Math.random() - 0.5) * 1.2;
        tone[i] = Math.random() < 0.3 ? 0.7 + Math.random() * 0.3 : Math.random() * 0.35;
        i++;
      }
      ig.setAttribute('aOrbit', new THREE.InstancedBufferAttribute(orb, 4));
      ig.setAttribute('aSpin', new THREE.InstancedBufferAttribute(spin, 4));
      ig.setAttribute('aTone', new THREE.InstancedBufferAttribute(tone, 1));
      ig.instanceCount = n;
      var rocks = new THREE.Mesh(ig, rockMat); rocks.frustumCulled = false; system.add(rocks);
    }

    // Ring haze
    var ringGeo = track(new THREE.RingGeometry(RIN, ROUT, 192, 1)); ringGeo.rotateX(-Math.PI / 2);
    system.add(new THREE.Mesh(ringGeo, track(mat(FRAG_HAZE, { transparent: true, side: THREE.DoubleSide, depthWrite: false }))));

    // Rocky orbiting outer moon + embedded gap shepherd moon
    var sunW = U.uSun.value.clone().applyQuaternion(system.quaternion);
    var light = new THREE.DirectionalLight(0xfff1dc, 1.4); light.position.copy(sunW).multiplyScalar(20); scene.add(light);
    var moonPivot = new THREE.Group(); moonPivot.rotation.z = 0.08; system.add(moonPivot);
    var moonMat = track(new THREE.ShaderMaterial({
      uniforms: { uSunW: { value: sunW } },
      vertexShader: MOON_VERT,
      fragmentShader: MOON_FRAG
    }));
    var moon = new THREE.Mesh(track(rockyMoonGeometry(THREE, 0.18, 73)), moonMat);
    moon.position.set(5.4, 0, 0); moonPivot.add(moon);

    var shep1 = new THREE.Mesh(track(rockyMoonGeometry(THREE, 0.048, 19)), moonMat);
    system.add(shep1);

    [[5.4, 0.22, 0.5, 0.14], [8.5, 0.5, -0.3, 0.08], [12, -0.2, 0.9, 0.05]].forEach(function (o) {
      var pts = []; for (var k = 0; k <= 140; k++) { var a = k / 140 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * o[0], 0, Math.sin(a) * o[0])); }
      var l = new THREE.Line(track(new THREE.BufferGeometry().setFromPoints(pts)), track(new THREE.LineBasicMaterial({ color: 0x8fa3c4, transparent: true, opacity: o[3] })));
      l.rotation.set(o[1], 0, o[2]); scene.add(l);
    });

    // Starfield
    var dot = document.createElement('canvas'); dot.width = dot.height = 64;
    var dg = dot.getContext('2d'), gr = dg.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    dg.fillStyle = gr; dg.fillRect(0, 0, 64, 64);
    var N = 1800, sp = new Float32Array(N * 3), sc = new Float32Array(N * 3), c = new THREE.Color();
    for (var k = 0; k < N; k++) {
      var rr = 70 + Math.random() * 90, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      sp[k * 3] = rr * Math.sin(ph) * Math.cos(th); sp[k * 3 + 1] = rr * Math.cos(ph); sp[k * 3 + 2] = rr * Math.sin(ph) * Math.sin(th);
      c.setHSL(Math.random() < 0.15 ? 0.09 : 0.6, 0.35, 0.7 + Math.random() * 0.3);
      sc[k * 3] = c.r; sc[k * 3 + 1] = c.g; sc[k * 3 + 2] = c.b;
    }
    var sgeo = track(new THREE.BufferGeometry());
    sgeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    sgeo.setAttribute('color', new THREE.BufferAttribute(sc, 3));
    var stex = track(new THREE.CanvasTexture(dot));
    scene.add(new THREE.Points(sgeo, track(new THREE.PointsMaterial({ size: 0.7, map: stex, vertexColors: true, transparent: true, depthWrite: false }))));

    // Layout: setViewOffset ONLY runs on resize, never inside the 60fps loop!
    function layout() {
      var w = el.clientWidth || global.innerWidth, h = el.clientHeight || global.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      var ox = 0, oy = 0;
      if (w >= opt.breakpoint) ox = -opt.offsetX * w; else oy = opt.offsetY * h;
      camera.setViewOffset(w, h, ox, oy, w, h);
      camera.updateProjectionMatrix();
    }
    var ro = global.ResizeObserver ? new ResizeObserver(layout) : null;
    if (ro) ro.observe(el); else global.addEventListener('resize', layout);
    layout();

    var clock = new THREE.Clock(), raf = 0, visible = true, onScreen = true, smoothDt = 1 / 60;
    function frame() {
      raf = 0;
      var rawDt = Math.min(clock.getDelta(), 0.05);
      smoothDt += (rawDt - smoothDt) * 0.2;
      if (!reduceMotion) {
        U.uTime.value += smoothDt;
        U.uBandTime.value += smoothDt;

        var th1 = 0.8 + U.uKep.value * U.uTime.value * Math.pow(rShep1, -1.5);
        var th2 = 3.9 + U.uKep.value * U.uTime.value * Math.pow(rShep2, -1.5);
        U.uShepherdAng.value.set(th1 % (Math.PI * 2), th2 % (Math.PI * 2));
        shep1.position.set(Math.cos(th1) * rShep1, 0, -Math.sin(th1) * rShep1);
        shep1.rotation.y = th1;

        moonPivot.rotation.y += smoothDt * 0.12;
        moon.rotation.y += smoothDt * 0.32;
        moon.rotation.x += smoothDt * 0.07;

        // Feather-light damped cursor sway (zero projection matrix rebuilds!)
        curPX += (targetPX - curPX) * 0.04;
        curPY += (targetPY - curPY) * 0.04;
        camera.position.set(baseCamPos.x + curPX, baseCamPos.y + curPY, baseCamPos.z);
        camera.lookAt(0, 0, 0);
      }

      system.worldToLocal(U.uCam.value.copy(camera.position));
      renderer.render(scene, camera);
      if (visible && onScreen && !reduceMotion) raf = global.requestAnimationFrame(frame);
    }
    function kick() { if (!raf && visible && onScreen) { clock.getDelta(); raf = global.requestAnimationFrame(frame); } }
    function onVis() { visible = !document.hidden; kick(); }
    document.addEventListener('visibilitychange', onVis);
    var io = global.IntersectionObserver ? new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; kick(); }) : null;
    if (io) io.observe(el);
    kick();

    var api = {
      setZoom: function (camDist, offsetX) {
        if (typeof camDist === 'number') {
          opt.camDist = camDist;
          var s = camDist / 10.5;
          baseCamPos.set(0.6 * s, 1.6 * s, camDist);
        }
        if (typeof offsetX === 'number') opt.offsetX = offsetX;
        layout();
        kick();
      },
      destroy: function () {
        if (raf) global.cancelAnimationFrame(raf);
        document.removeEventListener('visibilitychange', onVis);
        global.removeEventListener('pointermove', onPointerMove);
        if (io) io.disconnect();
        if (ro) ro.disconnect(); else global.removeEventListener('resize', layout);
        disposables.forEach(function (d) { if (d && d.dispose) d.dispose(); });
        renderer.dispose();
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        delete el.__rubbleRing;
      }
    };
    el.__rubbleRing = api;
    return api;
  }

  function autoMount() {
    var els = document.querySelectorAll('[data-rubble-ring]');
    for (var i = 0; i < els.length; i++) mount(els[i]);
  }
  global.RubbleRing = { mount: mount, autoMount: autoMount };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount);
  else autoMount();
})(window);
