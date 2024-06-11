import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

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

interface Listing {
  description: string;
  name: string;
  price: number;
  quantity: number;
  storeId: string;
  userId: string;
}

const StoreDetailsPage: React.FC = () => {
  const route = useRoute();
  const { storeId } = route.params as { storeId: string };
  const [store, setStore] = useState<Store | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const storeDoc = doc(db, 'Stores', storeId);
        const storeSnapshot = await getDoc(storeDoc);
        
        if (storeSnapshot.exists()) {
          const storeData = storeSnapshot.data() as Store;
          setStore({ storeId: storeSnapshot.id, ...storeData });
        } else {
          console.log('No such store!');
        }
      } catch (error) {
        console.error('Error fetching store details:', error);
      }
    };

    const fetchListings = async () => {
      try {
        const q = query(collection(db, 'Listing'), where('storeId', '==', storeId));
        const querySnapshot = await getDocs(q);
        const listingsData: Listing[] = [];
        querySnapshot.forEach((doc) => {
          listingsData.push(doc.data() as Listing);
        });
        setListings(listingsData);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchStoreDetails();
    fetchListings();
  }, [storeId]);

  if (!store) {
    return <Text>Loading...</Text>;
  }

  const handleAddToCart = (listing: Listing) => {
    // Handle adding to cart functionality here
    console.log(`Added ${listing.name} to cart`);
  };

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

      <View style={styles.listingsContainer}>
        <View style={styles.listingsGrid}>
          {listings.map((listing, index) => (
            <View key={index} style={styles.listingCard}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.listingImage} />
              <View style={styles.listingDetails}>
                <Text style={styles.listingName}>{listing.name}</Text>
                <Text style={styles.listingDescription}>{listing.description}</Text>
                <Text style={styles.listingPrice}>${listing.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={() => handleAddToCart(listing)} style={styles.addButton}>
                <MaterialIcons name="add" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
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
  listingsContainer: {
    padding: 20,
  },
  listingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: (width - 60) / 2, // Adjusting for padding and margin
    position: 'relative',
  },
  listingImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  listingDetails: {
    flex: 1,
    alignItems: 'center',
  },
  listingName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listingDescription: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'darkgreen',
    borderRadius: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StoreDetailsPage;
