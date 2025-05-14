import { fetchLogin, LoginResponse } from "@/apis/userApi";
import { useNavigation, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
   const navigation = useNavigation();
    navigation.setOptions({
      title: "登录",
    });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleLogin = async () => {
    if (!username || !password) {
      setError("请输入用户名和密码");
      return;
    }

    // TODO: 替换为真实登录逻辑
    console.log("提交登录:", { username, password });

    try {
      const result = await fetchLogin<LoginResponse>({
        user_name: username,
        password,
      });

      console.log(result);

      if (result.success && result.data?.code === 0) {
        // 示例：跳转到主页
        router.navigate("/"); // 跳转到登录页
      }
    } catch (error) {
      console.error("登录失败:", error);
    } finally {
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>登录</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="用户名"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>登录</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.navigate("/")}>
            <Text style={styles.linkText}>忘记密码？</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.navigate("/register")}>
            <Text style={styles.linkText}>没有账号？立即注册</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
  },
  linkText: {
    color: "#007BFF",
    marginVertical: 5,
    fontSize: 14,
  },
});
