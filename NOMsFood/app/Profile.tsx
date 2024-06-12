import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc, getFirestore, getDocs, where, query, collection } from 'firebase/firestore';
import { useAuth } from '../components/authContext';
import { doSignOut } from '@/firebase/auth';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        username: '',
        contact: '',
    });
    const authContext = useAuth();
    const { userLoggedIn, currentUserEmail } = authContext || {};
    const [editMode, setEditMode] = useState(false);

    const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

    const db = getFirestore();

    useEffect(() => {
        if (!userLoggedIn) {
            navigation.navigate('loginScreen');
            return;
        }

        const fetchUserData = async () => {
            const db = getFirestore();
            const usersRef = collection(db, 'Users');
            console.log('Current User Email:', currentUserEmail);
            const q = query(usersRef, where('email', '==', currentUserEmail));

            try {
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    // Assuming the first document is the user's data
                    const fetchedData: any = querySnapshot.docs[0].data();
                    setFormData(fetchedData);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching user data: ', error);
            }
        };

        fetchUserData();
    }, [userLoggedIn, currentUserEmail, navigation, editMode]);

    const handleInputChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSignOut = () => {
        doSignOut().then(() => {
            navigation.navigate('index');
        }).then(() => {
            AsyncStorage.clear();
        });
    };

    const handleToggleEditMode = () => {
        setEditMode(!editMode);
    };

    const handleSubmit = async () => {
        // Get the reference to the user document by email
        const q = query(collection(db, 'Users'), where('email', '==', currentUserEmail));

        try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // There should only be one user with this email, so we'll take the first doc
                const userDocRef = querySnapshot.docs[0].ref;

                // Update the user document
                await updateDoc(userDocRef, {
                    name: formData.name,
                    username: formData.username,
                    contact: formData.contact,
                });
                console.log('Profile updated successfully');
                setEditMode(false);
            } else {
                // This will run if there's no user with the given email
                console.error('No matching document found to update');
            }
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backButton}>Back</Text>
            </TouchableOpacity>
            <View style={styles.profileContainer}>
                <Icon name="user-circle" size={100} color="#000" />
                <TouchableOpacity style={styles.editIcon} onPress={handleToggleEditMode}>
                    <Icon name="edit" size={30} color="#2c5f2d" />
                </TouchableOpacity>
                {editMode ? (
                    <TextInput
                        style={styles.nameInput}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        placeholder="Name"
                    />
                ) : (
                    <Text style={styles.name}>{formData.name}</Text>
                )}
                <Text style={styles.username}>@{formData.username}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailText}>{formData.email}</Text>
                <Text style={styles.detailLabel}>Contact:</Text>
                {editMode ? (
                    <TextInput
                        style={styles.input}
                        value={formData.contact}
                        onChangeText={(value) => handleInputChange('contact', value)}
                        placeholder="Contact"
                    />
                ) : (
                    <Text style={styles.detailText}>{formData.contact}</Text>
                )}
                <Text style={styles.detailLabel}>Username:</Text>
                {editMode ? (
                    <TextInput
                        style={styles.input}
                        value={formData.username}
                        onChangeText={(value) => handleInputChange('username', value)}
                        placeholder="Username"
                    />
                ) : (
                    <Text style={styles.detailText}>{formData.username}</Text>
                )}
            </View>
            {editMode && (
                <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            )}
            <View style={styles.bottomSection}>
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
            <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Homepage')}
        >
          <Icon name="home" size={24} color="#2c5f2d" />
          <Text style={styles.footerButtonText}>Home Page</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.footerButton}
  onPress={() => navigation.navigate('CustViewOrders')}
>
  <Icon name="file" size={24} color="#2c5f2d" />
  <Text style={styles.footerButtonText}>Orders</Text>
</TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="group" size={24} color="#2c5f2d" />
          <Text style={styles.footerButtonText}>Account</Text>
        </TouchableOpacity>
        
       
      </View>
        </View>

        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 0,
    },
    backButton: {
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
        marginTop: 25,
        marginLeft:10
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    editIcon: {
        position: 'absolute',
        top: 0,
        right: 5,
        marginRight:10
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    username: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    nameInput: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
        marginBottom: 20,
        width: '80%',
        textAlign: 'center',
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 20,
    },
    detailsContainer: {
        marginBottom: 20,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
    },
    detailText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#FFF',
    },
    updateButton: {
        backgroundColor: '#2c5f2d',
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
        width: 150, // Set the width to a smaller size
        alignSelf: 'center', // Center the button horizontally
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomSection: {
        padding: 20,
        borderRadius: 10,
        marginTop: 'auto',
    },
    signOutButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom:30,
        borderRadius: 5,
        alignItems: 'center',
    },
    signOutButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        height: 60,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#DDDDDD",
      },
      footerButton: {
        alignItems: "center",
      },
      footerButtonText: {
        fontSize: 12,
        color: "#333333",
        marginTop: 5,
      },
});

export default EditProfile;
