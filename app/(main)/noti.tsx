import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useNotification } from "@/contexts/notification-context";
import { notificationService } from "@/service/notification-service";
import { useEffect, useState } from "react";
import { Alert, Platform, SafeAreaView, StatusBar } from "react-native";
// import { Text } from "@/components/Text";
// import { ThemedView } from "@/components/ThemedView";
// import * as Updates from "expo-updates";

export default function HomeScreen() {
  const { notification, expoPushToken, error } = useNotification();
  const [value, setValue] = useState("");

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <VStack
      style={{
        flex: 1,
        padding: 10,
        paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 10,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Updates Demo 5</Text>
        {/* <Text>{runTypeMessage}</Text>
        <Button
          // onPress={() => Updates.checkForUpdateAsync()}
          title="Check manually for updates"
        />
        {showDownloadButton ? (
          <Button
            // onPress={() => Updates.fetchUpdateAsync()}
            title="Download and run update"
          />
        ) : null} */}
        <Text style={{ color: "red" }}>Your push token:</Text>
        <Text>{expoPushToken}</Text>
        <Text>Latest notification:</Text>
        <Text>{notification?.request.content.title}</Text>
        <Text>
          {JSON.stringify(notification?.request.content.data, null, 2)}
        </Text>

        <Input>
          <InputField
            placeholder="body"
            value={value}
            onChangeText={setValue}
          />
        </Input>

        <Button onPress={async () => {
          const res = await notificationService.sendNotification({
            token: expoPushToken ?? "???",
            title: "Test",
            body: value,
            data: { data: "goes here" },
          })

          console.log("res", res);
        }}>
          <ButtonText>SEND TEXT</ButtonText>
        </Button>
      </SafeAreaView>
    </VStack>
  );
}
