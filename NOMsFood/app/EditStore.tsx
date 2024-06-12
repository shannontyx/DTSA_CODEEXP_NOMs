import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, FlatList, Switch, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const EditStore = () => {
  const navigation = useNavigation();
  const [store, setStore] = useState({
    name: '',
    description: '',
    contact: '',
    opening: '',
    closing: '',
    location: '',
    locationG: { lat: 1.3521, lng: 103.8198 }, // Default to Singapore coordinates
    category: '',
    isGreen: false
  });
  const [loading, setLoading] = useState(true);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [marker, setMarker] = useState({ lat: 1.3521, lng: 103.8198 }); // Default to Singapore coordinates

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const auth = getAuth();
        const activeUser = auth.currentUser;
        if (activeUser) {
          const storeQuerySnapshot = await getDocs(
            query(collection(db, 'Stores'), where('userId', '==', activeUser.uid))
          );

          if (!storeQuerySnapshot.empty) {
            const storeData = storeQuerySnapshot.docs[0].data();
            setStore(storeData);
            setMarker(storeData.locationG || { lat: 1.3521, lng: 103.8198 });
          } else {
            console.error("No store found for the current user.");
          }
        }
      } catch (error) {
        console.error("Error fetching store data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  const handleInputChange = (field, value) => {
    setStore({ ...store, [field]: value });
  };

  const handlePlaceSelect = (data, details) => {
    const address = details.formatted_address;
    const { lat, lng } = details.geometry.location;
    setStore(prevStore => ({
      ...prevStore,
      locationG: { lat, lng },
      location: address,
    }));
    setMarker({ lat, lng });
  };

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const activeUser = auth.currentUser;
      if (activeUser) {
        const storeQuerySnapshot = await getDocs(
          query(collection(db, 'Stores'), where('userId', '==', activeUser.uid))
        );

        if (!storeQuerySnapshot.empty) {
          const storeDocRef = storeQuerySnapshot.docs[0].ref;
          await updateDoc(storeDocRef, store);

          Alert.alert('Success', 'Store details updated successfully');
          navigation.navigate('VendorHomepage'); // Go back to the ManageStore page
        }
      }
    } catch (error) {
      console.error("Error updating store data: ", error);
      Alert.alert('Error', 'There was an error updating the store details');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const formData = [
    {
      key: 'storeName',
      component: (
        <TextInput
          style={styles.input}
          placeholder="Store Name"
          value={store.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
      ),
    },
    {
      key: 'storeDescription',
      component: (
        <TextInput
          style={styles.input}
          placeholder="Store Description"
          value={store.description}
          onChangeText={(text) => handleInputChange('description', text)}
        />
      ),
    },
    {
      key: 'contactDetails',
      component: (
        <TextInput
          style={styles.input}
          placeholder="Contact Details"
          value={store.contact}
          onChangeText={(text) => handleInputChange('contact', text)}
        />
      ),
    },
    {
      key: 'openingTime',
      component: (
        <TextInput
          style={styles.input}
          placeholder="Opening Time"
          value={store.opening}
          onChangeText={(text) => handleInputChange('opening', text)}
        />
      ),
    },
    {
      key: 'closingTime',
      component: (
        <TextInput
          style={styles.input}
          placeholder="Closing Time"
          value={store.closing}
          onChangeText={(text) => handleInputChange('closing', text)}
        />
      ),
    },
    {
      key: 'location',
      component: (
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={store.location}
          onChangeText={(text) => handleInputChange('location', text)}
        />
      ),
    },
    {
      key: 'category',
      component: (
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={store.category}
          onChangeText={(text) => handleInputChange('category', text)}
        />
      ),
    },
    {
      key: 'googlePlaces',
      component: (
        <GooglePlacesAutocomplete
          placeholder='Enter Store Address'
          onPress={handlePlaceSelect}
          query={{
            key: 'AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs',
            language: 'en',
          }}
          fetchDetails={true}
          styles={{
            textInputContainer: {
              width: '90%',
              alignContent: 'center',
              marginLeft: 20,
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
      ),
    },
    {
      key: 'mapView',
      component: (
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
      ),
    },
    {
      key: 'goGreen',
      component: (
        <>
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
        </>
      ),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={formData}
        renderItem={({ item }) => <View key={item.key}>{item.component}</View>}
        ListHeaderComponent={() => (
          <>
            <Text style={styles.headerText}>Edit Store</Text>
          </>
        )}
        ListFooterComponent={() => (
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={handleSave} color="#10390A" />
          </View>
        )}
        keyExtractor={(item) => item.key}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#10390A',
    marginLeft: 20,
    marginBottom: 15,
    marginTop: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  greenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 20,
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
    marginLeft: 20,
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
    marginLeft: 20,
  },
  moreInfoText2: {
    fontSize: 16,
    color: '#10390A',
    marginBottom: 15,
    marginLeft: 20,
  },
  moreInfoContainer: {
    marginBottom: 15,
    backgroundColor: '#d1ffbd',
    padding: 10,
    borderRadius: 5,
    marginLeft: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '90%',
    height: 300,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 30,
  },
  icon: {
    marginRight: 5,
  },
});

export default EditStore;
