import { TouchableOpacity, Text, StyleSheet, SafeAreaView, View } from 'react-native';
import { router } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

type RequestMealPlanButtonProps = {
  setViewState: (view: string) => void;
};

export default function RequestMealPlanButton({ setViewState }: RequestMealPlanButtonProps) {

  const handlePress = () => {
    router.push('/(tabs)/mealplan');
    setViewState("plan");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.backText}>← Request Meal Plan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background,
    marginBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 20,
    fontFamily: Fonts.semibold,
    color: 'black',
  },
});
