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
UC Berkeley, Spring 2026
{: .mb-0 .fs-6 .text-grey-dk-000 }

[DataHub](http://data100.datahub.berkeley.edu/){:target="_blank" .btn .btn-datahub .mr-1 }
[Pensieve](https://www.pensieve.co/){:target="_blank" .btn .btn-pensieve .mr-1 }
[EdStem](https://edstem.org/us/){:target="_blank" .btn .btn-ed .mr-1 }
[Office Hours](https://oh.ds100.org/){:target="_blank" .btn .btn-officehours .mr-1}
[Zoom](https://berkeley.zoom.us/j/91466186973){:target="_blank" .btn .btn-zoom .mr-1}
[Askademia Lecture Recordings](https://www.askademia.org/ds100/sp26){:target="_blank" .btn .btn-lectures .mr-1}
[YouTube Lecture Recordings](https://www.youtube.com/playlist?list=PLQCcNQgUcDfopoa1txbWmAOIrZyx0XoZ7){:target="_blank" .btn .btn-youtube .mr-1}

<!-- Commented out due to accessibility issues -->
<!-- <div>
{% assign instructors = site.staffers | where: 'role', 'Instructor' | sort: 'order' %}
  <div class="role">
    {% for staffer in instructors %}
    {{ staffer }}
    {% endfor %}
  </div>
</div> -->

<!-- Also causing accessibility issues -->
<!-- Uncomment if you'd like to use announcements! -->
<!-- {% assign announcement = site.announcements | last %}
{{ announcement }} -->


# Schedule

<div>
{%- include schedule.html -%}
</div>