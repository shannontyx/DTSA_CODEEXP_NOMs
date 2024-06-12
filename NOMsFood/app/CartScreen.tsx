import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const CartScreen = () => {
  const route = useRoute();
  const { orderedStoreId } = route.params as { storeId: string };
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [store, setStore] = useState<Store | null>(null);
  const [bringOwnContainer, setBringOwnContainer] = useState(false);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
  const goGreenDiscount = 1.00;
  const total = subtotal - goGreenDiscount;

  useEffect(() => {
    // Load cart items from storage on component mount
    console.log(orderedStoreId);
    loadCart();
    fetchStoreDetails();
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem(orderedStoreId);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }

  }

  const fetchStoreDetails = async () => {
    try {
      const storeDoc = doc(db, 'Stores', orderedStoreId);
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

  const saveCart = async (updatedCartItems) => {
    try {
      await AsyncStorage.setItem(orderedStoreId, JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const increaseQuantity = (index) => {
    // Increase item quantity by 1
    const updatedCartItems = [...cartItems];
    const newCartQuantity = updatedCartItems[index].cartQuantity + 1;
    if (newCartQuantity < updatedCartItems[index].quantity) {
      updatedCartItems[index].cartQuantity = newCartQuantity;
    }
    setCartItems(updatedCartItems);
    saveCart(updatedCartItems);
  };

  const decreaseQuantity = (index) => {
    // Decrease item quantity by 1, minimum quantity is 1
    const updatedCartItems = [...cartItems];
    const newCartQuantity = updatedCartItems[index].cartQuantity - 1
    if (newCartQuantity > 0) {
      updatedCartItems[index].cartQuantity = newCartQuantity;
    } else {
      updatedCartItems.splice(index, 1);
    }
    setCartItems(updatedCartItems);
    saveCart(updatedCartItems);
  };

  const handleCheckout = () => {
    // Navigate to checkout screen
    navigation.navigate('CheckoutScreen', { orderedStoreId: orderedStoreId });
  };

  const handleBringOwnContainerToggle = () => {
    setBringOwnContainer(!bringOwnContainer);
  };

  const applyDiscount = (subtotal) => {
    return bringOwnContainer ? subtotal - goGreenDiscount : subtotal;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      {cartItems.map((item, index) => (
        <View key={index} style={styles.cartItem}>
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          </View>
          <View style={styles.quantityButtons}>
            <TouchableOpacity onPress={() => increaseQuantity(index)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.itemQuantity}>{item.cartQuantity}</Text>
            <TouchableOpacity onPress={() => decreaseQuantity(index)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={styles.divider} />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={handleBringOwnContainerToggle} style={styles.checkbox}>
          {bringOwnContainer && <View style={styles.checkedBox} />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Bring your own container</Text>
      </View>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryText}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Go Green Discount</Text>
          <Text style={styles.summaryText}> {(bringOwnContainer && cartItems.length > 0) ? '-$' + goGreenDiscount.toFixed(2) : "$0.00"}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>${applyDiscount(subtotal).toFixed(2)}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.paymentButton, cartItems.length === 0 && styles.paymentButtonDisabled]}
        onPress={handleCheckout}
        disabled={cartItems.length === 0}
      >
        <Text style={styles.paymentButtonText}>Checkout Cart Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#3E5902',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
  },
  quantityButtons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: '#3E5902',
    borderRadius: 5,
    padding: 5, // Adjust padding to make the buttons larger
    marginRight: 5,
    marginLeft: 5,
    width: 30, // Fixed width for all buttons
    justifyContent: 'center', // Center button content vertically
    alignItems: 'center', // Center button content horizontally
  },
  quantityButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  itemQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E5902',
    marginHorizontal: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#CCC',
    marginVertical: 20,
  },
  summaryContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  summaryText: {
    fontSize: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentButton: {
    backgroundColor: '#3E5902',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  paymentButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  paymentButtonDisabled: {
    backgroundColor: 'gray',
  },
  removeItemButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeItemButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#3E5902',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    width: 14,
    height: 14,
    backgroundColor: '#3E5902',
    borderRadius: 3,
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default CartScreen;
