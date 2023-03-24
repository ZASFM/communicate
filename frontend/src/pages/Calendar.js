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
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  VStack,
  FormControl,
  Input,
  Button,
  Text,
  Box,
  StackDivider
} from '@chakra-ui/react';
import axios from "axios";
import { ChatState } from "../contexts/ChatContext";
const DragAndDropCalendar = withDragAndDrop(Calendar);

const CalendarComp = () => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    chatId: '',
    users: []
  });
  const {selectedChat}=ChatState();
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
    ({ event, start, end}) => {
/*       const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }
 */
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id);
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setMyEvents]
  );

  const resizeEvent = ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id);
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    }


  const defaultDate = useMemo(() => new Date(), []);

  const submitEvent = async () => {
    try {
       setMyEvents(preVal=>[...preVal,newEvent])
    } catch (err) {
       console.log(err);
    }  
  }

  return (
    <VStack
    divider={<StackDivider borderColor="blackAlpha.400" />}
    spacing={4}
    >
    <Text 
       fontSize="lg" 
       padding="5px"
       borderRadius="5px"
       textAlign="center"
       marginTop="10px"
       style={{
          backgroundColor:"white"
       }}
    >
      Showing calender for chat: {`${selectedChat.groupChatName}`}
    </Text>
    <Box
      display="flex"
      justifyContent="space-between"
      gap="100px"
      alignItems="center"
      w="100%"
      p="100px"
      height="700px"
    >
      <DragAndDropCalendar
        defaultDate={defaultDate}
        defaultView={Views.MONTH}
        events={myEvents}
        localizer={localizer}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        popup
        resizable
        style={{
          backgroundColor: 'white',
          borderRadius: '5px',
          height: '100%',
          width: '700px',
          boxShadow: '5px 10px #888888'
        }}
      />
      <FormControl
        style={{
          backgroundColor: 'white'
        }}
        padding="10px"
        width="35%"
      >
        <Input
          type="text"
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          placeholder="Add event title"
          marginBottom="10px"
        />
        <Box
          display="flex"
          justifyContent="space-between"
          gap="20px"
          marginX="auto"
          border="1px"
          borderColor="blackAlpha.400"
          marginBottom="10px"
          borderRadius="5px"
        >
          <DatePicker
            selected={newEvent.start}
            onChange={(start) => setNewEvent({ ...newEvent, start })}
            placeholderText="Start date"
          />
          <DatePicker
            selected={newEvent.end}
            onChange={(end) => setNewEvent({ ...newEvent, end })}
            placeholderText="End date"
          />
        </Box>
        <Button
          onClick={submitEvent}
          colorScheme='teal'
        >
          Add
        </Button>
      </FormControl>
    </Box>
    </VStack>
  );
}

export default CalendarComp;