import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { firebaseMessagingService } from "@/services/firebase.service";

export function useNotification() {
  const [fcmToken, setFcmToken] = useState("");
  const [permissionStatus, setPermissionStatus] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      const granted = await firebaseMessagingService.requestUserPermission();

      if (!isMounted) return;

      setPermissionStatus(granted);

      if (granted) {
        const token = await firebaseMessagingService.getFcmToken();

        if (!isMounted) return;

        if (token) {
          setFcmToken(token);
          console.log("FCM Token: ", token);
        }
      } else {
        console.log("Permission denied");
      }

      firebaseMessagingService.registerNotificationLifecycleHandlers();
    };

    setup();

    const unsubscribe =
      firebaseMessagingService.subscribeToForegroundMessages(
        (remoteMessage) => {
          Alert.alert("*** Foreground Message", JSON.stringify(remoteMessage));
        }
      );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return {
    fcmToken,
    permissionStatus,
  };
}
