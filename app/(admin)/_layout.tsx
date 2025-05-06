import React from "react";
import { Text } from "react-native";
import { Tabs, usePathname } from "expo-router";

import Ionicons from '@expo/vector-icons/Ionicons'
import { Feather } from "@expo/vector-icons";

export default function RootLayout() {
  const pathname = usePathname();
  
  // Function to determine if members tab should be active
  const isMembersActive = () => {
    return pathname.includes('members') || pathname.includes('member-profile');
  };

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
          tabBarIcon: ({ color }) => {
            // Use the gold color if members should be active
            const iconColor = isMembersActive() ? '#d7be69' : color;
            return <Feather name={'users'} color={iconColor} size={24} />;
          },
          tabBarLabel: ({ focused, color }) => {
            // Also change the label color if needed
            const labelColor = isMembersActive() ? '#d7be69' : color;
            return <Text style={{ color: labelColor, fontSize: 10 }}>Members</Text>;
          }
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
        name="notifications" 
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
        name="edit-announcement" 
        options={{ 
          href: null,
        }} 
      />

      <Tabs.Screen 
        name="edit-password" 
        options={{ 
          href: null,
        }} 
      />

      <Tabs.Screen 
        name="generate-report" 
        options={{ 
          href: null,
        }} 
      />

      <Tabs.Screen 
        name="member-profile" 
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