import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useNotification } from "@/contexts/notification-context";
import { useEffect, useState } from "react";
import { Alert, Button, Platform, SafeAreaView, StatusBar } from "react-native";
// import { Text } from "@/components/Text";
// import { ThemedView } from "@/components/ThemedView";
// import * as Updates from "expo-updates";

export default function HomeScreen() {
  const { notification, expoPushToken, error } = useNotification();
  // const { currentlyRunning, isUpdateAvailable, isUpdatePending } =
  //   Updates.useUpdates();

  const [dummyState, setDummyState] = useState(0);

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  // useEffect(() => {
  //   if (isUpdatePending) {
  //     // Update has successfully downloaded; apply it now
  //     // Updates.reloadAsync();
  //     // setDummyState(dummyState + 1);
  //     // Alert.alert("Update downloaded and applied");

  //     dummyFunction();
  //   }
  // }, [isUpdatePending]);

  const dummyFunction = async () => {
    try {
      // await Updates.reloadAsync();
    } catch (e) {
      Alert.alert("Error");
    }

    // UNCOMMENT TO REPRODUCE EAS UPDATE ERROR
    // } finally {
    //   setDummyState(dummyState + 1);
    //   console.log("dummyFunction");
    // }
  };

  // If true, we show the button to download and run the update
  // const showDownloadButton = isUpdateAvailable;

  // Show whether or not we are running embedded code or an update
  // const runTypeMessage = currentlyRunning.isEmbeddedLaunch
    // ? "This app is running from built-in code"
    // : "This app is running an update";

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
        <Text style={{ color: "red" }}>
          Your push token:
        </Text>
        <Text>{expoPushToken}</Text>
        <Text>Latest notification:</Text>
        <Text>{notification?.request.content.title}</Text>
        <Text>
          {JSON.stringify(notification?.request.content.data, null, 2)}
        </Text>
      </SafeAreaView>
    </VStack>
  );
}