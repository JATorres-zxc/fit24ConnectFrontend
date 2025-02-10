import React from "react";
import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#d7be69',
        headerStyle: {
          backgroundColor: '#f9f9f9',
        },
        headerShadowVisible: false,
        headerTintColor: '#000000',
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
      }}
    >
      
      <Tabs.Screen 
        name="login" 
        options={{ 
          title: 'Login',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'log-in' : 'log-in-outline'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="register" 
        options={{ 
          title: 'Register',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-add' : 'person-add-outline'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="+not-found" 
        options={{ 
          href: null 
        }} 
      />
    </Tabs>
  );
}