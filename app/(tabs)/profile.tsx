import { fetchGetUser, LoginResponse } from "@/apis/userApi";
import { LogoutButton } from "@/components/LogoutButton";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const [userInfo, setUserInfo] = useState<LoginResponse>();
  const fetchUserInfo = useCallback(async () => {
    const response = await fetchGetUser<LoginResponse>();
    if (response.success && response.data?.code === 0) {
      setUserInfo(response.data.data);
    } else {
      console.log("用户信息不存在");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [fetchUserInfo])
  );

  const menuItems = [
    {
      id: "1",
      title: "我的资料",
      onPress: () => router.push("/profile-detail"),
    },
    { id: "2", title: "我的收藏", onPress: () => {} },
    { id: "3", title: "浏览历史", onPress: () => {} },
    { id: "4", title: "设置", onPress: () => {} },
    { id: "5", title: "帮助与反馈", onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      {/* 用户信息 */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: userInfo?.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{userInfo?.nickname}</Text>
        <Text style={styles.userBio}>{userInfo?.bio}</Text>
      </View>

      {/* 菜单列表 */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 退出登录 */}
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userBio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  menuText: {
    fontSize: 16,
  },
});
