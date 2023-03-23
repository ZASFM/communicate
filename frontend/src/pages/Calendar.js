import React, { useCallback, useMemo, useState } from "react";
import {
  Calendar,
  Views,
  dateFnsLocalizer
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const DragAndDropCalendar = withDragAndDrop(Calendar);

const CalendarComp=()=>{
  const locales = {
    "en-US": require("date-fns/locale/en-US")
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  });

  const events = [
    {
      title: "Big Meeting",
      start: new Date(2023, 3, 1),
      end: new Date(2023, 3, 3)
    },
    {
      title: "Vacation",
      start: new Date(2023, 3, 1),
      end: new Date(2023, 3, 10)
    },
    {
      title: "Conference",
      start: new Date(2023, 3, 20),
      end: new Date(2023, 3, 23)
    }
  ];

  const [myEvents, setMyEvents] = useState(events);

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end, allDay }];
      });
    },
    [setMyEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setMyEvents]
  );

  const defaultDate = useMemo(() => new Date(2023, 3, 12), []);

  return (
    <div className="height600">
      <DragAndDropCalendar
        defaultDate={defaultDate}
        defaultView={Views.MONTH}
        events={myEvents}
        localizer={localizer}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        popup
        resizable
      />
    </div>
  );
}

export default CalendarComp;