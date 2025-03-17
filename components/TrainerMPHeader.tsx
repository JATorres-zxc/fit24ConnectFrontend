import { Text, StyleSheet, SafeAreaView, View } from 'react-native';
import { router } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TrainerMPHeader() {
  return (
    <SafeAreaView>
      <View style={styles.header}>

        <View style={styles.leftSection}>
          <FontAwesome 
            name='home' 
            color={'black'} 
            size={24} 
            onPress={() => router.push('/home')} 
          />
          <View>
            <Text style={styles.headerText}>
              Created Meal Plans
            </Text>
            <Text style={styles.subtitleText}>
              manage meal plans you've created
            </Text>
          </View>
        </View>

        <View style={styles.headerIcon}>
          <FontAwesome name='user-circle' color={Colors.black} size={24} onPress={() => router.push('/profile')} />
          <FontAwesome name='bell-o' color={Colors.black} size={24} onPress={() => router.push('/notifications')} />
        </View>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.semibold,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.icongray,
  },
  headerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
