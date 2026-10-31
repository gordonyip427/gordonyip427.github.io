---
layout: page
title: "About & curriculum vitae"
eyebrow: "Academic record · Gordon (Kai Hou) Yip"
subtitle: "I go by Gordon Yip in daily academic life and publish under Kai Hou Yip (K. H. Yip)."
description: "Curriculum vitae of Dr Gordon (Kai Hou) Yip, Lecturer in Physics (AI) at King's College London and ML Lead Coordinator for the ESA Ariel mission."
permalink: /cv/
---

<!-- 01 / APPOINTMENTS & EDUCATION -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">01 &middot; Career &amp; degrees</span>
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

<!-- 02 / TEACHING -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">02 &middot; Modules</span>
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

<!-- 03 / LEADERSHIP, SERVICE & PUBLIC ENGAGEMENT -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">03 &middot; Mission &amp; community</span>
    <h2 class="block-heading">Leadership &amp; public engagement</h2>
  </div>
  <ul class="one-line-list">
    {% for lead in site.data.cv.leadership %}
    <li class="one-line-item">
      <span class="item-text"><strong>{{ lead.title }}</strong> ({{ lead.period }})</span>
      <span class="item-links">
        {% if lead.title contains "Ariel Data Challenge" %}
        <a class="pill-link" href="{{ site.author.ariel_challenge }}" target="_blank" rel="noopener">Open challenge site &nearr;</a>
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
