import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const StoreDetailsPage = ({ route }) => {
  const { storeId } = route.params;
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      const storeDoc = doc(db, 'Stores', storeId);
      const storeSnapshot = await getDoc(storeDoc);
      if (storeSnapshot.exists()) {
        setStore({ storeId: storeSnapshot.id, ...storeSnapshot.data() });
      } else {
        console.log('No such store!');
      }
    };

    fetchStoreDetails();
  }, [storeId]);

  if (!store) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={require('./../assets/images/storeDisplay.png')} style={styles.storeImage} />
      <Text style={styles.header}>{store.name}</Text>
      <Text style={styles.details}>Location: {store.location}</Text>
      <Text style={styles.details}>Opening Hours: {store.opening} - {store.closing}</Text>
      <Text style={styles.details}>Description: {store.description}</Text>
      <Text style={styles.details}>Contact: {store.contact}</Text>
      <Text style={styles.details}>Email: {store.email}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  storeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  details: {
    fontSize: 18,
    marginBottom: 10,
  }
});

export default StoreDetailsPage;
