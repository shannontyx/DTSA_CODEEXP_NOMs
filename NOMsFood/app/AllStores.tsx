import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

const AllStores = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { autoFocus } = route.params || {};
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        updateStoreStatus();
        const storesCollection = collection(db, 'Stores');
        const storesSnapshot = await getDocs(storesCollection);
        const storesList = storesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            storeId: doc.id,
            ...data,
            isOpen: isStoreOpen(data.opening, data.closing),
          };
        });
        setStores(storesList);
        setFilteredStores(storesList);
      } catch (error) {
        console.error("Error fetching stores: ", error);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStores(filtered);
    }
  }, [searchQuery, stores]);

  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);

  const isStoreOpen = (opening, closing) => {
    const currentTime = moment();
    const openingTime = moment(opening, "HH:mm");
    const closingTime = moment(closing, "HH:mm");

    if (closingTime.isBefore(openingTime)) {
      // Handles cases where stores close after midnight
      return currentTime.isBetween(openingTime, moment("23:59", "HH:mm")) ||
        currentTime.isBetween(moment("00:00", "HH:mm"), closingTime);
    } else {
      return currentTime.isBetween(openingTime, closingTime);
    }
  };

  const updateStoreStatus = async () => {
    const currentTime = new Date();
    const storesCollection = collection(db, 'Store');
    const storesSnapshot = await getDocs(storesCollection);

    storesSnapshot.forEach(async (storeDoc) => {
        const storeData = storeDoc.data();
        const openingHours = storeData.opening;
        const [openHour, openMinute] = openingHours.split(':').map(Number);
        const closingHours = storeData.closing;
        const [closeHour, closeMinute] = closingHours.split(':').map(Number);

        // Check if the store has opening hours defined
        if (openingHours) {
            const openTime = new Date(currentTime);
            openTime.setHours(openHour, openMinute, 0, 0);
            const closeTime = new Date(currentTime);
            closeTime.setHours(closeHour, closeMinute, 0, 0);

            // Check if the current time is between open and close hours
            if (currentTime >= openTime && currentTime <= closeTime) {
                // Store is open
                await updateDoc(doc(db, 'Store', storeDoc.id), { isOpen: true });
                //console.log(storeData.name + " Open pls");
            } else {
                // Store is closed
                await updateDoc(doc(db, 'Store', storeDoc.id), { isOpen: false });
                //console.log(storeData.name + " Close pls");
            }
        } else {
            // If opening hours are not defined, consider the store closed
            await updateDoc(doc(db, 'Store', storeDoc.id), { isOpen: false });
            //console.log(storeData.name + " Dont Exist pls");
        }
    });
};

  const renderItem = ({ item }) => (
    <View style={[styles.storeContainer, !item.isOpen && styles.closedStore]}>
      <Image source={require('./../assets/images/storeDisplay.png')} style={styles.storeImage} />
      <View style={styles.storeDetails}>
        {item.isOpen ? (
          <TouchableOpacity onPress={() => navigation.navigate('StoreDetailsPage', { storeId: item.storeId })}>
            <Text style={styles.storeName}>{item.name}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.storeName}>{item.name}</Text>
        )}
        <View style={styles.storeInfo}>
          <Icon name="clock-o" size={16} color="#000" />
          <Text style={styles.storeText}> Opening: {item.opening} - Closing: {item.closing}</Text>
        </View>
        <View style={styles.storeInfo}>
          <Icon name="map-marker" size={16} color="#000" />
          <Text style={styles.storeText}>{item.location}</Text>
        </View>
        <View style={styles.storeInfo}>
          <Icon name="info-circle" size={16} color="#000" />
          <Text style={styles.storeText}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        ref={searchInputRef}
        style={styles.searchBar}
        placeholder="Search for stores..."
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      <FlatList
        data={filteredStores}
        keyExtractor={(item) => item.storeId}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20, // Increased padding around the container
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20, // Increased margin bottom for more space above the list
    backgroundColor: '#fff',
  },
  storeContainer: {
    marginBottom: 20, // Increased margin bottom for more space between items
    marginHorizontal: 5, // Add horizontal margins to create more space from the edges
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3, // Slightly increased elevation for a subtle shadow effect
  },
  closedStore: {
    backgroundColor: '#d3d3d3',
  },
  storeImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  storeDetails: {
    padding: 15, // Increased padding inside the details for better layout
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10, // Increased margin below the title
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Increased margin bottom between info rows
  },
  storeText: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default AllStores;
