"use client";

import { useState, useEffect } from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import {
  scheduleNotification,
  registerForPushNotificationsAsync,
} from "@/service/notification-service";

import {
  getUserEvents,
  addEvent as addEventToFirestore,
  updateEvent as updateEventInFirestore,
  deleteEvent as deleteEventFromFirestore,
  type Event,
} from "@/service/schedule-service";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Icon, SearchIcon } from "@/components/ui/icon";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: selectedDate,
    startTime: "",
    endTime: "",
    type: "personal",
  });
  const [pushToken, setPushToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const getPushToken = async () => {
      const token = await registerForPushNotificationsAsync();
      setPushToken(token);
    };
    getPushToken();
  }, []);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  useEffect(() => {
    if (events.length > 0) {
      filterEventsByDate();
    }
  }, [selectedDate, events]);

  const loadEvents = async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    try {
      const userEvents = await getUserEvents(user.uid);
      setEvents(userEvents);
    } catch (error) {
      console.error("Failed to load events", error);
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="solid">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>Failed to load events</ToastDescription>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterEventsByDate = () => {
    const filtered = events.filter((event) => event.date === selectedDate);
    setFilteredEvents(filtered);
  };

  return (
    <Box className="flex-1 bg-backgroundLight100">
      <VStack className="flex-1">
        <Box className="p-4">
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              todayTextColor: "#4F46E5",
              arrowColor: "#4F46E5",
            }}
          />
        </Box>
        <VStack className="flex-1 p-4">
          <HStack className="justify-between items-center mb-4">
            <Heading className="text-md">
              Events for {new Date(selectedDate).toLocaleDateString()}
            </Heading>
            <Button
              className="text-sm"
              onPress={() => {
                setShowAddModal(true);
              }}
              isDisabled={isLoading}
            >
              <ButtonIcon as={SearchIcon} className="text-sm" />
              <ButtonText>Add</ButtonText>
            </Button>
          </HStack>
          <ScrollView className="flex-1">
            {isLoading ? (
              <Box className="flex-1 justify-center items-center p-10">
                <Text>Loading events...</Text>
              </Box>
            ) : (
              <Box className="flex-1 justify-center items-center p-10">
                {/* name="event-busy" */}
                <Icon as={SearchIcon} className="text-xl text-light400 mb-2" />
                <Text className="text-light400">No events for this day</Text>
              </Box>
            )}
          </ScrollView>
        </VStack>
      </VStack>
    </Box>
  );
}
