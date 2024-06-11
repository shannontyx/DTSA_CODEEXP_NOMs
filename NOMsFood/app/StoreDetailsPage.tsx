import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

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
      <View style={styles.card}>
        <View style={styles.storeHeader}>
          <Image source={require('./../assets/images/storeDisplay.png')} style={styles.storeImage} />
          <Text style={styles.header}>{store.name}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <FontAwesome name="clock-o" size={24} color="green" />
            <Text style={styles.details}>Opening: {store.opening} - Closing: {store.closing}</Text>
          </View>
          <View style={styles.detailRow}>
            <FontAwesome name="map-marker" size={24} color="green" />
            <Text style={styles.details}>{store.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <FontAwesome name="star" size={24} color="green" />
            <Text style={styles.details}>Best Chicken Rice in Town</Text>
          </View>
          <Text style={styles.promotionText}>Bring your own container for $1 Discount!</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    height: height * 0.33,
    width: '100%',
    alignSelf: 'center',
    marginTop: 0,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  storeImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsContainer: {
    paddingHorizontal: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  details: {
    fontSize: 18,
    marginLeft: 10,
  },
  promotionText: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
    textAlign: 'left',
  },
});

export default StoreDetailsPage;
