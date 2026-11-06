---
layout: page
title: "Research, benchmarks & space systems"
eyebrow: "Scientific AI & space systems"
subtitle: "Physics-informed neural surrogates, simulation-based inference, and international evaluation benchmarks for physical systems and space missions."
description: "Research themes and ML systems of Dr Gordon (Kai Hou) Yip: simulation-based inference, physics-informed neural surrogates, trustworthy AI evaluation, the ESA Ariel mission, and the Ariel Data Challenge."
permalink: /research/
---

<!-- 01 / FLAGSHIP SYSTEMS, BENCHMARKS & MISSIONS (3-CARD SPOTLIGHT) -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">01 &middot; Systems &amp; missions</span>
    <h2 class="block-heading">Flagship benchmarks, software &amp; missions</h2>
  </div>
  <div>
    <div class="systems-grid">
      {% for sys in site.data.research.featured_systems %}
      <article class="system-card">
        <div class="system-card-top">
          <span class="system-badge">{{ sys.badge }}</span>
          <h3 class="system-title">{{ sys.title }}</h3>
          <p class="system-role">{{ sys.role }}</p>
        </div>
        <p class="system-summary">{{ sys.summary }}</p>
        <div class="system-links">
          {% if sys.url %}
          <a class="pill-link" href="{{ sys.url }}" target="_blank" rel="noopener">{{ sys.url_label }} &nearr;</a>
          {% endif %}
          {% if sys.extra_links %}
          {% for link in sys.extra_links %}
          <a class="pill-link" href="{{ link.url }}" target="_blank" rel="noopener">{{ link.label }} &nearr;</a>
          {% endfor %}
          {% endif %}
        </div>
      </article>
      {% endfor %}
    </div>
  </div>
</section>

<!-- 02 / RESEARCH THEMES -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">02 &middot; Core programme</span>
    <h2 class="block-heading">Scientific AI &amp; methodology</h2>
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
          {% if pillar.tags %}
          <div class="timeline-inline">
            {% for tag in pillar.tags %}
            <span class="timeline-chip">{{ tag }}</span>
            {% endfor %}
          </div>
          {% endif %}
        </div>
      </div>
    </li>
    {% endfor %}
  </ul>
</section>

<!-- 03 / COMMUNITY & TRAINING -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">03 &middot; Community</span>
    <h2 class="block-heading">Hackathons &amp; training</h2>
  </div>
  <ul class="one-line-list">
    <li class="one-line-item">
      <div class="item-text">
        <strong>ExoHack.</strong> Organising multi-university hackathons training researchers and students in scientific machine learning, uncertainty quantification, and space mission data pipelines.
        <div class="timeline-inline">
          <span class="timeline-chip">European university hackathons</span>
          <span class="timeline-chip">Space mission AI training</span>
        </div>
      </div>
    </li>
  </ul>
</section>
