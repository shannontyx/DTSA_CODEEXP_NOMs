import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc, getFirestore, getDocs, where, query, collection } from 'firebase/firestore';
import { useAuth } from '../components/authContext';
import { doSignOut } from '@/firebase/auth';
import { TextInput, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

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
                await updateDoc(userDocRef, formData);
                console.log('Profile updated successfully');
                navigation.navigate('Profile'); // or wherever you wish to redirect after update
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
            <View style={styles.formContainer}>
                <Text style={styles.header}>Edit Profile</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email: (not editable)</Text>
                    <TextInput
                        style={[styles.input, !editMode && styles.nonEditableInput]}
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        placeholder="Email"
                        editable={false}
                    />
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        placeholder="Name"
                        editable={editMode}
                    />
                    <Text style={styles.label}>Username:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.username}
                        onChangeText={(value) => handleInputChange('username', value)}
                        placeholder="Username"
                        editable={editMode}
                    />
                    <Text style={styles.label}>Contact:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.contact}
                        onChangeText={(value) => handleInputChange('contact', value)}
                        placeholder="Contact"
                        editable={editMode}
                    />
                </View>

                {editMode ? (
                    <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Update Profile</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.editButton} onPress={handleToggleEditMode}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.buttonText}>Sign Out</Text>
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
        backgroundColor: 'white',
    },
    formContainer: {
        width: '80%',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    link: {
        color: 'blue',
        textAlign: 'center',
        marginTop: 10,
    },
    nonEditableInput: {
        backgroundColor: 'white', 
        color: '#000', 
      },
    editButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    updateButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    signOutButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default EditProfile;