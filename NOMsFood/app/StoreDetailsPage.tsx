import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

interface CartItem extends Listing {
  cartQuantity: number;
}

const StoreDetailsPage: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { storeId } = route.params as { storeId: string };
  const [store, setStore] = useState<Store | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [cart, setCart] = useState<Listing[]>([]);

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

    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    fetchStoreDetails();
    fetchListings();
    loadCart();
  }, [storeId]);

  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    saveCart();
  }, [cart]);

  if (!store) {
    return <Text>Loading...</Text>;
  }

  const handleAddToCart = (listing: Listing) => {
    if (listing.quantity > 0) {
      setCart((prevCart) => {
        const existingItem = prevCart.find(item => item.name === listing.name);
        if (existingItem) {
          return prevCart.map(item =>
            item.name === listing.name ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
          );
        } else {
          return [...prevCart, { ...listing, cartQuantity: 1 }];
        }
      });
      console.log(`Added ${listing.name} to cart`);
    } else {
      console.log(`${listing.name} is out of stock`);
    }
  };

  const getCartQuantity = (listingName: string) => {
    const item = cart.find(cartItem => cartItem.name === listingName);
    return item ? item.cartQuantity : 0;
  };

  const handleCheckout = () => {
    navigation.navigate('CartScreen');
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
        <Text style={styles.cartCount}>Cart Items: {cart.length}</Text>
        <View style={styles.listingsGrid}>
          {listings.map((listing, index) => (
            <View key={index} style={styles.listingCard}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.listingImage} />
              <View style={styles.listingDetails}>
                <Text style={styles.listingName}>{listing.name}</Text>
                <Text style={styles.listingDescription}>{listing.description}</Text>
                <Text style={styles.listingPrice}>${listing.price.toFixed(2)}</Text>
                <Text style={styles.listingQuantity}>In Stock: {listing.quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleAddToCart(listing)}
                style={[
                  styles.addButton,
                  (listing.quantity === 0 || getCartQuantity(listing.name) >= listing.quantity) && styles.addButtonDisabled
                ]}
                disabled={listing.quantity === 0 || getCartQuantity(listing.name) >= listing.quantity}
              >
                <MaterialIcons name="add" size={16} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.cartQuantityText}>
                Added: {getCartQuantity(listing.name) || 0}
              </Text>
            </View>
          ))}
        </View>
        {cart.length > 0 && (
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        )}
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
  addButtonDisabled: {
    backgroundColor: 'grey',
  },
  cartQuantityText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 5,
  },
  checkoutButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StoreDetailsPage;
