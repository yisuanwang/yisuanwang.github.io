---
permalink: /
title: ""
excerpt: ""
author_profile: false
redirect_from: 
  - /about/
  - /about.html
---

{% if jekyll.environment == "development" %}
  {% capture intro_content %}{% include_relative includes/intro_local.md %}{% endcapture %}
{% else %}
  {% capture intro_content %}{% include_relative includes/intro.md %}{% endcapture %}
{% endif %}
{% capture news_content %}{% include_relative includes/news.md %}{% endcapture %}
{% capture pub_content %}{% include_relative includes/pub.md %}{% endcapture %}
{% capture honors_content %}{% include_relative includes/honers.md %}{% endcapture %}
{% capture journey_content %}{% include_relative includes/others.md %}{% endcapture %}

<span class="anchor" id="about-me"></span>

<div class="home-shell">

  <!-- 1. Combined card -->
  <section class="home-section home-section--combined">

    <!-- Profile row: left profile stack + right intro -->
    <div class="home-combined-layout">
      <div class="home-combined-profile">
        <div class="home-combined-avatar" id="avatar-hover-zone">
          <div class="author__avatar-media">
            <img src="images/cjh-2605.png" class="author__avatar-img" alt="{{ site.author.name }}">
            <video class="author__avatar-video" id="avatar-video" autoplay loop muted playsinline poster="images/cjh-2605.png">
              <source src="images/avatar_ysw-compress.mp4" type="video/mp4">
            </video>
          </div>
          <div class="author__availability">Open to PhD 2027</div>
        </div>

        <div class="home-combined-identity">
          <h1 class="home-combined-name">{{ site.author.name }}</h1>
          <p class="home-combined-affiliation">Tsinghua University</p>
          <p class="home-combined-focus">3D/4D World Modeling &amp; Spatial Intelligence · Generative Modeling for Structured &amp; Controllable Worlds</p>
          <nav class="home-combined-links">
            {% if site.author.email %}<a href="mailto:{{ site.author.email }}" class="home-combined-links__primary">Email</a>{% endif %}
            {% if site.author.googlescholar %}<a href="{{ site.author.googlescholar }}">Scholar</a>{% endif %}
            {% if site.author.github %}<a href="https://github.com/{{ site.author.github }}">GitHub</a>{% endif %}
            {% if site.author.linkedin %}<a href="https://www.linkedin.com/in/{{ site.author.linkedin }}">LinkedIn</a>{% endif %}
          </nav>
        </div>
      </div>

      <div class="home-combined-intro">
        <p class="home-section__eyebrow">Research Interests &amp; Opportunities</p>
{{ intro_content | markdownify }}
        <!-- News — directly below emo link -->
        <span class="anchor" id="news"></span>
        <div class="home-combined-news">
          <p class="home-section__eyebrow">News</p>
{{ news_content | markdownify }}
        </div>
      </div>
    </div>

  </section>

  <!-- 2. Research Themes — local-only section -->
  {% if jekyll.environment == "development" %}
  {% include_relative includes/research_story_local.html %}
  {% endif %}

  <!-- 3. Selected Work — publications by category -->
  <span class="anchor" id="publications"></span>
  <section class="home-section home-section--publications">
    <div class="home-section__intro">
      <p class="home-section__eyebrow">Selected Work</p>
      <h2 class="home-section__title">Representative publications and projects.</h2>
      <p class="home-section__lede">Work across 3D world modeling, interactive video, and controllable character generation.</p>
    </div>
    <div class="home-section__body">
{{ pub_content | markdownify }}
    </div>
  </section>

  <!-- 4. Recognition — single column -->
  <span class="anchor" id="honors"></span>
  <section class="home-section home-section--honors">
    <div class="home-section__intro">
      <p class="home-section__eyebrow">Recognition</p>
      <h2 class="home-section__title">Honors, awards, and competition results.</h2>
      <p class="home-section__lede">Selected recognition from research and engineering work.</p>
    </div>
    <div class="home-section__body">
{{ honors_content | markdownify }}
    </div>
  </section>

  <!-- 5. Journey — single column -->
  <span class="anchor" id="educations"></span>
  <span class="anchor" id="experiences"></span>
  <section class="home-section home-section--journey">
    <div class="home-section__intro">
      <p class="home-section__eyebrow">Journey</p>
      <h2 class="home-section__title">Education, research experience, and service.</h2>
      <p class="home-section__lede">The path that shaped the current research direction.</p>
    </div>
    <div class="home-section__body">
{{ journey_content | markdownify }}
    </div>
  </section>

  <!-- 6. Reach — visitor map -->
  <section class="home-section home-section--reach">
    <div class="home-section__intro">
      <p class="home-section__eyebrow">Reach</p>
      <h2 class="home-section__title">Visitors.</h2>
    </div>
    <div class="home-section__body">
      <div class="home-map" id="home-map-container">
        <script type='text/javascript' id='clustrmaps' src='//cdn.clustrmaps.com/map_v2.js?cl=080808&amp;w=300&amp;t=tt&amp;d=1Sv4Ugc2cDnJZAo8U7-0dJjGxCA1qV2ev2ys6sLKm_M&amp;co=ffffff&amp;cmo=3acc3a&amp;cmn=ff5353&amp;ct=808080'></script>
      </div>
    </div>
  </section>

</div>

<script>
(function () {
  document.querySelectorAll('.home-section--publications .paper-box').forEach(function (box) {
    var badge = box.querySelector('.badge');
    if (!badge || badge.parentNode === box) return;
    box.insertBefore(badge, box.firstChild);
  });

  // ── Badge color classification ──────────────────────
  document.querySelectorAll('.badge').forEach(function (b) {
    var t = b.textContent.trim().toUpperCase();
    if (/\b(ACL|CVPR|ICCV)\b/.test(t)) {
      b.classList.add('badge--red');
    } else if (/\bICLR\b/.test(t)) {
      b.classList.add('badge--blue');
    } else if (/\b(COLING|EMNLP|ECCV)\b/.test(t)) {
      b.classList.add('badge--yellow');
    } else if (/\b(ICANN|MVA|MACHINE VISION)\b/.test(t)) {
      b.classList.add('badge--green');
    } else {
      b.classList.add('badge--gray');
    }
  });

  // ── Publication filter bar ─────────────────────────
  (function () {
    var body = document.querySelector('.home-section--publications .home-section__body');
    if (!body) return;

    function parseTags(raw) {
      return (raw || '')
        .split(',')
        .map(function (tag) { return tag.trim(); })
        .filter(Boolean);
    }

    // Venue detection patterns → normalized name
    var venueRules = [
      [/\bCVPR\b/,              'CVPR'],
      [/\bECCV\b/,              'ECCV'],
      [/\bICCV\b/,              'ICCV'],
      [/\bICLR\b/,              'ICLR'],
      [/\bACL\b/,               'ACL'],
      [/\bEMNLP\b/,             'EMNLP'],
      [/\bCOLING\b/,            'COLING'],
      [/\bICANN\b/,             'ICANN'],
      [/MACHINE\s+VISION|MVA/i, 'MVA'],
      [/\barxiv\b/i,            'arXiv'],
      [/inreview/i,             'Under Review'],
    ];

    // Walk children: track current h2-level category, then tag each paper-box
    var currentCat = '';
    Array.from(body.children).forEach(function (el) {
      if (el.tagName === 'H2') {
        var t = el.textContent.toUpperCase();
        if (t.includes('3D/4D') || t.includes('SPATIAL INTELLIGENCE') || t.includes('EMBODIED AI')) currentCat = '3D / Embodied';
        else if (t.includes('STRUCTURED') || t.includes('CONTROLLABLE WORLDS')) currentCat = 'Structured Worlds';
        else if (t.includes('PERCEPTION') || t.includes('UNDERSTANDING')) currentCat = 'Perception';
        else if (t.includes('FOUNDATION') || t.includes('REASONING'))     currentCat = 'Foundation Models';
        else currentCat = t.trim().slice(0, 24);
      }
      if (!el.classList.contains('paper-box')) return;
      el.dataset.category = currentCat;
      var badge = el.querySelector('.badge');
      var raw   = badge ? badge.textContent.trim().toUpperCase() : '';
      var venue = 'Under Review';
      for (var i = 0; i < venueRules.length; i++) {
        if (venueRules[i][0].test(raw)) { venue = venueRules[i][1]; break; }
      }
      el.dataset.venue = venue;
    });

    // Collect values that actually exist in the DOM
    var allBoxes  = Array.from(body.querySelectorAll('.paper-box'));
    var venueOrder = ['CVPR','ECCV','ICCV','ICLR','ACL','EMNLP','COLING','ICANN','MVA','arXiv','Under Review'];
    var catOrder   = ['3D / Embodied','Structured Worlds','Perception','Foundation Models'];
    var tagOrder   = ['3D','4D','Video','Image','Human','Avatar','Scene','Object','Garment','Texture','Structured Data','Vector Graphics','Generation','Generative Rendering','Reconstruction','Articulate Objects','Animation','Interaction','Rigging','Perception','Understanding','Dense Prediction','Multimodal','Audio','Neuromorphic','LLM','VLM','Agents','Reasoning','Benchmark','Evaluation','Code','Web','NLP'];
    var usedTagSet = new Set();
    var usedVenues = venueOrder.filter(function (v) {
      return allBoxes.some(function (b) { return b.dataset.venue === v; });
    });
    var usedCats = catOrder.filter(function (c) {
      return allBoxes.some(function (b) { return b.dataset.category === c; });
    });
    allBoxes.forEach(function (box) {
      var tags = parseTags(box.dataset.tags);
      var text = box.querySelector('.paper-box-text');
      box._pubTags = tags;
      tags.forEach(function (tag) { usedTagSet.add(tag); });
      if (!text || !tags.length || text.querySelector('.pub-tag-list')) return;

      var tagList = document.createElement('div');
      tagList.className = 'pub-tag-list';
      tags.forEach(function (tag) {
        var chip = document.createElement('span');
        chip.className = 'pub-tag';
        chip.textContent = tag;
        tagList.appendChild(chip);
      });
      text.appendChild(tagList);
    });
    var usedTags = tagOrder.filter(function (tag) {
      return usedTagSet.has(tag);
    }).concat(
      Array.from(usedTagSet).filter(function (tag) {
        return tagOrder.indexOf(tag) === -1;
      }).sort()
    );

    // Build chip
    function chip(label, group, value) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pub-filter-chip';
      btn.textContent = label;
      btn.dataset.group = group;
      btn.dataset.venue = (group === 'venue') ? value : '';
      btn.dataset.value = value;
      return btn;
    }

    // Build bar
    var bar = document.createElement('div');
    bar.className = 'pub-filter-bar';

    function buildRow(labelText, group, values) {
      var row = document.createElement('div');
      row.className = 'pub-filter-row';
      var lbl = document.createElement('span');
      lbl.className = 'pub-filter-label';
      lbl.textContent = labelText;
      row.appendChild(lbl);
      var all = chip('All', group, '');
      all.classList.add('is-active');
      row.appendChild(all);
      values.forEach(function (v) { row.appendChild(chip(v, group, v)); });
      return row;
    }

    bar.appendChild(buildRow('Venue', 'venue', usedVenues));
    bar.appendChild(buildRow('Topic', 'category', usedCats));
    if (usedTags.length) {
      bar.appendChild(buildRow('Tags', 'tag', usedTags));
    }

    // Insert before first child (the h1 Publications heading)
    body.insertBefore(bar, body.firstChild);

    // Active filter state
    var active = { venue: '', category: '', tag: '' };

    function applyFilter() {
      // Show / hide paper-boxes
      allBoxes.forEach(function (box) {
        var ok = (!active.venue    || box.dataset.venue    === active.venue) &&
                 (!active.category || box.dataset.category === active.category) &&
                 (!active.tag      || (box._pubTags || []).indexOf(active.tag) !== -1);
        box.classList.toggle('pub-hidden', !ok);
      });

      // Show / hide h2 and h3 headings whose entire section is hidden
      var els = Array.from(body.children);
      els.forEach(function (el, i) {
        if (el.tagName !== 'H2' && el.tagName !== 'H3') return;
        var level = parseInt(el.tagName[1], 10);
        var hasVisible = false;
        for (var j = i + 1; j < els.length; j++) {
          var tag = els[j].tagName;
          if (tag === 'H2') break;                       // next h2 always ends scan
          if (tag === 'H3' && level === 3) break;        // next h3 ends h3 scan
          if (els[j].classList.contains('paper-box') && !els[j].classList.contains('pub-hidden')) {
            hasVisible = true; break;
          }
        }
        el.style.display = hasVisible ? '' : 'none';
      });
    }

    bar.addEventListener('click', function (e) {
      var c = e.target.closest('.pub-filter-chip');
      if (!c) return;
      var group = c.dataset.group;
      var value = c.dataset.value;
      // Toggle: clicking the active non-All chip clears it
      active[group] = (active[group] === value && value !== '') ? '' : value;
      // Update chip active states
      bar.querySelectorAll('.pub-filter-chip[data-group="' + group + '"]').forEach(function (ch) {
        var isAll = ch.dataset.value === '';
        ch.classList.toggle('is-active', isAll ? active[group] === '' : ch.dataset.value === active[group]);
      });
      applyFilter();
    });
  })();

})();
</script>

<script>
// ── Avatar video hover (isolated block) ──────────────
(function () {
  var zone  = document.getElementById('avatar-hover-zone');
  var video = document.getElementById('avatar-video');
  var media = zone ? zone.querySelector('.author__avatar-media') : null;
  if (!zone || !video || !media) return;

  function showVideo() {
    video.style.transition = 'opacity 0.4s ease';
    video.style.opacity = '1';
    var img = zone.querySelector('.author__avatar-img');
    if (img) {
      img.style.transition = 'opacity 0.4s ease';
      img.style.opacity = '0';
    }
  }

  function hideVideo() {
    if (zone.classList.contains('is-audio-active')) return;
    video.style.opacity = '0';
    var img = zone.querySelector('.author__avatar-img');
    if (img) img.style.opacity = '1';
  }

  // Ensure video is playing in background (muted autoplay)
  video.play().catch(function () {});

  zone.addEventListener('mouseenter', function () {
    showVideo();
  });

  zone.addEventListener('mouseleave', function () {
    hideVideo();
  });

  media.addEventListener('click', function (e) {
    e.preventDefault();

    video.muted = !video.muted;
    zone.classList.toggle('is-audio-active', !video.muted);
    showVideo();
    video.play().catch(function () {});

    if (video.muted && !zone.matches(':hover')) {
      hideVideo();
    }
  });
})();
</script>
