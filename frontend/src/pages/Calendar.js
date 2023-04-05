import React, { useCallback, useMemo, useState, useEffect } from "react";
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
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import {
  Box,
  useToast
} from '@chakra-ui/react';
import axios from "axios";
import { ChatState } from "../contexts/ChatContext";
import AddEventModal from "../components/user/AddEventModal";
import { CalendarIcon } from '@chakra-ui/icons'
const DragAndDropCalendar = withDragAndDrop(Calendar);

const CalendarComp = () => {
  const toast = useToast();
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    chat_id: '',
    users: []
  });
  const [myEvents, setMyEvents] = useState([]);
  const { user, selectedChat } = ChatState();
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
  const defaultDate = useMemo(() => new Date(), []);


  const submitEvent = async () => {
    console.log(newEvent);
    setMyEvents([...myEvents,newEvent]);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        }
      }
      const { data } = await axios.post('http://localhost:5000/api/v1/calendar', {
        title: newEvent.title,
        chat_id: selectedChat._id,
        users: selectedChat.users.map(user => {
          return user._id
        }),
        start: newEvent.start,
        end: newEvent.end
      }, config);

      if (data) {
        setMyEvents([...myEvents, 
          {...data, 
            start:new Date(Date.parse(data.start)),
            end:new Date(Date.parse(data.end))
          }
        ]);
      }
    } catch (err) { 
      toast({
        title: "Error Occured!",
        description: "Failed to post event",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  const fetchEvents = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`http://localhost:5000/api/v1/calendar/get/${selectedChat._id}`, config);
      if (data) {
        const events = data.map(ev => {
          return {
            id: ev._id,
            title: ev.title,
            start: new Date(Date.parse(ev.start)),
            end: new Date(Date.parse(ev.end))
          }
        });
        console.log(events);
        setMyEvents(events);
      }
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to get events",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const updateEvents=async(eventId,start,end)=>{
    try{
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      }
      await axios.put(`http://localhost:5000/api/v1/calendar/update/${eventId}`,{
        start,
        end
      },config);
    }catch(err){
      toast({
        title: "Error Occured!",
        description: "Failed to update event",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  const moveEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id);
        const filtered = prev.filter((ev) => ev.id !== event.id);
        updateEvents(event.id,start,end);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setMyEvents]
  );

  const resizeEvent = ({ event, start, end }) => {
    setMyEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id);
      const filtered = prev.filter((ev) => ev.id !== event.id);
      updateEvents(event.id,start,end);
      return [...filtered, { ...existing, start, end }];
    });
  }

  return (
    <div 
       style={{position:'relative'}}
    >
      <AddEventModal
         newEvent={newEvent}
         setNewEvent={setNewEvent}
         submitEvent={submitEvent}
         selectedChat={ChatState().selectedChat}
      >
        <CalendarIcon cursor="pointer" w={8} h={8}/>
      </AddEventModal>
      <Box
        w="100vw"
        height="100vh"
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
            width: '100%',
            boxShadow: '5px 10px #888888'
          }}
        />
      </Box>
    </div>
  );
}

export default CalendarComp;