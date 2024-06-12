import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/firebaseConfig';
import { useCreatePaymentIntentMutation } from '../components/apiSlice';
import { useStripe } from '@stripe/stripe-react-native';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getFirestore, where, query, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';


function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

const CheckoutScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const route = useRoute();
  const { orderedStoreId, bringOwnContainer } = route.params as { storeId: string, bringOwnContainer: boolean };
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [store, setStore] = useState<Store | null>(null);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
  const goGreenDiscount = 1.00;
  const total = bringOwnContainer ? subtotal - goGreenDiscount : subtotal;
  const [createPaymentIntent] = useCreatePaymentIntentMutation();



  useEffect(() => {
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
  };

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


  const applyDiscount = (subtotal) => {
    return bringOwnContainer ? subtotal - goGreenDiscount : subtotal;
  };

  const createOrder = async () => {
    console.log("firebasing");
    const orderDetails = {
      cart: cartItems.map(item => ({
        listingId: item.id,
        price: item.price,
        quantity: item.cartQuantity,
      })),
      totalPayment: total.toString()
    };
    const currentTime = new Date();
    const auth = getAuth(); // Get Current User State
    const currentUser = auth.currentUser;
    console.log(orderDetails);
    const userQuerySnapshot = await getDocs(query(collection(db, 'Users'), where("userId", "==", currentUser.uid)));
    const user = userQuerySnapshot.docs[0].data();

    if (orderDetails) {
      const newOrderPayload = {
        customerId: currentUser.uid,
        customerName: user.name,
        date: currentTime,
        orderItems: orderDetails,
        orderStatus: "Ongoing",
        orderPrice: total,
        storeId: orderedStoreId,
        orderId: generateRandomString(),
        orderReviewed: false
      }

      console.log(newOrderPayload);

      try {
        addDoc(collection(db, 'Order'), newOrderPayload);
        console.log("Done")
        for (const item of orderDetails.cart) {
          const listingDocRef = doc(db, 'Listing', item.listingId);
          const listingDocSnapshot = await getDoc(listingDocRef);
          if (listingDocSnapshot.exists()) {
            const listingData = listingDocSnapshot.data();
            const currentInventoryCount = parseInt(listingData.quantity, 10);
            console.log(currentInventoryCount);
            const updatedInventoryCount = currentInventoryCount - item.quantity;
            console.log(updatedInventoryCount);
            await updateDoc(listingDocRef, { quantity: updatedInventoryCount });
            console.log(`Updated inventory count for listing ${item.listingId}`);
          } else {
            console.log(`Listing ${item.listingId} not found.`);
          }
        }
      } catch (error) {
        console.error('Error adding order', error);
      }
      await AsyncStorage.clear();

      navigation.navigate("orderConfirmed");
    }
  }

  const completeOrder = async () => {
    console.log(total);
    const payAndCheckout = async () => {
      const response = await createPaymentIntent({
        amount: Math.floor(total * 100),
      });
      console.log(response);
      if (response.error) {
        Alert.alert('Something went wrong', response.error);
        return;
      }
      console.log("step 2");
      const initResponse = await initPaymentSheet({
        merchantDisplayName: store.name,
        paymentIntentClientSecret: response.data.paymentIntent,
      });
      if (initResponse.error) {
        Alert.alert('Something went wrong');
        return;
      }
      console.log("step 3");
      const paymentResponse = await presentPaymentSheet();

      if (paymentResponse.error) {
        Alert.alert(
          `Error code: ${paymentResponse.error.code}`,
          paymentResponse.error.message
        );
        return;
      }
      createOrder();
    };

    await payAndCheckout();

  }




  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <View style={styles.card}>
        {cartItems.map((item, index) => (
          <View key={index}>
            <View style={styles.cartItem}>
              <Image source={{ uri: item.imageurl || 'https://via.placeholder.com/60' }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <Text style={styles.itemPrice}>Qty: {item.cartQuantity}</Text>
              </View>
              <View style={styles.quantityButtons}>
                <Text style={styles.itemQuantity}>${(item.price * item.cartQuantity).toFixed(2)}</Text>
              </View>
            </View>
            {index < cartItems.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
      <View style={styles.card}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Go Green Discount</Text>
            <Text style={styles.summaryText}>{(bringOwnContainer && cartItems.length > 0) ? '-$' + goGreenDiscount.toFixed(2) : "$0.00"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>${applyDiscount(subtotal).toFixed(2)}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.paymentButton, cartItems.length === 0 && styles.paymentButtonDisabled]}
        onPress={completeOrder}
        disabled={cartItems.length === 0}
      >
        <Text style={styles.paymentButtonText}>Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
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
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#3E5902',
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  itemQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E5902',
    marginHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#CCC',
    marginVertical: 10,
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
  summaryContainer: {
    padding: 10,
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
});

export default CheckoutScreen;