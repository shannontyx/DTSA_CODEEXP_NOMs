import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { doSignInWithEmailAndPassword, doSignOut } from '../../firebase/auth'
import { FirebaseError } from '@firebase/util';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../components/authContext'
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase/firebaseConfig';
import { Button } from 'react-native-paper';
import { collection, query, where, getDocs } from 'firebase/firestore';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userType, setUserType] = useState('')
  const [signInDone, setSignInDone] = useState(false)

  const { userLoggedIn = false } = useAuth() ?? {};
  const auth = getAuth();


  const handleLogin = async () => {
    console.log('Username:', email);
    console.log('Password:', password);

    if (!isSigningIn) {
      try {
        setIsSigningIn(true);
        await doSignInWithEmailAndPassword(email, password);
        await Promise.all([fetchUserData()]);
      } catch (error: any) {
        console.log("triggered")
        doSignOut();
        setUserType("");
        if (error.message === "Firebase: Error (auth/invalid-credential).") {
          setErrorMessage("Invalid Login Credentials");
        } else if (error.message === "Firebase: Error (auth/invalid-email).") {
          setErrorMessage("Invalid Email");
        } else if (error.message === "Firebase: Error (auth/missing-password).") {
          setErrorMessage("Fill In Missing Password");
        } else {
          setErrorMessage(error.message);
        }
      } finally {
        setIsSigningIn(false); // Reset Button
      }
    }
  };

  useEffect(() => {
    if (userType) {
      console.log('User Type:', userType);
      completeLogin();
    }
  }, [userType]);

  const fetchUserData = async () => {
    const auth = getAuth(); // Get Current User State
    const userIden = auth.currentUser?.uid; // UserId 
    try {
      const usersCollectionRef = collection(db, "Users");
      console.log('Current User:', userIden);

      const q = query(usersCollectionRef, where("userId", "==", userIden));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {

        querySnapshot.forEach((doc) => {
          const userData = doc.data();

          console.log(userData.status);

          if (userData.status === 'Banned') {
            console.log("Ban Triggered");
            throw new Error("Your account has been banned");
          } else if (userData.status === 'Deleted') {
            throw new Error("This account has been deleted");
          }

          setUserType(userData.type);
          console.log(userType);

        });
      } else {
        throw new Error("No Account Found");
      }
    } catch (error: any) {
      if (error.message === "Your account has been banned") {
        throw new Error("Your account has been banned");
      } else if (error.message === "This account has been deleted") {
        throw new Error("This account has been deleted");
      } else if (error.message === "No Account Found") {
        throw new Error("No Account has Been Found");
      } else {
        throw new Error("Error While Retrieving Account");
      }
    }
  };

  const completeLogin = () => {
    console.log("navigating");
    if (userType === "Vendor") {
      navigation.navigate('vendorHomepage', { replace: true });
    } else if (userType === "Customer") {
      navigation.navigate('homepage', { replace: true });
    }
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

      {errorMessage && (
        <Text style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</Text>
      )}
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