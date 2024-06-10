import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebase/firebaseConfig';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth'
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from '../../components/authContext'
import { getAuth } from 'firebase/auth';


interface Profile {
  email: string;
  name: string;
  username: string;
  contact: string;
  password: string;
  confirmPassword: string;
}

interface userProfile {
  email: string;
  name: string;
  username: string;
  contact: string;
  password: string;
  type: string;
  userId: string;
  status: string;
}

const registerCustomerUser: React.FC = () => {
  const navigation = useNavigation();

  const [registering, setRegistering] = useState(false);

  const { userLoggedIn = false } = useAuth() ?? {};
  const auth = getAuth();

  const [profile, setProfile] = useState<Profile>({
    email: '',
    name: '',
    username: '',
    contact: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (name: string, value: string) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNewUser = async (ProfileData: Profile) => {
    try {
      console.log("HI");
      const response = await doCreateUserWithEmailAndPassword(ProfileData.email, ProfileData.password);
      if (response.user) {
        const uid = response.user.uid;
        const userCollectionRef = collection(db, "Users");
        
        const profilePayload: userProfile = {
          email: ProfileData.email,
          name: ProfileData.name,
          username: ProfileData.username,
          contact: ProfileData.contact,
          password: ProfileData.password,
          type: "Customer",
          userId: uid,
          status: "Active",
        };
        await addDoc(userCollectionRef, profilePayload);
      }
      console.log('User profile added to database!');
      alert('You have successfully created this user!');
      setProfile({ email: '', name: '', username: '', contact: '', password: '', confirmPassword: '' }); // Reset profile
    } catch (error) {
      console.error('Error adding user', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if(!registering) {
      setRegistering(true);
    }
    console.log(profile.password);
    console.log(profile.confirmPassword);
    if (profile.password === profile.confirmPassword) {
      try {
        await handleNewUser(profile);
        setRegistering(false);
        if (userLoggedIn && !registering) {
          navigation.navigate('homepage');
        }
      } catch (error) {
        console.error('Error handling user profile:', error);
      }
    } else {
      alert('Passwords do not match!');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>
      <Image
          source={require('../../assets/images/nomsicon.png')}
          style={[styles.logo]}
        />
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={profile.email}
          onChangeText={value => handleInputChange('email', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={profile.name}
          onChangeText={value => handleInputChange('name', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={profile.username}
          onChangeText={value => handleInputChange('username', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          value={profile.contact}
          onChangeText={value => handleInputChange('contact', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={profile.password}
          onChangeText={value => handleInputChange('password', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={profile.confirmPassword}
          onChangeText={value => handleInputChange('confirmPassword', value)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    width: '80%',
  },
  logo: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
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
  input: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#10390A',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default registerCustomerUser;