import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const CartScreen = () => {
  const navigation = useNavigation(); // Use navigation hook
  const cartItems = [
    {
      name: 'DIY Bowl',
      price: 3.00,
      quantity: 2,
      image: require('../assets/images/eggtopia.png') , // Update the path to your image
    },
  ];
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const goGreenDiscount = 1.00;
  const total = subtotal - goGreenDiscount;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <View style={styles.cartItem}>
        <Image source={cartItems[0].image} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{cartItems[0].name}</Text>
          <Text style={styles.itemPrice}>${cartItems[0].price.toFixed(2)}</Text>
        </View>
        <Text style={styles.itemQuantity}>x {cartItems[0].quantity}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryText}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Go Green Discount</Text>
          <Text style={styles.summaryText}>-${goGreenDiscount.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>${total.toFixed(2)}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.paymentButton}
        onPress={() => navigation.navigate('Checkout')} // Navigate to Checkout
      >
        <Text style={styles.paymentButtonText}>Review Payment</Text>
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
  itemQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E5902',
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
});

export default CartScreen;
