"use client";

import { useState, useEffect } from "react";

import { Calendar } from "react-native-calendars";
import { scheduleNotification } from "@/service/notification-service";

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
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonText,
} from "@/components/ui/button";
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
import { useNotification } from "@/contexts/notification-context";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { FormControl, FormControlLabel } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

export default function ScheduleScreen() {
  const { expoPushToken, notification, error } = useNotification();

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

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

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

  const markedDates = events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = {
        marked: true,
        dotColor: event.type === "class" ? "#4F46E5" : "#10B981",
      };
    }
    return acc;
  }, {} as Record<string, any>);

  // Add special marking for selected date
  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: "#4F46E5",
  };

  const resetForm = () => {
    setNewEvent({
      title: "",
      description: "",
      date: selectedDate,
      startTime: "",
      endTime: "",
      type: "personal",
    });
    setIsEditing(false);
    setCurrentEventId(null);
  };

  const handleAddEvent = async () => {
    if (!user?.uid) {
      toast.show({
        placement: "top",
        render: () => {
          return (
            <Toast action="error" variant="solid">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>
                You must be logged in to add events
              </ToastDescription>
            </Toast>
          );
        },
      });
      return;
    }

    if (
      !newEvent.title ||
      !newEvent.date ||
      !newEvent.startTime ||
      !newEvent.endTime
    ) {
      toast.show({
        placement: "top",
        render: () => {
          return (
            <Toast action="error" variant="solid">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>
                Please fill in all required fields
              </ToastDescription>
            </Toast>
          );
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && currentEventId) {
        // Update existing event
        await updateEventInFirestore(currentEventId, newEvent);

        // Update local state
        setEvents((prev) =>
          prev.map((event) =>
            event.id === currentEventId ? { ...event, ...newEvent } : event
          )
        );

        toast.show({
          placement: "top",
          render: () => {
            return (
              <Toast action="success" variant="solid">
                <ToastTitle>Success</ToastTitle>
                <ToastDescription>Event updated successfully</ToastDescription>
              </Toast>
            );
          },
        });
      } else {
        // Add new event
        const eventData: Omit<Event, "id" | "createdAt" | "updatedAt"> = {
          title: newEvent.title || "",
          description: newEvent.description || "",
          date: newEvent.date || selectedDate,
          startTime: newEvent.startTime || "",
          endTime: newEvent.endTime || "",
          type: (newEvent.type as "class" | "personal") || "personal",
          userId: user.uid,
        };

        const eventId = await addEventToFirestore(eventData);

        // Update local state
        const newEventWithId: Event = {
          ...eventData,
          id: eventId,
        };

        setEvents((prev) => [...prev, newEventWithId]);

        // Schedule a notification for this event
        try {
          const [hours, minutes] = eventData.startTime.split(":").map(Number);
          const notificationDate = new Date(eventData.date);
          notificationDate.setHours(hours);
          notificationDate.setMinutes(minutes - 30); // 30 minutes before event

          // Only schedule if the notification time is in the future
          if (notificationDate > new Date()) {
            await scheduleNotification(
              eventData.title,
              `${eventData.description} starts at ${eventData.startTime}`,
              notificationDate
            );
          }
        } catch (error) {
          console.error("Failed to schedule notification", error);
        }

        toast.show({
          placement: "top",
          render: () => {
            return (
              <Toast action="success" variant="solid">
                <ToastTitle>Success</ToastTitle>
                <ToastDescription>Event added successfully</ToastDescription>
              </Toast>
            );
          },
        });
      }
    } catch (error) {
      console.error("Failed to save event", error);
      toast.show({
        placement: "top",
        render: () => {
          return (
            <Toast action="error" variant="solid">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>Failed to save event</ToastDescription>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
      setShowAddModal(false);
      resetForm();
    }
  };

  const handleEditEvent = (event: Event) => {
    setNewEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      type: event.type,
    });
    setIsEditing(true);
    setCurrentEventId(event.id ?? "");
    setShowAddModal(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!id) return;

    setIsLoading(true);
    try {
      await deleteEventFromFirestore(id);

      // Update local state
      setEvents((prev) => prev.filter((event) => event.id !== id));

      toast.show({
        placement: "top",
        render: () => {
          return (
            <Toast action="success" variant="solid">
              <ToastTitle>Success</ToastTitle>
              <ToastDescription>Event deleted successfully</ToastDescription>
            </Toast>
          );
        },
      });
    } catch (error) {
      console.error("Failed to delete event", error);
      toast.show({
        placement: "top",
        render: () => {
          return (
            <Toast action="error" variant="solid">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>Failed to delete event</ToastDescription>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex-1 bg-backgroundLight100">
      <VStack className="flex-1">
        <Box className="p-4">
          <Calendar
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
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

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
      >
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Text>{isEditing ? "Edit Event" : "Add New Event"}</Text>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <FormControl>
                <FormControlLabel><Text>Title</Text></FormControlLabel>
                <Input>
                  <InputField
                    placeholder="Event title"
                    value={newEvent.title}
                    onChangeText={(text) =>
                      setNewEvent({ ...newEvent, title: text })
                    }
                  />
                </Input>
              </FormControl>

              <FormControl>
                <FormControlLabel>
                  <Text>Description</Text>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="Event description"
                    value={newEvent.description}
                    onChangeText={(text) =>
                      setNewEvent({ ...newEvent, description: text })
                    }
                  />
                </Input>
              </FormControl>

              <FormControl>
                <FormControlLabel>
                  <Text>Date</Text>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="YYYY-MM-DD"
                    value={newEvent.date}
                    onChangeText={(text) =>
                      setNewEvent({ ...newEvent, date: text })
                    }
                  />
                </Input>
              </FormControl>

              <HStack space="md">
                <FormControl className="flex-1">
                  <FormControlLabel>
                    <Text>Start Time</Text>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="HH:MM"
                      value={newEvent.startTime}
                      onChangeText={(text) =>
                        setNewEvent({ ...newEvent, startTime: text })
                      }
                    />
                  </Input>
                </FormControl>

                <FormControl className="flex-1">
                  <FormControlLabel>
                    <Text>End Time</Text>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="HH:MM"
                      value={newEvent.endTime}
                      onChangeText={(text) =>
                        setNewEvent({ ...newEvent, endTime: text })
                      }
                    />
                  </Input>
                </FormControl>
              </HStack>

              <FormControl>
                <FormControlLabel>
                  <Text>Event Type</Text>
                </FormControlLabel>
                <Select
                  selectedValue={newEvent.type}
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, type: value })
                  }
                >
                  <SelectItem label="Personal" value="personal" />
                  <SelectItem label="Class" value="class" />
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup space="md">
              <Button
                variant="outline"
                onPress={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                isDisabled={isLoading}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                onPress={handleAddEvent}
                // isLoading={isLoading}
                isDisabled={isLoading}
              >
               <ButtonText> {isEditing ? "Update" : "Add"}</ButtonText>
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
