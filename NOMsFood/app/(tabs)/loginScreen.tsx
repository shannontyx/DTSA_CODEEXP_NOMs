import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    // Perform login logic here
    console.log('Username:', email);
    console.log('Password:', password);
  };

  const handleBackPress = () => {
    navigation.goBack(); 
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>
      <Image
        source={require('../../assets/images/nomsicon.png')}
        style={[styles.logo]}
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        contentStyle={styles.buttonContent}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 1, // Ensure the back button is above other content
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '75%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    width: '40%',
    height: 50,
    backgroundColor: '#10390A', // Set the background color to green
    marginTop: 30, // Increase the margin bottom to create a bigger gap
  },
  buttonContent: {
    backgroundColor: '#10390A', // Set the background color to green
    height: '100%', // Ensure the content fills the button's height
  },
  buttonText: {
    fontSize: 20, // Increase the font size for the button text
    fontWeight: 'bold',
  },
});

export default LoginScreen;