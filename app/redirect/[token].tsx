import { useEffect } from "react";
import { View, ActivityIndicator, Linking, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { findOneRoom, joinRoom } from "@/services";
import { useAuthStore } from "@/stores";
import { UserTypeEnum } from "@/types";

export default function Redirect() {
  const user = useAuthStore((state) => state.user);

  const { token } = useLocalSearchParams<{ token: string }>();

  const handleJoinRoom = async (roomId: number, page: string) => {
    let isMember: boolean = false;

    try {
      const res = await findOneRoom(roomId);
      const members = res?.memberships;
      isMember = !!members?.find((item: any) => item.user_id === user?.user_id);

      if (!isMember) {
        await joinRoom({
          room_id: roomId,
          user_id: user?.user_id!,
          type: UserTypeEnum.STAFF,
        });
      }

      goRoom(roomId, page);
    } catch (err) {
      console.warn("Join Room Error: ", err);
      goNoti();
    }
  };

  const goRoom = (roomId: number, page: string) => {
    router.replace(`/${page}/${roomId}`);
  };

  const goNoti = () => {
    router.replace("(tabs)/noti");
  };

  const goBack = () => {
    router.back();
  };

  const goOrder = () => {
    Alert.alert("go order");
  };

  const goRecipeDesign = () => {
    Alert.alert("go recipe design");
  };

  const goRecipeVersion = () => {
    Alert.alert("go recipe version");
  };

  const goLabService = () => {
    Alert.alert("go lab service");
  };

  useEffect(() => {
    if (!token) {
      goNoti();
      return;
    }

    try {
      const decryptedToken = decodeURIComponent(atob(token));
      if (/^https?:\/\//.test(decryptedToken)) {
        Linking.openURL(decryptedToken);
        goBack();
      } else {
        const params = new URLSearchParams(decryptedToken);
        const page = params.get("page");
        const room_id = params.get("room_id");
        const order_id = params.get("order_id");
        const recipe_id = params.get("recipe_id");
        const packaging_id = params.get("packaging_id");
        const service_id = params.get("service_id");

        if (room_id) {
          handleJoinRoom(parseInt(room_id), page!);
        } else if (order_id) {
          goOrder();
        } else if (packaging_id && recipe_id) {
          goRecipeDesign();
        } else if (recipe_id) {
          goRecipeVersion();
        } else if (service_id) {
          goLabService();
        }
      }
    } catch (err) {
      goNoti();
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}
