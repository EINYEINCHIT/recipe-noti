import { useEffect, useState } from "react";
import messaging from "@react-native-firebase/messaging";

export function useNotification() {
  const [fcmToken, setFcmToken] = useState("");
  const [permissionStatus, setPermissionStatus] = useState(false);

  // Request FCM Permission
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    setPermissionStatus(enabled);
    return enabled;
  };

  // Setup Notifications
  useEffect(() => {
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
        .then((remoteMessage) => {
          if (remoteMessage) {
            // console.log("*** Opened from quit state", JSON.stringify(remoteMessage.notification));
          }
        });

      // App opened from background
      messaging().onNotificationOpenedApp((remoteMessage) => {
        // console.log("*** Opened from background", JSON.stringify(remoteMessage.notification));
      });

      // Background message handler
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        // console.log("*** Background message", JSON.stringify(remoteMessage));
      });
    };

    setup();

    // Foreground messages
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // console.log("*** Foreground Message", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return {
    fcmToken,
    permissionStatus,
  };
}