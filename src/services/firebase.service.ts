import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";

export const firebaseMessagingService = {
  requestUserPermission: async (): Promise<boolean> => {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  },

  getFcmToken: async (): Promise<string | null> => {
    try {
      const token = await messaging().getToken();
      return token || null;
    } catch (error) {
      console.log("*** Error getting FCM token:", error);
      return null;
    }
  },

  registerNotificationLifecycleHandlers: () => {
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          // console.log(
          //   "*** Opened from quit state",
          //   JSON.stringify(remoteMessage.notification)
          // );
        }
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      // console.log(
      //   "*** Opened from background",
      //   JSON.stringify(remoteMessage.notification)
      // );
    });

    messaging().setBackgroundMessageHandler(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        // console.log("*** Background message", JSON.stringify(remoteMessage));
      }
    );
  },

  subscribeToForegroundMessages: (
    handler: (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => void
  ): (() => void) => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      handler(remoteMessage);
    });

    return unsubscribe;
  },
};

