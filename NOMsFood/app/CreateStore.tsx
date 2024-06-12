import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, View, Switch, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function CreateStore() {
  const navigate = useNavigation();
  const [store, setStore] = useState({
    name: '',
    description: '',
    opening: '',
    closing: '',
    location: '',
    locationG: '',
    category: 'Chinese', // Default category
    isOpen: false,
    isGreen: false, // Go Green switch
    distance: '0',
    creatorEmail: '',
    userId: ''
  });
  const [marker, setMarker] = useState({ lat: 1.3521, lng: 103.8198 }); // Default to Singapore coordinates
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([
    { label: 'Western', value: 'Western' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'Korean', value: 'Korean' },
    { label: 'Halal', value: 'Halal' },
    { label: 'Indian', value: 'Indian' },
    { label: 'Pastries', value: 'Pastries' },
    { label: 'Greens', value: 'Greens' },
    { label: 'Chinese', value: 'Chinese' },
  ]);

  const handleInputChange = (name: string, value: any) => {
    setStore(prevStore => ({
      ...prevStore,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const storeCollectionRef = collection(db, "Stores");
      const storeDocRef = await addDoc(storeCollectionRef, {
        ...store,
        locationG: marker,
        location: store.location,
      });

      const usersCollectionRef = collection(db, "Users");
      const q = query(usersCollectionRef, where("email", "==", store.creatorEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        await updateDoc(userDocRef, {
          storeId: storeDocRef.id,
        });
        navigate.navigate('VendorHomepage');
      } else {
        console.log("User not found.");
      }
    } catch (error) {
      console.error("Error adding store", error);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Store</Text>
      <Text style={styles.subtitle}>Set-up your store right now!</Text>
      <TextInput
        style={styles.input}
        placeholder="Store Name"
        value={store.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={store.description}
        onChangeText={(value) => handleInputChange('description', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Vendor Email"
        value={store.creatorEmail}
        onChangeText={(value) => handleInputChange('creatorEmail', value)}
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
      <Text style={styles.pickerLabel}>Category</Text>
      <DropDownPicker
        open={open}
        value={store.category}
        items={categories}
        setOpen={setOpen}
        setValue={(callback) => handleInputChange('category', callback(store.category))}
        setItems={setCategories}
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
      />
      <GooglePlacesAutocomplete
        placeholder='Enter Store Address'
        onPress={(data, details = null) => {
          const location = data.description;
          const { lat, lng } = details.geometry.location;
          setMarker({ lat, lng });
          handleInputChange('locationG', `${lat},${lng}`);
          handleInputChange('location', location);
        }}
        query={{
          key: 'AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs',
          language: 'en',
        }}
        fetchDetails={true}
        styles={{
          textInputContainer: {
            width: '100%',
          },
          textInput: {
            height: 50,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginBottom: 15,
            backgroundColor: '#fff',
          },
        }}
      />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: marker.lat,
          longitude: marker.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={{
          latitude: marker.lat,
          longitude: marker.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude: marker.lat, longitude: marker.lng }} />
      </MapView>
      <View style={styles.greenContainer}>
        <Icon name="recycle" size={20} color="#10390A" style={styles.icon} />
        <Text style={styles.label2}>Be part of Go Green</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Allow Bring Your Own Container</Text>
        <Switch
          value={store.isGreen}
          onValueChange={(value) => handleInputChange('isGreen', value)}
        />
      </View>
      <TouchableOpacity onPress={() => setShowMoreInfo(!showMoreInfo)}>
        <Text style={styles.moreInfoText}>More info</Text>
      </TouchableOpacity>
      {showMoreInfo && (
        <View style={styles.moreInfoContainer}>
          <Text style={styles.moreInfoText2}>
            The energy used to manufacture reusable packaging items is up to 64% lower than is required to manufacture and recycle the single-use packaging items they replace. Do your part to save our earth.
          </Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Store</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
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
  pickerLabel: {
    width: '100%',
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 15,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 15,
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
  greenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginRight: 10,
  },
  label2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10390A',
    marginLeft: 5,
  },
  moreInfoText: {
    fontSize: 16,
    color: '#10390A',
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
  moreInfoText2: {
    fontSize: 16,
    color: '#10390A',
    marginBottom: 15,
  },
  moreInfoContainer: {
    marginBottom: 15,
    backgroundColor: '#d1ffbd',
    padding: 10,
    borderRadius: 5,
  },
});

export default CreateStore;
