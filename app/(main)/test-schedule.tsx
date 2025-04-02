import { Button, ButtonText } from "@/components/ui/button";
import Calendar from "@/components/ui/event-calendar";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { AddIcon } from "@/components/ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { z } from "zod";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";


import { EventItem } from "@howljs/calendar-kit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import uuid from "react-native-uuid";
import FormInput from "@/components/ui/form-control/form-input";
import { useQuery } from "@tanstack/react-query";
import { dkmhTdmuService } from "@/service/dkmhTdmuService";
import {
  dateToString,
  loadEventTKBTuan,
  tinhThoiGianHoc,
} from "@/utils/dkmhHelper";
import { useSession } from "@/contexts/SessionContext";

const TestSchedule = () => {
  const { session } = useSession();

  const [isOpenModalAdd, setIsOpenModalAdd] = React.useState(false);
  const [events, setEvents] = React.useState<EventItem[]>([]);

  const stringToTime = (date: string, timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const res = new Date(date);
    res.setHours(hours, minutes, 0, 0);

    // console.log("string to time ", hours, minutes, res);
    return res.toISOString();
  };

  const queryEventDKMH = useQuery({
    queryKey: ["events-dkmh"],
    queryFn: async () => {
      return await dkmhTdmuService.tkbtuanhocky(
        session?.sessionDKMH.access_token ?? "???"
      );
    },
    staleTime: 5 * 24 * 60 * 60 * 1000, // 5 days
  });

  return (
    <VStack className="flex-1">
      <Calendar
        events={[
          ...events,
          ...loadEventTKBTuan(queryEventDKMH.data?.payload).map((e) => {
            const timeObj = tinhThoiGianHoc(e.tiet_bat_dau, e.so_tiet);
            // console.log("timeObj", timeObj); correct
            return {
              id: uuid.v4(),
              title: e.ten_mon,
              start: {
                dateTime: stringToTime(
                  dateToString(new Date(e.ngay_hoc)),
                  timeObj.startTime ?? "00:00"
                ) as any,
                timeZone: "Asia/Bangkok",
              },
              end: {
                dateTime: stringToTime(
                  dateToString(new Date(e.ngay_hoc)),
                  timeObj.endTime ?? "23:59"
                ) as any,
                timeZone: "Asia/Bangkok",
              },
              color: "blue",
              typeEvent: "tkbdkmh",
              data: e,
            };
          }),
        ]}
      />
      <ModalAddEvent
        isOpen={isOpenModalAdd}
        onClose={() => setIsOpenModalAdd(false)}
        onSubmit={(data) => {
          setEvents([
            ...events,
            {
              id: uuid.v4(),
              title: data.title,
              description: data.description,
              start: {
                dateTime: stringToTime(data.dateStart, data.startTime) as any,
                timeZone: "Asia/Bangkok",
              },
              end: {
                dateTime: stringToTime(data.dateEnd, data.endTime) as any,
                timeZone: "Asia/Bangkok",
              },
              color: "blue",
            },
          ]);
          setIsOpenModalAdd(false);
        }}
      />
      <Fab size="lg" onPress={() => setIsOpenModalAdd(true)}>
        <FabIcon as={AddIcon} />
      </Fab>
    </VStack>
  );
};

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dateStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  dateEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  startTime: z.string().regex(/^(\d{1,2}:\d{1,2})$/, "Invalid time format"),
  endTime: z.string().regex(/^(\d{1,2}:\d{1,2})$/, "Invalid time format"),
});

type TForm = z.infer<typeof schema>;

interface ModalAddEventProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: TForm) => void;
}

const ModalAddEvent = ({ isOpen, onClose, onSubmit }: ModalAddEventProps) => {
  const form = useForm<TForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      dateEnd: "2025-04-3",
      dateStart: "2025-04-3",
      startTime: "08:00",
      endTime: "09:00",
      title: "123 tile",
      description: "123 desc",
    },
  });

  return (
    <Modal isOpen={isOpen}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading>Add event</Heading>
        </ModalHeader>

        <ModalBody>
          <VStack space="md">
            <FormInput
              control={form.control}
              name="title"
              formLabelProps={{
                text: "Title",
              }}
              placeholder="Event title"
            />

            <FormInput
              control={form.control}
              name="description"
              formLabelProps={{
                text: "Description",
              }}
              placeholder="Event description"
            />

            <FormInput
              control={form.control}
              name="dateStart"
              formLabelProps={{
                text: "Date start",
              }}
              placeholder="YYYY-MM-DD"
            />

            <FormInput
              control={form.control}
              name="startTime"
              formLabelProps={{
                text: "Start Time",
              }}
              placeholder="HH:MM"
            />

            <FormInput
              control={form.control}
              name="dateEnd"
              formLabelProps={{
                text: "Date end",
              }}
              placeholder="YYYY-MM-DD"
            />

            <FormInput
              control={form.control}
              name="endTime"
              formLabelProps={{
                text: "End Time",
              }}
              placeholder="HH:MM"
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onPress={() => onClose()} variant="outline">
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button onPress={form.handleSubmit(onSubmit)}>
            <ButtonText>Add Event</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default TestSchedule;
