import { Image, StyleSheet, Platform, useColorScheme } from 'react-native';
//import { HelloWave } from '@/components/HelloWave';
//import ParallaxScrollView from '@/components/ParallaxScrollView';
//import { ThemedText } from '@/components/ThemedText';
//import { ThemedView } from '@/components/ThemedView';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const navigateLogin = () => {
    navigation.navigate('loginScreen');
    console.log('Login');
  };

  const navigateVendorSignup = () => {
    navigation.navigate('registerVendorUser');
    console.log('new Vendor');
  };

  const navigateCustSignUp = () => {
    navigation.navigate('registerCustomerUser');
    console.log('new Customer');
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Image
        source={require('../assets/images/nomsicon.png')}
        style={[styles.logo]}
      />
      <Text style={[styles.title]}>Welcome to NOMs Food!</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button,]}
          onPress={navigateLogin}>
          <Text style={[styles.buttonText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={navigateVendorSignup}>
          <Text style={[styles.buttonText]}>Vendor Registration</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={navigateCustSignUp}>
          <Text style={[styles.buttonText]}>
            Customer Registration
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#10390A',
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#10390A',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
