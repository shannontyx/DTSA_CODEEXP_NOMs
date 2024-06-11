import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';

interface Store {
  storeId: string;
  name: string;
  location: string;
  opening: string;
  closing: string;
  description: string;
  contact: string;
  email: string;
}

const StoreDetailsPage: React.FC = () => {
  const route = useRoute();
  const { storeId } = route.params as { storeId: string };
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const storeDoc = doc(db, 'Stores', storeId);
        const storeSnapshot = await getDoc(storeDoc);
        console.log(storeSnapshot.id);
        
        if (storeSnapshot.exists()) {
          const storeData = storeSnapshot.data() as Store;
          console.log('Store data:', storeData);
          setStore({ storeId: storeSnapshot.id, ...storeData });
        } else {
          console.log('No such store!');
        }
      } catch (error) {
        console.error('Error fetching store details:', error);
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
    backgroundColor: '#F5F5F5',
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
