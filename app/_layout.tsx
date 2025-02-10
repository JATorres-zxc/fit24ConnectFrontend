// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(auth)" 
        options={{ headerShown: false }} // Disable header for all auth routes
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }}  // Keep header for your main app screens (if desired)
      />
    </Stack>
  );
}
