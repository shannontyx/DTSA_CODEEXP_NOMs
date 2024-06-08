import { Image, StyleSheet, Platform, useColorScheme } from 'react-native';
//import { HelloWave } from '@/components/HelloWave';
//import ParallaxScrollView from '@/components/ParallaxScrollView';
//import { ThemedText } from '@/components/ThemedText';
//import { ThemedView } from '@/components/ThemedView';
import { View, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Image
        source={require('../../assets/images/nomsicon.png')}
        style={[styles.logo]}
      />
      <Text style={[styles.title]}>Welcome to NOMs Food!</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button,]}
          onPress={() => console.log('Login')}>
          <Text style={[styles.buttonText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => console.log('Sign in')}>
          <Text style={[styles.buttonText]}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => console.log('Forgot password')}>
          <Text style={[styles.buttonText]}>
            Forgot password
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#10390A',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    color: '#000000',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    color: '#000000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
