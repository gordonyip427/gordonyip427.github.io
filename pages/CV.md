---
layout: page
title: "About & curriculum vitae"
eyebrow: "Technical & academic record · Gordon (Kai Hou) Yip"
subtitle: "I lead scientific AI research at King's College London, coordinate the Machine Learning Working Group at the ESA Ariel Space Mission, and direct the Ariel Data Challenge. I go by Gordon Yip and publish under Kai Hou Yip (K. H. Yip)."
description: "Curriculum vitae and technical profile of Dr Gordon (Kai Hou) Yip, Lecturer in Physics (AI) at King's College London, ML Lead Coordinator for the ESA Ariel mission, and PI of the Ariel Data Challenge."
permalink: /cv/
---

<!-- 01 / CORE CAPABILITIES & TECHNICAL STACK (2x2 GRID) -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">01 &middot; Technical profile</span>
    <h2 class="block-heading">Core capabilities &amp; stack</h2>
  </div>
  <div class="capabilities-grid">
    {% for cap in site.data.cv.capabilities %}
    <article class="system-card capability-card">
      <div class="system-card-top">
        <span class="system-badge">{{ cap.badge }}</span>
        <h3 class="system-title">{{ cap.domain }}</h3>
      </div>
      <p class="system-summary">{{ cap.summary }}</p>
      {% if cap.tags %}
      <div class="timeline-inline">
        {% for tag in cap.tags %}
        <span class="timeline-chip">{{ tag }}</span>
        {% endfor %}
      </div>
      {% endif %}
    </article>
    {% endfor %}
  </div>
</section>

<!-- 02 / LEADERSHIP, MISSIONS & BENCHMARKS -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">02 &middot; Missions &amp; benchmarks</span>
    <h2 class="block-heading">Leadership &amp; public engagement</h2>
  </div>
  <ul class="one-line-list">
    {% for lead in site.data.cv.leadership %}
    <li class="one-line-item">
      <span class="item-text"><strong>{{ lead.title }}</strong> ({{ lead.period }})</span>
      <span class="item-links">
        {% if lead.title contains "Ariel Data Challenge" %}
        <a class="pill-link" href="{{ site.author.ariel_challenge }}" target="_blank" rel="noopener">Open challenge site &nearr;</a>
        <a class="pill-link" href="https://www.kaggle.com/competitions/ariel-data-challenge-2024" target="_blank" rel="noopener">Kaggle 24 &nearr;</a>
        <a class="pill-link" href="https://www.kaggle.com/competitions/ariel-data-challenge-2025" target="_blank" rel="noopener">Kaggle 25 &nearr;</a>
        {% elsif lead.title contains "ESA Ariel" %}
        <a class="pill-link" href="{{ site.author.ariel_mission }}" target="_blank" rel="noopener">Open Ariel mission &nearr;</a>
        {% endif %}
      </span>
    </li>
    {% endfor %}
    {% for srv in site.data.cv.service %}
    <li class="one-line-item">
      <span class="item-text"><strong>{{ srv.role }}.</strong> {{ srv.org }} ({{ srv.period }})</span>
      <span class="item-links">
        {% if srv.url %}
        <a class="pill-link" href="{{ srv.url }}" target="_blank" rel="noopener">{{ srv.url_label }} &nearr;</a>
        {% endif %}
      </span>
    </li>
    {% endfor %}
    {% for item in site.data.news %}
    <li class="one-line-item">
      <span class="item-text"><strong>{{ item.title }}</strong> ({{ item.date }}). {{ item.summary }}</span>
      {% if item.link %}
      <span class="item-links">
        <a class="pill-link" href="{{ item.link }}" target="_blank" rel="noopener">{{ item.badge }} &nearr;</a>
      </span>
      {% endif %}
    </li>
    {% endfor %}
  </ul>
</section>

<!-- 03 / APPOINTMENTS & EDUCATION -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">03 &middot; Career &amp; degrees</span>
    <h2 class="block-heading">Appointments &amp; education</h2>
  </div>
  <ul class="one-line-list">
    {% for item in site.data.cv.appointments %}
    <li class="one-line-item">
      <span class="item-text"><strong>{{ item.role }}</strong>, {{ item.institution }} ({{ item.period }}). {{ item.department }}</span>
      <span class="item-links">
        {% if item.institution == "King's College London" %}
        <a class="pill-link" href="{{ site.author.kcl_profile }}" target="_blank" rel="noopener">King's profile &nearr;</a>
        {% endif %}
      </span>
    </li>
    {% endfor %}
    {% for edu in site.data.cv.education %}
    <li class="one-line-item">
      <span class="item-text"><strong>{{ edu.degree }}</strong>, {{ edu.institution }} ({{ edu.period }}){% if edu.details %}. {{ edu.details }}{% endif %}</span>
    </li>
    {% endfor %}
  </ul>
</section>

<!-- 04 / SUPERVISION -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">04 &middot; Research group</span>
    <h2 class="block-heading">Supervision</h2>
  </div>
  <ul class="one-line-list">
    {% for sup in site.data.cv.supervision %}
    <li class="one-line-item">
      <span class="item-text"><strong>{{ sup.name }}</strong> ({{ sup.period }}). {{ sup.detail }}</span>
    </li>
    {% endfor %}
  </ul>
</section>

<!-- 05 / TEACHING -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">05 &middot; Modules</span>
    <h2 class="block-heading">Teaching</h2>
  </div>
  <ul class="one-line-list">
    {% for mod in site.data.cv.teaching %}
    <li class="one-line-item">
      <span class="item-text"><strong>{% if mod.code %}{{ mod.code }}: {% endif %}{{ mod.title }}.</strong> {{ mod.role }}, {{ mod.institution }} ({{ mod.period }})</span>
    </li>
    {% endfor %}
  </ul>
</section>
