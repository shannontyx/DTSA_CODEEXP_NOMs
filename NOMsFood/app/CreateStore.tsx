import React, { useState, useEffect } from 'react';
//import { LoadScript, useLoadScript, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';
import { useAuth } from '../components/authContext';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { ScrollView, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';


function CreateStore() {
  const navigate = useNavigation();
  const auth = useAuth();

  const { currentUserEmail = '', currentUserId = '' } = auth ?? {};
  const [store, setStore] = useState({
    name: '',
    description: '',
    opening: '',
    closing: '',
    location: '',
    locationString: '',
    category: '',
    isOpen: false,
    distance: '0',
    creatorEmail: currentUserEmail || '',
    userId: currentUserId || ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [marker, setMarker] = useState({ lat: null, lng: null });
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setStore(prevStore => ({
      ...prevStore,
      [name]: value,
    }));
  };

  /*const handlePlaceSelect = () => {
    const address = autocomplete.getPlace();
    setStore({
      ...store,
      location: address.formatted_address,
      locationString: address.formatted_address,
    });
    setMarker({ lat: address.geometry.location.lat(), lng: address.geometry.location.lng() });
  };*/

  /*const onLoad = (autoC) => setAutocomplete(autoC);

  useEffect(()=> {
    localStorage.setItem('isMapsApiLoaded', true);
  }, [])*/

  const handleSubmit = async () => {

    try {
      const storeCollectionRef = collection(db, "Stores");
      console.log(currentUserId);
      console.log(store.name);
      console.log(store.location);
      console.log(store.description);
      console.log(store.opening);
      console.log(store.closing);
      console.log(store.isOpen);
      console.log(currentUserEmail);
      const storeDocRef = await addDoc(storeCollectionRef, {
        ...store,
        //location: marker,
      });

      const usersCollectionRef = collection(db, "Users");
      const q = query(usersCollectionRef, where("email", "==", currentUserEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming the email field is unique, there should only be one document
        const userDocRef = querySnapshot.docs[0].ref;

        // Step 3: Update the user document with the store ID
        
        await updateDoc(userDocRef, {
          storeId: storeDocRef.id,
        });

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        navigate.navigate('VendorHomepage'); // Navigate to home after successful store creation
      } else {
        console.log("User not found.");
      }

    } catch (error) {
      console.error("Error adding store", error);
    }
  };

  /*const libraries = ["places"];
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs",
    libraries,
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  const sideImageStyles = {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };*/

return (
<ScrollView contentContainerStyle={styles.container}>
       <Text style={styles.title}>Create Store</Text>
       <Text style={styles.subtitle}>Set-up your store right now!</Text>
       <TextInput
         style={styles.input}
         placeholder="Description"
         value={store.description}
         onChangeText={(value) => handleInputChange('description', value)}
       />
       <TextInput
         style={styles.input}
         placeholder="Store Name"
         value={store.name}
         onChangeText={(value) => handleInputChange('name', value)}
       />
       <TextInput
         style={styles.input}
         placeholder="Opening Hours (HH:MM)"
         value={store.opening}
         onChangeText={(value) => handleInputChange('opening', value)}
      />
       <TextInput
         style={styles.input}
         placeholder="Closing Hours (HH:MM)"
         value={store.closing}
         onChangeText={(value) => handleInputChange('closing', value)}
       />
       <TextInput
         style={styles.input}
         placeholder="Store Category"
         value={store.category}
         onChangeText={(value) => handleInputChange('category', value)}
       />
       <TextInput
         style={styles.input}
         placeholder="Store Address"
         value={store.location}
         onChangeText={(value) => handleInputChange('location', value)}
       />
       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
         <Text style={styles.buttonText}>Create Store</Text>
       </TouchableOpacity>
     </ScrollView>
   );
 };

 const styles = StyleSheet.create({
   container: {
     flexGrow: 1,
     justifyContent: 'center',
     alignItems: 'center',
     padding: 20,
     backgroundColor: '#F5F5F5',
   },
   title: {
     fontSize: 24,
     fontWeight: 'bold',
     marginBottom: 20,
     color: '#2E8B57',
   },
   subtitle: {
     fontSize: 16,
     marginBottom: 20,
     textAlign: 'center',
   },
   input: {
     width: '100%',
     height: 50,
     borderColor: '#ccc',
     borderWidth: 1,
     borderRadius: 5,
     paddingHorizontal: 10,
     marginBottom: 15,
     backgroundColor: '#fff',
   },
   button: {
     backgroundColor: '#2E8B57',
     borderRadius: 5,
     paddingVertical: 15,
     paddingHorizontal: 30,
     alignItems: 'center',
   },
   buttonText: {
     color: '#fff',
     fontSize: 16,
     fontWeight: 'bold',
   },
 });

export default CreateStore;
