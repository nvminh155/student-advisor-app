import { Stack, Tabs } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "@/contexts/notification-context";

import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { ToastProvider } from "@gluestack-ui/toast";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const queryClient = new QueryClient();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log("✅ Received a notification in the background!", {
      data,
      error,
      executionInfo,
    });
    // Do something with the notification data
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <NotificationProvider>
            <AuthProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </AuthProvider>
          </NotificationProvider>
        </ToastProvider>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
