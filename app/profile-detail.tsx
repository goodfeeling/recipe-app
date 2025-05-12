import {
    fetchGetUser,
    fetchUpdateUserInfo,
    LoginResponse,
} from "@/apis/userApi";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

export default function ProfileDetailScreen() {
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState<{
    id: number;
    user_name: string;
    nickname: string;
    avatar: string;
    bio: string;
  } | null>(null);

  const [form, setForm] = useState({
    id: 0,
    avatar: "",
    nickname: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);

  // 加载用户信息
  useEffect(() => {
    const loadUserInfo = async () => {
      const response = await fetchGetUser<LoginResponse>();
      if (response.success && response.data?.code === 0) {
        const data = response.data.data;
        setUserInfo(data);
        setForm({
          id: data.id,
          nickname: data.nickname,
          bio: data.bio,
          avatar: data.avatar,
        });
      }
    };
    loadUserInfo();
  }, []);

  // 切换编辑模式
  const toggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  // 输入框变化
  const handleChange = (field: "nickname" | "bio", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 保存修改
  const handleSave = async () => {
    if (!userInfo) return;

    setLoading(true);

    try {
      const response = await fetchUpdateUserInfo({
        id: form.id,
        avatar: form.avatar,
        nickname: form.nickname,
        bio: form.bio,
      });
      if (response.data?.code === 0) {
        Alert.alert("保存成功");
        setUserInfo((prev) =>
          prev ? { ...prev, nickname: form.nickname, bio: form.bio ,avatar:form.avatar} : null
        );
        setIsEditing(false);
      } else {
        Alert.alert("保存失败", response.message || "请稍后再试");
      }
    } catch (error) {
      Alert.alert("网络错误", "无法连接服务器，请检查网络");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setForm((prev) => ({ ...prev, avatar: uri }));
    }
  };

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 头像 */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri:  form.avatar || userInfo?.avatar }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.changeAvatarButton} onPress={pickImage}>
          <Text style={styles.changeAvatarText}>更换头像</Text>
        </TouchableOpacity>
      </View>

      {/* 表单 */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>昵称</Text>
        <TextInput
          style={[
            styles.input,
            isEditing ? styles.editableInput : styles.readonlyInput,
          ]}
          value={form.nickname}
          onChangeText={(text) => handleChange("nickname", text)}
          editable={isEditing}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>个人简介</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            isEditing ? styles.editableInput : styles.readonlyInput,
          ]}
          value={form.bio}
          onChangeText={(text) => handleChange("bio", text)}
          editable={isEditing}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* 操作按钮 */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={toggleEdit}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? "保存中..." : isEditing ? "保存" : "编辑"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  readonlyInput: {
    backgroundColor: "#eee",
  },
  editableInput: {
    backgroundColor: "#fff",
  },
  textArea: {
    textAlignVertical: "top",
    height: 100,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  changeAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 6,
  },
  changeAvatarText: {
    color: "#fff",
    fontSize: 12,
  },
});
