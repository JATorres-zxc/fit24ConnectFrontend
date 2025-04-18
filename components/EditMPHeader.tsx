import { Text, StyleSheet, SafeAreaView, View } from 'react-native';
import { router } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';

type EditMealPlanButtonProps = {
  setViewState: (view: string) => void;
  setMealPlan: (mealPlan: null) => void; // Added to reset mealPlan
};

export default function EditMealPlanButton({ setViewState, setMealPlan }: EditMealPlanButtonProps) {

  const handlePress = () => {
    setMealPlan(null); // Clear mealPlan when navigating back
    setViewState(""); 
    router.push('/(trainer)/mealplan');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <AntDesign 
            name='arrowleft' 
            color={'black'} 
            size={24} 
            onPress={handlePress}
        />
        <Text style={styles.backText}>  Edit Meal Plan</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.bg,
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
