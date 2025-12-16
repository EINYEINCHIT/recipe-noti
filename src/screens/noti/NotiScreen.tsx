import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import { Colors, LIMIT, ORDER } from "@/constants";
import { Notification, NotificationListResponse } from "@/types";
import { findAllNoti, readNoti } from "@/services";
import { useAuthStore } from "@/stores";
import { MyContainer } from "@/components";
// components
import NotiItem from "./components/NotiItem";

export const NotiScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const user = useAuthStore((state) => state.user);

  const getNotifications = useCallback(async (currentPage = 1) => {
    // console.log(`NotiScreen: call getNotifications with currentPage: ${currentPage}`);
    setError(null);
    setLoading(true);
    
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
      console.warn("Notification Error: ", err);
      setError(err?.message ?? "Notification Error.");
    } finally {
      setLoading(false);
    }
  }, []);

  const goRedirect = (token: string) => {
    router.push(`/redirect/${token}`);
  };

  // Call getAllNoti() when component mounted
  useEffect(() => {
    getNotifications(page);
  }, [getNotifications, page]);

  const onClickNoti = async (noti: Notification) => {
    try {
      await readNoti({ noti_id: noti?.id, user_id: user?.user_id! });
      const token = noti?.redirect_content?.page_token;
      goRedirect(token);
    } catch (err: any) {
      console.warn("Read Noti Error: ", err);
    }
  };

  return (
    <MyContainer>
      {error && <Text style={{ color: Colors.error }}>{error}</Text>}

      {loading && page === 1 ? (
        <View style={[styles.loadingContainer, { marginTop: 20 } ]}>
          <ActivityIndicator color={Colors.primary[500]} size="large" />
        </View>
      ) : (
        <View style={styles.notiContainer}>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <NotiItem item={item} onClickNoti={onClickNoti} />
            )}
            onEndReached={() => {
              if (!loading && hasMore) {
                setPage((prev) => prev + 1);
              }
            }}
            onEndReachedThreshold={1.0}
            ListFooterComponent={() => (
              loading && page > 1
                ? <View style={styles.loadingContainer}>
                    <ActivityIndicator color={Colors.primary[500]} size="large" />
                  </View>
                : null
            )}
          />
        </View>
      )}
    </MyContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50
  },
  notiContainer: {
    width: "100%",
  },
});