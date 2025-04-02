import {
  CalendarBody,
  CalendarContainer,
  CalendarHeader,
  DateOrDateTime,
  EventItem,
  EventItemInternal,
  PackedEvent,
  SizeAnimation,
} from "@howljs/calendar-kit";
import React, { memo } from "react";
import { VStack } from "../vstack";
import { Text } from "../text";
import { cn } from "@/lib/cn";
import { HStack } from "../hstack";
import { Heading } from "../heading";

interface CalendarProps {
  events: EventItem[];
}

type TCardEventTKBDKMH = {
  event: PackedEvent;
  size: SizeAnimation;
};

const CardEventTKBDKMH = ({ event, size }: TCardEventTKBDKMH) => {
  const data = event.data ?? {};
  if (!data)
    return (
      <VStack className={`flex-1`}>
        <Text>{event.title}</Text>
      </VStack>
    );

  return (
    <VStack className={`flex-1 bg-[#FAFAD2]`}>
      <Text className="font-medium">{event.title}</Text>
      <HStack className="gap-1 flex-wrap">
        <Heading size="xs">GV:</Heading>
        <Text>{data.ten_giang_vien}</Text>
      </HStack>
      <HStack className="gap-1 flex-wrap">
        <Heading size="xs">Phòng học:</Heading>
        <Text size="sm">{data.ma_phong}</Text>
      </HStack>
    </VStack>
  );
};

const Calendar = ({ events }: CalendarProps) => {
  console.log("re-render", events);
  const handleDragCreateStart = (start) => {
    console.log("Started creating event at:", start);
    // You can use this to show a UI indicator that event creation has started
  };

  const handleDragCreateEnd = (event) => {
    console.log("New event:", event);
    // Here you would typically add the new event to your events array
    // and possibly open a modal for the user to add more details
  };

  return (
    <CalendarContainer
      events={events}
      allowDragToCreate
      onDragCreateEventStart={handleDragCreateStart}
      onDragCreateEventEnd={handleDragCreateEnd}
      defaultDuration={0.1}
      numberOfDays={4}
      scrollToNow
      minDate="2025-04-01"
      maxDate="2025-04-30"
    >
      <CalendarHeader />
      <CalendarBody
        renderEvent={(e, size) => {
          console.log("RENDER EVENT", e, size);
          const typeEvent = e.typeEvent ?? "default";
          if (typeEvent === "default")
            return (
              <VStack className={`flex-1 bg-[#FAFAD2]`}>
                <Text className="font-medium">{e.title}</Text>
              </VStack>
            );

          return <CardEventTKBDKMH event={e} size={size} />;
        }}
      />
    </CalendarContainer>
  );
};

export default memo(Calendar);
