import { useEffect } from "react";
import { View, ActivityIndicator, Linking, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { findOneRoom, joinRoom, getShopOrder } from "@/services";
import { Colors } from "@/constants";
import { useAuthStore } from "@/stores";
import { UserTypeEnum } from "@/types";

export default function Redirect() {
  const user = useAuthStore((state) => state.user);

  const { token } = useLocalSearchParams<{ token: string }>();

  const handleJoinRoom = async (roomId: number) => {
    let isMember: boolean = false;

    try {
      const res = await findOneRoom(roomId);
      const members = res?.memberships;
      isMember = !!members?.find((item: any) => item.user_id === user?.user_id);

      if (!isMember) {
        Alert.alert("Join Room", "Are you sure you want to join room?", [
          { text: "Cancel" },
          {
            text: "Join",
            onPress: async () => {
              await joinRoom({
                room_id: roomId,
                user_id: user?.user_id!,
                type: UserTypeEnum.STAFF,
              });
            },
          },
        ]);
      }

      goRoom(roomId);
    } catch (err) {
      console.warn("Join Room Error: ", err);
      goBack();
    }
  };

  const goRoom = (roomId: number) => {
    router.replace(`/messenger/${roomId}`);
  };

  const goNoti = () => {
    router.replace("(tabs)/noti");
  };

  const goBack = () => {
    router.back();
  };

  const goLabOrder = async (orderId: string) => {
    Alert.alert("TODO: go lab order");
    goBack();
  };

  const goRecipeDesign = async (
    page: string | null,
    recipeId: string,
    packagingId: string
  ) => {
    Alert.alert("TODO: go recipe design");
    goBack();
  };

  const goRecipeVersion = async (page: string | null, recipeId: string) => {
    Alert.alert("TODO: go recipe version");
    goBack();
  };

  const goLabService = async (page: string | null, serviceId: string) => {
    Alert.alert("TODO: go lab service");
    goBack();
  };

  useEffect(() => {
    if (!token) {
      goBack();
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
          handleJoinRoom(parseInt(room_id));
        } else if (order_id) {
          goLabOrder(order_id);
        } else if (packaging_id && recipe_id) {
          goRecipeDesign(page, recipe_id, packaging_id);
        } else if (recipe_id) {
          goRecipeVersion(page, recipe_id);
        } else if (service_id) {
          goLabService(page, service_id);
        }
      }
    } catch (err: any) {
      goBack();
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
      <ActivityIndicator size="large" color={Colors.primary[500]} />
    </View>
  );
}
