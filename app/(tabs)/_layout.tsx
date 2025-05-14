import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          height: 70, // 设置你想要的高度
          paddingBottom: 5,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '最热',
          tabBarIcon: ({ color }) => <FontAwesome6 name="hotjar" size={28}  color={color} />,
          
        }}
      />
      <Tabs.Screen
        name="recipe"
        options={{
          title: '分类',
          tabBarIcon: ({ color }) => <FontAwesome6 name="clipboard-list" size={28}  color={color} />,
        }}
      />
      <Tabs.Screen 
        name="chat"
        options={{
          title:"AI聊天",
          tabBarIcon: ({color}) => <FontAwesome6 name="robot" size={28}  color={color} />,
        }}
      />
      <Tabs.Screen 
        name="profile"
        options={{
          title:"我的",
          tabBarIcon: ({color}) => <FontAwesome6 name="house-user" size={28}  color={color} />,
        }}
      />
    </Tabs>
  );
}
