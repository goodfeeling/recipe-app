import { fetchRegister } from "@/apis/userApi";
import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  navigation.setOptions({
    title: "注册",
  });
  const [formData, setFormData] = useState({
    user_name: "",
    nickname: "",
    password: "",
    password_confirm: "",
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.user_name.trim()) newErrors.user_name = "用户名不能为空";
    if (!formData.nickname.trim()) newErrors.nickname = "昵称不能为空";
    if (!formData.password) newErrors.password = "密码不能为空";
    if (formData.password !== formData.password_confirm)
      newErrors.password_confirm = "两次密码不一致";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await fetchRegister(formData);

      if (response.data?.code === 0) {
        Alert.alert("注册成功", "即将跳转到登录页", [
          { text: "确定", onPress: () => router.replace("/login") },
        ]);
      } else {
        Alert.alert("注册失败", response.message || "请重试");
      }
    } catch (error) {
      Alert.alert("网络错误", "无法连接服务器，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>注册账号</Text>

      {/* 用户名 */}
      <TextInput
        style={[styles.input, errors.user_name && styles.inputError]}
        placeholder="用户名"
        value={formData.user_name}
        onChangeText={(text) => handleChange("user_name", text)}
      />
      {errors.user_name && (
        <Text style={styles.errorText}>{errors.user_name}</Text>
      )}

      {/* 昵称 */}
      <TextInput
        style={[styles.input, errors.nickname && styles.inputError]}
        placeholder="昵称"
        value={formData.nickname}
        onChangeText={(text) => handleChange("nickname", text)}
      />
      {errors.user_name && (
        <Text style={styles.errorText}>{errors.nickname}</Text>
      )}

      {/* 密码 */}
      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="密码"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      {/* 确认密码 */}
      <TextInput
        style={[styles.input, errors.password_confirm && styles.inputError]}
        placeholder="确认密码"
        secureTextEntry
        value={formData.password_confirm}
        onChangeText={(text) => handleChange("password_confirm", text)}
      />
      {errors.password_confirm && (
        <Text style={styles.errorText}>{errors.password_confirm}</Text>
      )}

      {/* 提交按钮 */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "注册中..." : "注册"}</Text>
      </TouchableOpacity>

      {/* 去登陆 */}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.linkText}>已有帐号？去登陆</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 15,
    textAlign: "center",
    color: "#007AFF",
  },
});
