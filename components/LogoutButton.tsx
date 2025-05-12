import { fetchLogout } from "@/apis/userApi";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";


export const LogoutButton = () => {

    const router = useRouter();
    const handleLogout = async () => {
        try {
            await fetchLogout();
            router.replace('/login')
        }catch (error) {
            console.log("logout failed:",error);
            
        }
    }
    
    return (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
     logoutButton: {
    margin: 20,
    padding: 12,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})