import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

type Props = {
  label: string;
  theme?: 'primary';
};

export default function Button({ label, theme }: Props) {
  return (
    <View
      style={[styles.buttonContainer,]}
    >
      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.gold }]}
        onPress={() => router.push('/(admin)/create-announcement')}>
        <FontAwesome name="pencil" size={16} color={Colors.white} style={styles.buttonIcon} />
        <Text style={[styles.buttonLabel, { color: Colors.white }]}>{label}</Text>
      </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.semibold,
  },
});
