---
layout: page
title: "Publications"
eyebrow: "Selected highlights & full archive · K. H. Yip"
subtitle: "I publish under Kai Hou Yip (K. H. Yip). Highlighted below are representative papers across ML benchmarking, probabilistic inference, neural surrogates, and explainable AI, followed by the complete chronological record."
description: "Selected machine learning and benchmark highlights and full publication list of Dr Gordon (Kai Hou) Yip (publishing as K. H. Yip)."
permalink: /publications/
---

<!-- 01 / SELECTED ML & BENCHMARK HIGHLIGHTS (2x2 GRID) -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">01 &middot; Featured work</span>
    <h2 class="block-heading">Selected ML &amp; benchmark papers</h2>
  </div>
  <div class="featured-pubs-grid">
    {% for item in site.data.selected_publications %}
    <article class="system-card featured-pub-card">
      <div class="system-card-top">
        <span class="system-badge">{{ item.badge }} &middot; {{ item.year }}</span>
        <h3 class="system-title">{{ item.title }}</h3>
        <p class="system-role">{{ item.authors }} &middot; {{ item.venue }}</p>
      </div>
      <p class="system-summary">{{ item.summary }}</p>
      <div class="system-links">
        <a class="pill-link" href="{{ item.url }}" target="_blank" rel="noopener">{{ item.url_label }} &nearr;</a>
      </div>
    </article>
    {% endfor %}
  </div>
</section>

<!-- 02 / PUBLICATION RECORD -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">02 &middot; Full archive</span>
    <h2 class="block-heading">Chronological publication record</h2>
  </div>
  <ul class="one-line-list">
    {% for group in site.data.publications %}
      {% for pub in group.items %}
      <li class="one-line-item">
        <span class="item-text">
          <strong>{{ pub.title }}</strong> ({{ pub.year }}).
          <span class="pub-meta">{{ pub.authors }} &middot; {{ pub.venue }}</span>
        </span>
        <span class="item-links">
          <a class="pill-link" href="{{ pub.url }}" target="_blank" rel="noopener">{{ pub.url_label }} &nearr;</a>
        </span>
      </li>
      {% endfor %}
    {% endfor %}
  </ul>
</section>

<!-- 03 / EXTERNAL INDEXES -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">03 &middot; External indexes</span>
    <h2 class="block-heading">Bibliographic databases</h2>
  </div>
  <ul class="one-line-list">
    <li class="one-line-item">
      <span class="item-text"><strong>Google Scholar &amp; NASA ADS.</strong> Complete refereed and unrefereed bibliography under K. H. Yip.</span>
      <span class="item-links">
        <a class="pill-link" href="{{ site.author.google_scholar }}" target="_blank" rel="noopener">Google Scholar &nearr;</a>
        <a class="pill-link" href="{{ site.author.ads_library }}" target="_blank" rel="noopener">NASA ADS &nearr;</a>
      </span>
    </li>
    <li class="one-line-item">
      <span class="item-text"><strong>arXiv preprints.</strong> Open access machine learning and astrophysics preprints.</span>
      <span class="item-links">
        <a class="pill-link" href="https://arxiv.org/search/astro-ph?searchtype=author&query=Yip,+K+H" target="_blank" rel="noopener">Search arXiv &nearr;</a>
      </span>
    </li>
  </ul>
</section>
