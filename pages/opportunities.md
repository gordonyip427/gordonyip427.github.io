---
layout: page
title: "Collaborate & opportunities"
eyebrow: "Research group & cross-sector collaboration"
subtitle: "Select a track below to explore PhD and visiting researcher opportunities in my group at King's College London, or external collaborations across AI for Science, model evaluation, and space systems."
description: "PhD opportunities for October 2027 entry with Dr Gordon (Kai Hou) Yip at King's College London, alongside interdisciplinary and external research collaborations in AI for Science, model evaluation, and space systems."
permalink: /opportunities/
---

<div class="collab-tabs" role="tablist" aria-label="Collaboration tracks">
  <button class="collab-tab-btn is-active" id="tab-group" role="tab" aria-selected="true" aria-controls="panel-group" type="button" data-tab-target="panel-group">
    <span class="collab-tab-title">Join the Research Group</span>
    <span class="collab-tab-sub">Oct 2027 PhD studentships, MSc projects &amp; visiting researchers</span>
  </button>
  <button class="collab-tab-btn" id="tab-external" role="tab" aria-selected="false" aria-controls="panel-external" type="button" data-tab-target="panel-external">
    <span class="collab-tab-title">Research &amp; Benchmark Collaboration</span>
    <span class="collab-tab-sub">AI for Science surrogates, ML evaluation benchmarks &amp; space systems</span>
  </button>
</div>

<!-- PANEL 1: RESEARCH GROUP (PHD, MSC & VISITING) -->
<div class="collab-panel is-active" id="panel-group" role="tabpanel" aria-labelledby="tab-group">
  <!-- 01 / HOW TO APPLY & SUPERVISORY STYLE -->
  <section class="ledger-block">
    <div class="ledger-header">
      <span class="block-index">01 &middot; Research group</span>
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
</div>

<!-- PANEL 2: EXTERNAL & INTERDISCIPLINARY COLLABORATION -->
<div class="collab-panel" id="panel-external" role="tabpanel" aria-labelledby="tab-external" hidden>
  <section class="ledger-block">
    <div class="ledger-header">
      <span class="block-index">01 &middot; Focus areas</span>
      <h2 class="block-heading">Cross-sector &amp; interdisciplinary collaboration</h2>
    </div>
    <div class="systems-grid">
      {% for track in site.data.opportunities.advisory_tracks %}
      <article class="system-card">
        <div class="system-card-top">
          <span class="system-badge">Collaboration Track</span>
          <h3 class="system-title">{{ track.title }}</h3>
        </div>
        <p class="system-summary">{{ track.description }}</p>
        {% if track.tags %}
        <div class="timeline-inline">
          {% for tag in track.tags %}
          <span class="timeline-chip">{{ tag }}</span>
          {% endfor %}
        </div>
        {% endif %}
        <div class="system-links">
          <a class="pill-link" href="mailto:{{ site.author.email }}?subject={{ track.email_subject }}">Get in touch &nearr;</a>
        </div>
      </article>
      {% endfor %}
    </div>
  </section>

  <section class="ledger-block">
    <div class="ledger-header">
      <span class="block-index">02 &middot; Community &amp; talks</span>
      <h2 class="block-heading">Seminars, workshops &amp; benchmark co-design</h2>
    </div>
    <ul class="one-line-list">
      <li class="one-line-item">
        <span class="item-text"><strong>Invited talks &amp; working groups.</strong> I regularly speak at research labs, industry R&amp;D seminars, and policy forums on physics-informed machine learning, uncertainty calibration, and the Ariel Data Challenge.</span>
        <span class="item-links">
          <a class="pill-link" href="mailto:{{ site.author.email }}?subject=Speaking%20or%20workshop%20invitation">Invite / connect &nearr;</a>
        </span>
      </li>
    </ul>
  </section>
</div>

<script>
  (function() {
    var btns = document.querySelectorAll('.collab-tab-btn');
    var panels = document.querySelectorAll('.collab-panel');
    if (!btns.length) return;

    function activateTab(targetId) {
      for (var i = 0; i < btns.length; i++) {
        var isMatch = btns[i].getAttribute('data-tab-target') === targetId;
        btns[i].classList.toggle('is-active', isMatch);
        btns[i].setAttribute('aria-selected', isMatch ? 'true' : 'false');
      }
      for (var j = 0; j < panels.length; j++) {
        var show = panels[j].id === targetId;
        panels[j].classList.toggle('is-active', show);
        if (show) {
          panels[j].removeAttribute('hidden');
          var reveals = panels[j].querySelectorAll('.reveal-section');
          for (var r = 0; r < reveals.length; r++) {
            reveals[r].classList.add('is-visible');
          }
        } else {
          panels[j].setAttribute('hidden', '');
        }
      }
    }

    for (var k = 0; k < btns.length; k++) {
      btns[k].addEventListener('click', function() {
        activateTab(this.getAttribute('data-tab-target'));
      });
    }

    if (window.location.hash === '#external') {
      activateTab('panel-external');
    }
  })();
</script>
