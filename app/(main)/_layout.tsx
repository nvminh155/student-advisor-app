import { SessionProvider } from "@/contexts/SessionContext";
import { Stack, Tabs } from "expo-router";

export default function MainLayout() {
  return (
    <SessionProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      />
    </SessionProvider>
  );
}
