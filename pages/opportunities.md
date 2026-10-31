---
layout: page
title: "Opportunities"
eyebrow: "Opportunities · October 2027 entry"
subtitle: "I welcome enquiries from prospective PhD students in physics, astronomy, computer science, mathematics, or related fields for October 2027 entry, alongside King's project students and visiting researchers."
description: "PhD opportunities for October 2027 entry with Dr Gordon (Kai Hou) Yip at King's College London, including application guidance and King's and China Scholarship Council deadlines."
permalink: /opportunities/
---

<!-- 01 / HOW TO APPLY & SUPERVISORY STYLE -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">01 &middot; First contact</span>
    <h2 class="block-heading">How to apply &amp; supervisory style</h2>
  </div>
  <ul class="one-line-list">
    <li class="one-line-item">
      <span class="item-text"><strong>Initial enquiry.</strong> Email your CV and a few sentences on your interests before preparing a formal research proposal.</span>
      <span class="item-links">
        <a class="pill-link" href="mailto:{{ site.author.email }}?subject=Prospective%20PhD%20enquiry">Email CV &nearr;</a>
      </span>
    </li>
    <li class="one-line-item">
      <span class="item-text"><strong>Supervisory style.</strong> You will be part of a supportive team where everyone explores their own direction. Rather than micromanaging, I give you the space and guidance to make the project your own, and encourage a healthy balance with proper time to rest.</span>
    </li>
  </ul>
</section>

<!-- 02 / PHD STUDENTSHIPS -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">02 &middot; Scholarships &amp; deadlines</span>
    <h2 class="block-heading">PhD studentships (October 2027 entry)</h2>
  </div>
  <ul class="one-line-list">
    {% for pos in site.data.opportunities.phd_positions %}
    <li class="one-line-item">
      <div class="item-text">
        <strong>{{ pos.title }}</strong> ({{ pos.start_date }}{% if pos.funding_code %} &middot; code <code>{{ pos.funding_code }}</code>{% endif %}). {{ pos.one_line | default: pos.funding_note }}
        {% if pos.timeline %}
        <div class="timeline-inline">
          {% for step in pos.timeline %}
          <span class="timeline-chip"><strong>{{ step.stage }}:</strong> {{ step.detail }}</span>
          {% endfor %}
        </div>
        {% endif %}
      </div>
      <span class="item-links">
        {% if pos.official_url %}
        <a class="pill-link" href="{{ pos.official_url }}" target="_blank" rel="noopener">{{ pos.official_url_label }} &nearr;</a>
        {% endif %}
        <a class="pill-link" href="mailto:{{ site.author.email }}?subject={{ pos.email_subject }}">Discuss route &nearr;</a>
      </span>
    </li>
    {% endfor %}
  </ul>
</section>

<!-- 03 / OTHER ROUTES -->
<section class="ledger-block">
  <div class="ledger-header">
    <span class="block-index">03 &middot; Other routes</span>
    <h2 class="block-heading">KCL projects &amp; visiting researchers</h2>
  </div>
  <ul class="one-line-list">
    {% for opp in site.data.opportunities.other_opportunities %}
    <li class="one-line-item">
      <span class="item-text"><strong>{{ opp.role }}.</strong> {{ opp.description }}</span>
      <span class="item-links">
        <a class="pill-link" href="mailto:{{ site.author.email }}?subject={{ opp.role }}%20enquiry">Enquire &nearr;</a>
      </span>
    </li>
    {% endfor %}
  </ul>
</section>
