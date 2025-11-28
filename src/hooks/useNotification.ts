import {useEffect, useState} from "react";
import messaging from "@react-native-firebase/messaging";
import {Alert} from "react-native";

export function useNotification() {
  const [fcmToken, setFcmToken] = useState("");
  const [permissionStatus, setPermissionStatus] = useState(false);

  // Ask for Permission
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    setPermissionStatus(enabled);
    return enabled;
  };

  useEffect(() => {
    // Request permission on mount
    const setup = async () => {
      const granted = await requestUserPermission();

      if (granted) {
        const token = await messaging().getToken();
        setFcmToken(token);
        console.log("*** FCM Token:", token);
      } else {
        console.log("*** Permission denied");
      }

      // When app is opened from a quit state
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            Alert.alert("*** Opened from quit state", JSON.stringify(remoteMessage.notification));
          }
        });

      // App opened from background
      messaging().onNotificationOpenedApp(remoteMessage => {
        Alert.alert("*** Opened from background", JSON.stringify(remoteMessage.notification));
      });

      // Background message handler
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        Alert.alert("*** Background message", JSON.stringify(remoteMessage));
      });
    };

    setup();

    // Foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert("*** Foreground Message", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return {
    fcmToken,
    permissionStatus,
  };
}