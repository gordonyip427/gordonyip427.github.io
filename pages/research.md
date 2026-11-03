---
layout: page
title: "Research & the Ariel mission"
eyebrow: "Research programme · King's College London"
subtitle: "Statistical inference, neural emulation, and community benchmarks for exoplanet spectroscopy."
description: "Research themes of Dr Gordon (Kai Hou) Yip's group at King's College London: atmospheric retrieval and Bayesian inference, planetary atmosphere emulation, and interpreting and testing scientific AI."
permalink: /research/
---

<!-- 01 / RESEARCH THEMES -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">01 &middot; Core programme</span>
    <h2 class="block-heading">Research themes</h2>
  </div>
  <ul class="one-line-list">
    {% for pillar in site.data.research.pillars %}
    <li class="one-line-item research-theme-item">
      <div class="research-art-wrap">
        <img
          src="{{ pillar.image }}"
          srcset="{{ pillar.image_small }} 480w, {{ pillar.image }} 960w"
          sizes="(max-width: 720px) 80vw, 240px"
          width="{{ pillar.image_width }}"
          height="{{ pillar.image_height }}"
          alt=""
          loading="lazy"
          decoding="async"
          class="research-art-img">
      </div>
      <div class="research-row-main">
        <div class="item-text">
          <strong>{{ pillar.title }}.</strong> {{ pillar.linked_summary }}
        </div>
      </div>
    </li>
    {% endfor %}
  </ul>
</section>

<!-- 02 / CONSORTIA, SOFTWARE & BENCHMARKS -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">02 &middot; Missions &amp; open source</span>
    <h2 class="block-heading">Consortia, software &amp; benchmarks</h2>
  </div>
  <ul class="one-line-list">
    {% for item in site.data.research.initiatives %}
    <li class="one-line-item">
      <span class="item-text">
        <strong>{{ item.title }}.</strong>{% if item.role or item.period %} {{ item.role }}{% if item.period %} ({{ item.period }}){% endif %}.{% endif %}{% if item.summary %} {{ item.summary }}{% endif %}
      </span>
      {% if item.url %}
      <span class="item-links">
        <a class="pill-link" href="{{ item.url }}" target="_blank" rel="noopener">{{ item.url_label }} &nearr;</a>
      </span>
      {% endif %}
    </li>
    {% endfor %}
  </ul>
</section>
