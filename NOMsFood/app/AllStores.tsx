import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesCollection = collection(db, 'Stores');
        const storesSnapshot = await getDocs(storesCollection);
        const storesList = storesSnapshot.docs.map(doc => doc.data());
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

  const renderItem = ({ item }) => (
    <View style={styles.storeContainer}>
      <Image source={require('./../assets/images/storeDisplay.png')} style={styles.storeImage} />
      <View style={styles.storeDetails}>
        <Text style={styles.storeName}>{item.name}</Text>
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
        style={styles.searchBar}
        placeholder="Enter your location to sort by distance..."
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      <FlatList
        data={filteredStores}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  storeContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  storeImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  storeDetails: {
    padding: 10,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  storeText: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default StoresPage;
