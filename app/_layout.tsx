import { Stack, SplashScreen } from "expo-router";
import { useEffect } from "react";

import { useFonts, 
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render anything until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

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
