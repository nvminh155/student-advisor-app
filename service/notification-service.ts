import { env } from "@/config/env";
import { http } from "@/lib/http";
import * as Notifications from "expo-notifications";

export async function scheduleNotification(
  title: string,
  body: string,
  date: Date
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: date,
  });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function setupNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

type TPayloadSendNotification = {
  token: string;
  title: string;
  body: string;
  data: Object;
};

export const notificationService = {
  sendNotification: async (data: TPayloadSendNotification) => {
    return await http.post(
      "/expo/send-push-notification",
      { ...data },
      {
        baseUrl: env.BASE_URL_NODE_SERVER,
      }
    );
  },
};
