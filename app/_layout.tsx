import { fetchGetUser, LoginResponse } from '@/apis/userApi';
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
export default function RootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
        try {
          const response = await fetchGetUser<LoginResponse>();
          
          if (response.success && response.data?.code === 0) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            router.replace("/login"); // 跳转到登录页
          }
        } catch (error) {
          setIsAuthenticated(false);
          router.replace("/login"); // 跳转到登录页
        }
    };

    checkToken();
  });


  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }


  // 使用 isAuthenticated 控制是否渲染主界面
  // if (isAuthenticated === null) {
  //   // 可以返回一个加载指示器
  //   return null; 
  // }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
