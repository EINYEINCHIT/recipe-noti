import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Avatar, Chip, ActivityIndicator } from "react-native-paper";
import { Colors } from "@/constants";
import { Notification, NotificationListResponse } from "@/types";
import { findAllNoti } from "@/services";
import { useAuth } from "@/hooks";
import { formatDate } from "@/utils";

const Noti = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();

  const getAllNoti = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const res: NotificationListResponse = await findAllNoti({
        user_id: user.user_id,
      });
      setNotifications(res.data);
    } catch (err: any) {
      setError(err?.message ?? "Notification မတွေ့ပါ");
    } finally {
      setLoading(false);
    }
  }, []);

  // call getAllNoti() when component mounted
  useEffect(() => {
    getAllNoti();
  }, [getAllNoti]);

  const isUnReadNoti = (readNoti: any[]) => {
    const userIds = readNoti.map((item) => item.user_id);
    return !userIds.includes(user?.user_id);
  };

  const onClickNoti = async(_noti: any) => {
    Alert.alert("TO DO");
  };

  return (
    <View>
      {error && <Text style={{ color: Colors.error }}>{error}</Text>}

      {loading && notifications.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.notiItem,
                isUnReadNoti(item?.staffNotiReadBy) && styles.unread,
              ]}
              onPress={() => onClickNoti(item)}
            >
              <View style={styles.header}>
                <Avatar.Text size={40} label="💬" style={styles.avatar} />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}:</Text>
                  <Text style={styles.description}>
                    {item.description.replace(/<[^>]+>/g, "")}{" "}
                    {/* HTML to Text */}
                  </Text>
                </View>
              </View>

              <View style={styles.infoContainer}>
                <Chip style={styles.chip} textStyle={styles.chipText} mode="outlined">
                  {item.ms_name}
                </Chip>
                <Text style={styles.datetime}>{formatDate(item.created_at, "fromNow")}</Text>
              </View>
            </TouchableOpacity>
          )}
          style={{ width: "100%" }}
        />
      )}
    </View>
  );
};

export default Noti;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notiItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  unread: {
    backgroundColor: '#f0f8ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#cfe3fc',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  description: {
    color: '#555',
  },
  infoContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    marginLeft: 50,
  },
  chipText: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  datetime: {
    marginTop: 5,
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
});
