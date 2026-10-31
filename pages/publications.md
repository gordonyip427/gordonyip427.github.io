---
layout: page
title: "Publications"
eyebrow: "Bibliographic record · K. H. Yip"
subtitle: "I publish under Kai Hou Yip (K. H. Yip). The complete bibliography is maintained on NASA ADS and arXiv."
description: "Full publication list of Dr Gordon (Kai Hou) Yip (publishing as K. H. Yip) across exoplanet atmospheric retrieval, neural emulators, explainable AI, and the Ariel Data Challenge."
permalink: /publications/
---

<!-- 01 / EXTERNAL INDEXES -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">01 &middot; External indexes</span>
    <h2 class="block-heading">Full bibliographic databases</h2>
  </div>
  <ul class="one-line-list">
    <li class="one-line-item">
      <span class="item-text"><strong>NASA ADS library.</strong> Complete refereed and unrefereed bibliography under K. H. Yip.</span>
      <span class="item-links">
        <a class="pill-link" href="{{ site.author.ads_library }}" target="_blank" rel="noopener">View NASA ADS &nearr;</a>
      </span>
    </li>
    <li class="one-line-item">
      <span class="item-text"><strong>arXiv preprints.</strong> Open access astrophysics and machine learning preprints.</span>
      <span class="item-links">
        <a class="pill-link" href="https://arxiv.org/search/astro-ph?searchtype=author&query=Yip,+K+H" target="_blank" rel="noopener">Search arXiv &nearr;</a>
      </span>
    </li>
  </ul>
</section>

<!-- 02 / PUBLICATION RECORD -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">02 &middot; Papers</span>
    <h2 class="block-heading">Publication record</h2>
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
