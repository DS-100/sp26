---
layout: page
title: Schedule
nav_order: 1
permalink: /
seo:
  type: Course
  name: Data 100
---

# Data 100: Principles and Techniques of Data Science
## UC Berkeley, Spring 2026 
{: .mb-2 .fs-6 .text-grey-dk-000 style="margin-top: 0;"  }

[DataHub](https://data100.datahub.berkeley.edu/){:target="_blank" .btn .btn-datahub .mr-1}
[Pensieve](https://www.pensieve.co/){:target="_blank" .btn .btn-pensieve .mr-1}
[EdStem](https://edstem.org/us/){:target="_blank" .btn .btn-ed .mr-1}
[Office Hours](https://oh.ds100.org/){:target="_blank" .btn .btn-officehours .mr-1}
[Discussions & Tutoring](https://sections.ds100.org/){:target="_blank" .btn .btn-sections .mr-1}

[Askademia Livestream](https://www.askademia.org/ds100/sp26/livestream){:target="_blank" .btn .btn-lectures .mr-1}
[Zoom Livestream](https://berkeley.zoom.us/j/91466186973){:target="_blank" .btn .btn-traditional .mr-1}
[Askademia Lecture Recordings](https://www.askademia.org/ds100/sp26){:target="_blank" .btn .btn-lectures .mr-1}
[YouTube Lecture Recordings](https://www.youtube.com/playlist?list=PLQCcNQgUcDfopoa1txbWmAOIrZyx0XoZ7){:target="_blank" .btn .btn-traditional .mr-1}


<div>
  {% assign instructors = site.staffers | where: 'role', 'Instructor' | sort: 'order' %}
  <div class="role instructor-grid">
    {% for staffer in instructors %}
      <div class="staffer-container">
        {{ staffer }}
      </div>
    {% endfor %}
  </div>
</div>

{% assign announcement = site.announcements | where: 'week', site.current_week | first %}
{{ announcement }}

<h2 class="d-flex align-items-center" id="schedule">
  Schedule
  <a href="#week-{{ site.current_week }}" class="btn btn-currentweek">
    Jump to Current Week
  </a>
</h2>

<div>
{%- include schedule.html -%}
</div>
