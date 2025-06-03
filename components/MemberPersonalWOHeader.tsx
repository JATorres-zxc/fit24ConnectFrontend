import { Text, StyleSheet, SafeAreaView, View } from 'react-native';
import { router } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';

type MemberPersonalWorkoutProps = {
  setViewState: (view: string) => void;
};

export default function PersonalWorkoutMember({ setViewState }: MemberPersonalWorkoutProps) {

  const handlePress = () => {
    router.push('/(tabs)/workout');
    setViewState("");
  };

  return (
    <SafeAreaView>

      <View style={styles.header}>

        <View style={styles.leftSection}>
          <AntDesign 
            name='arrowleft' 
            color={'black'} 
            size={24} 
            onPress={handlePress}
          />
          <Text style={styles.backText}>  Personal Workouts</Text>
        </View>

        {/* For spacing purposes */}
        <View style={styles.rightSection}>
          <Text>{''}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backText: {
    fontSize: 20,
    fontFamily: Fonts.semibold,
    color: 'black',
  },
  leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
  },
  rightSection: {
    alignItems: 'center',
  },
});
