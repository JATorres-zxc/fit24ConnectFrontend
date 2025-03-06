import React from "react";
import { Tabs } from "expo-router";

import Ionicons from '@expo/vector-icons/Ionicons'
import { Feather } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#d7be69',
        headerStyle: {
          backgroundColor: '#f9f9f9',
        },
        headerShadowVisible: false,
        headerShown: false,
        headerTintColor: '#000000',
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          href: null,
        }} 
      />

      <Tabs.Screen 
        name="members" 
        options={{ 
          title: 'Members',
          tabBarIcon: ({ color, focused }) => (
            <Feather name={'users'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="trainers" 
        options={{ 
          title: 'Trainers',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'barbell' : 'barbell-outline'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="reports" 
        options={{ 
          title: 'Reports',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'analytics-sharp' : 'analytics-outline'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="profile" 
        options={{ 
          href: null,
        }} 
      />

      <Tabs.Screen 
        name="create-announcement" 
        options={{ 
          href: null,
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