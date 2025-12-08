import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, Alert } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import { Colors } from "@/constants";
import { Notification, NotificationListResponse } from "@/types";
import { findAllNoti } from "@/services";
import { useAuthStore } from "@/stores";
import NotiItem from "./components/NotiItem";

const LIMIT = 30;
const ORDER = "DESC";

export const NotiScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const user = useAuthStore((state) => state.user);

  const getAllNoti = useCallback(async (currentPage = 1) => {
    console.log(`call getAllNoti with currentPage: ${currentPage}`);
    setLoading(true);
    setError(null);

    try {
      const res: NotificationListResponse = await findAllNoti({
        user_id: user?.user_id!,
        page: currentPage,
        limit: LIMIT,
        order: ORDER,
      });

      if (currentPage === 1) {
        setNotifications(res.data);
      } else {
        setNotifications((prev) => [...prev, ...res.data]);
      }

      setHasMore(res.data.length === LIMIT);

    } catch (err: any) {
      setError(err?.message ?? "Notification not found!");
    } finally {
      setLoading(false);
    }
  }, []);

  // Call getAllNoti() when component mounted
  useEffect(() => {
    getAllNoti(page);
  }, [getAllNoti, page]);

  const onClickNoti = async (noti: any) => {
    Alert.alert("TO DO")
  };

  return (
    <View style={{ flex: 1 }}>
      {error && <Text style={{ color: Colors.error }}>{error}</Text>}

      {loading && page === 1 ? (
        <View style={[styles.loadingContainer, { marginTop: 20 } ]}>
          <ActivityIndicator color={Colors.primary[500]} animating={true} size="large" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NotiItem item={item} onClickNoti={onClickNoti} />
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}   
          style={styles.notiContainer}
          onEndReached={() => {
            if (!loading && hasMore) {
              setPage((prev) => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            loading && page > 1
              ? <View style={[styles.loadingContainer, { marginBottom: 50 } ]}><ActivityIndicator color={Colors.primary[500]} animating={true} size="large" /></View>
              : null
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notiContainer: {
    width: "100%",
  },
});