import { Text, StyleSheet, SafeAreaView, View } from 'react-native';
import { router } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';

type SendFeedbackButtonProps = {
  setViewState: (view: string) => void;
};

export default function RequestMealPlanButton({ setViewState }: SendFeedbackButtonProps) {

  const handlePress = () => {
    router.push('/(tabs)/workout');
    setViewState("exercises");
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
        <Text style={styles.backText}>  Send Feedback</Text>
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
