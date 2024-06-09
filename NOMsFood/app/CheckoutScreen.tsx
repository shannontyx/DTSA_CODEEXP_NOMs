import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CheckoutScreen = () => {
  const cartItems = [
    {
      name: 'DIY Bowl',
      price: 3.00,
      quantity: 2,
    },
  ];
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const goGreenDiscount = 1.00;
  const total = subtotal - goGreenDiscount;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>
      <View style={styles.orderSummary}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.orderItem}>
          <Text style={styles.orderItemText}>{cartItems[0].quantity}x {cartItems[0].name}</Text>
          <Text style={styles.orderItemText}>${cartItems[0].price.toFixed(2)}</Text>
        </View>
        <View style={styles.orderDetails}>
          <Text style={styles.orderDetailsText}>Collection Time</Text>
          <Text style={styles.orderDetailsText}>6:00pm</Text>
        </View>
        <View style={styles.orderDetails}>
          <Text style={styles.orderDetailsText}>Payment By</Text>
          <Text style={styles.orderDetailsText}>VISA</Text>
        </View>
      </View>
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
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>Check Out</Text>
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
  orderSummary: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderItemText: {
    fontSize: 16,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  orderDetailsText: {
    fontSize: 16,
    color: '#666',
  },
  summaryContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 20,
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
  checkoutButton: {
    backgroundColor: '#3E5902',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default CheckoutScreen;
