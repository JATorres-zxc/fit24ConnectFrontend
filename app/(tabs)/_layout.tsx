import React from "react";
import { Tabs } from "expo-router";

import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.gold,
        headerStyle: {
          backgroundColor: Colors.bg,
        },
        headerShown: false,
        headerShadowVisible: false,
        headerTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'white',
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
        name="mealplan" 
        options={{ 
          title: 'Meal Plan',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={'set-meal'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="workout" 
        options={{ 
          title: 'Workout',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'arm-flex' : 'arm-flex-outline'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="scan" 
        options={{ 
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'scan-sharp' : 'scan-outline'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="history" 
        options={{ 
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'clipboard' : 'clipboard-outline'} color={color} size={24} />
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
        name="editprofile" 
        options={{ 
          href: null,
        }} 
      />

      <Tabs.Screen 
        name="editpassword" 
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