import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';

const StoresCategories = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params || { category: '' };
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesCollection = collection(db, 'Stores');
        let storesQuery;
        if (category) {
          storesQuery = query(storesCollection, where('category', '==', category));
        } else {
          storesQuery = storesCollection;
        }
        const storesSnapshot = await getDocs(storesQuery);
        const storesList = storesSnapshot.docs.map(doc => ({ storeId: doc.id, ...doc.data() }));
        setStores(storesList);
        setFilteredStores(storesList);
      } catch (error) {
        console.error("Error fetching stores: ", error);
      }
    };

    fetchStores();
  }, [category]);

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

  const renderItem = ({ item }) => (
    <View style={styles.storeContainer}>
      <Image source={require('./../assets/images/storeDisplay.png')} style={styles.storeImage} />
      <View style={styles.storeDetails}>
        <TouchableOpacity onPress={() => navigation.navigate('StoreDetailsPage', { storeId: item.storeId })}>
          <Text style={styles.storeName}>{item.name}</Text>
        </TouchableOpacity>
        <View style={styles.storeInfo}>
          <Icon name="clock-o" size={16} color="green" />
          <Text style={styles.storeText}> Opening: {item.opening} - Closing: {item.closing}</Text>
        </View>
        <View style={styles.storeInfo}>
          <Icon name="map-marker" size={16} color="green" />
          <Text style={styles.storeText}>{item.location}</Text>
        </View>
        <View style={styles.storeInfo}>
          <Icon name="info-circle" size={16} color="green" />
          <Text style={styles.storeText}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Enter your location to sort by distance..."
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

export default StoresCategories;
