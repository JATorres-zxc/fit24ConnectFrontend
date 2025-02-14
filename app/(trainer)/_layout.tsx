import React from "react";
import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
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
        name="home" 
        options={{ 
          headerShown: false,
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
          headerShown: false,
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
          headerShown: false,
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