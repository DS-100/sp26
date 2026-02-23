---
---

let GOOGLE_CALENDAR_ID = '{{ site.google_calendar.google_calendar_id }}';
let EVENT_CONFIG = {{ site.google_calendar.event_types | jsonify }};

// Visibility state for event type toggles (suffix -> visible)
let eventTypeVisibility = {};

// Display names for toggle buttons (config key -> button label); keys not listed are hidden from toggles
const TOGGLE_DISPLAY_NAMES = {
  'Lecture': 'Lecture',
  'Session': 'Catch-Up',
  'Instructor Office Hours': 'Instructor Office Hours',
  'Office Hours': 'Office Hours',
  'Section': 'Discussion',
  'Other': 'Other',
  // 'Tutoring Section' and 'Exam' omitted = no toggle button (events still show by default)
};

// Order of toggle buttons (config keys)
const TOGGLE_ORDER = ['Lecture', 'Section', 'Office Hours', 'Instructor Office Hours', 'Session', 'Other'];

let extend_event = (event, config) => {
  if (config.background_color) {
      event.backgroundColor = `#${config.background_color}`;
      event.borderColor = '#FFFFFF';
    }
  if (config.text_color) { event.textColor = `#${config.text_color}`; }
  if (config.class) { event.classNames = config.class; }
  if (config.icon) {
    event.extendedProps ||= {};
    event.extendedProps.icon = config.icon;
  }
  return event;
}

let transform_calendar_event = (event) => {
  let title = event.title.trim();
  event.extendedProps ||= {};
  for (config of EVENT_CONFIG) {
    if (config.prefix && title.startsWith(config.prefix)) {
      event.extendedProps.eventTypeSuffix = config.prefix;
      return extend_event(event, config);
    }
    if (config.suffix && title.endsWith(config.suffix.trim())) {
      event.extendedProps.eventTypeSuffix = config.suffix.trim();
      return extend_event(event, config);
    }
  }
  event.extendedProps.eventTypeSuffix = 'Other';
  return event;
}

let create_event_data_transform = () => {
  return (event) => {
    let transformed = transform_calendar_event(event);
    let suffix = transformed.extendedProps?.eventTypeSuffix;
    if (suffix !== undefined && eventTypeVisibility[suffix] === false) {
      return false; // Hide event (FullCalendar requires false, not null)
    }
    return transformed;
  };
};

/* NOTES / Future Things:
 * Set initial date to start of semester if semester is over.
* https://fullcalendar.io/docs/date-navigation
*
*/
document.addEventListener('DOMContentLoaded', function() {
  // Initialize visibility: all event types visible (order: config types first, then Other)
  let eventTypeLabels = [];
  for (let config of EVENT_CONFIG) {
    let label = (config.suffix || config.prefix || '').trim();
    if (label && !eventTypeLabels.includes(label)) eventTypeLabels.push(label);
  }
  eventTypeLabels.push('Other');
  for (let label of eventTypeLabels) {
    eventTypeVisibility[label] = true;
  }

  let calendarEl = document.getElementById('full-calendar');
  let calendar = new FullCalendar.Calendar(calendarEl, {
    // plugins: [FullCalendar.TimeGrid, FullCalendar.GoogleCalendar],
    googleCalendarApiKey: '{{ site.google_calendar.google_api_key }}',
    initialView: 'timeGridWeek',
    // TODO: This should be configurable.
    weekends: false,
    nowIndicator: true,
    // eventMinHeight: 30,
    // TODO: 30 min default makes the calendar tall...
    // 1 hour is too compact?
    // slotDuration: '01:00:00',
    slotMinTime: '09:00:00',
    slotMaxTime: '21:00:00',
    contentHeight: 'auto',
    height: 'auto',
    // This is needed because the < > are not properly labelled for a11y
    buttonIcons: false,
    // More button customizations:
    // https://fullcalendar.io/docs/customButtons
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay' // user can switch between the two
    },
    eventClassNames: 'berkeley-calendar',
    eventSources: [
      {
        googleCalendarId: GOOGLE_CALENDAR_ID,
        eventDataTransform: create_event_data_transform(),
      },
      {
        // UC Berkeley Student Services Calendar
        googleCalendarId: 'c_lublpqqigfijlbc1l4rudcpi5s@group.calendar.google.com',
        eventDataTransform: create_event_data_transform(),
        backgroundColor: '#B3E59A',
        textColor: '#000000',
      },
    ],
    // Additional Custom events
    events: [
       // A Recurring event around the assignment deadline
      //  {
      //   daysOfWeek: [ '3' ], // these recurrent events move separately
      //   startRecur: '2024-09-01',
      //   endRecur: '2024-12-10',
      //   startTime: '16:30:00',
      //   endTime: '17:00:00',
      //   // color: 'red',
      //   display: 'background',
      //   backgroundColor: '#B3E59A',
      //   textColor: '#000000',
      //   title: '5PM Regular Submission Deadline'
      // }
    ],
    eventDidMount: function(args) {
      // This can be called after the event is rendered to manipulate the dom...
      let props = args.event.extendedProps,
        location = '',
        icon = '';
      let titleEl = args.el.querySelector('.fc-event-title'),
          eventTitleContainer = args.el.querySelector('.fc-event-title-container'),
          eventTimeContainer = args.el.querySelector('.fc-event-main-frame'),
          eventTime = args.el.querySelector('.fc-event-time');

      if (eventTimeContainer && eventTitleContainer && eventTime) {
        eventTimeContainer.removeChild(eventTime);
        eventTitleContainer.appendChild(eventTime);
      }

      if (!props) { return; }
      if (props.icon) {
        icon = `<i class="fa-solid ${props.icon}" aria-hidden="true"></i>&nbsp;`
      }
      if (props.location) {
        location = `<br><span class="cal-event-location">${props.location}</span>`;
      }

      titleEl.innerHTML = `${icon}${titleEl.innerHTML}${location}`;
    }
  });
  calendar.render();

  // Build button-toggle UI for event types
  let toggleWrapper = document.createElement('div');
  toggleWrapper.className = 'calendar-event-toggles-wrapper';
  let toggleContainer = document.createElement('div');
  toggleContainer.id = 'calendar-event-toggles';
  toggleContainer.className = 'calendar-event-toggles';
  toggleContainer.setAttribute('role', 'group');
  toggleContainer.setAttribute('aria-label', 'Filter calendar events by type');
  let eventTypeLabelSet = new Set(eventTypeLabels);
  for (let label of TOGGLE_ORDER) {
    if (!eventTypeLabelSet.has(label)) continue;
    let displayName = TOGGLE_DISPLAY_NAMES[label];
    if (displayName === undefined) continue; // no toggle for this type (e.g. Tutoring Section, Exam)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'calendar-toggle-btn active';
    btn.setAttribute('data-event-type', label);
    btn.setAttribute('aria-label', `Toggle ${displayName} events`);
    btn.setAttribute('aria-pressed', 'true');
    btn.textContent = displayName;
    btn.addEventListener('click', function() {
      let active = eventTypeVisibility[label];
      eventTypeVisibility[label] = !active;
      this.classList.toggle('active', eventTypeVisibility[label]);
      this.setAttribute('aria-pressed', String(eventTypeVisibility[label]));
      calendar.refetchEvents();
    });
    toggleContainer.appendChild(btn);
  }
  toggleWrapper.appendChild(toggleContainer);
  calendarEl.parentNode.insertBefore(toggleWrapper, calendarEl);
});