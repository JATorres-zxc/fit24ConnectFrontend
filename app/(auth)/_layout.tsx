import { Stack } from "expo-router";
import { Easing } from "react-native-reanimated"

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // Default: Right-to-left push
        transitionSpec: {
          open: {
            animation: "timing",
            config: {
              duration: 600, // Adjust for slower effect
              easing: Easing.out(Easing.exp),
            },
          },
          close: {
            animation: "timing",
            config: {
              duration: 600,
              easing: Easing.out(Easing.exp),
            },
          },
        },
        gestureDirection: "horizontal", // Enable swipe back (left-to-right)
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false, 
          animation: "slide_from_right", // Push from left when navigating BACK
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          headerShown: false, 
          animation: "slide_from_left", // Push from right when navigating FORWARD
        }} 
      />
    </Stack>
  );
}