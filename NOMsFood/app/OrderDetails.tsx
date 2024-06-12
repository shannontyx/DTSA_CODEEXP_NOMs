import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type OrderDetailsProps = {
  route: RouteProp<{ params: { order: any, storeName: string, location: string } }, 'params'>;
};

const OrderDetails = () => {
  const route = useRoute<OrderDetailsProps>();
  const { order, storeName, location } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Orders</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Order Summary</Text>
        <Text style={styles.orderId}>Order ID: #{order.orderId.slice(-4)}</Text>
        <Text style={styles.storeName}>From {storeName}</Text>
        {order.orderItems.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.item}>{item.quantity}x {item.listingName}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
        ))}
        <View style={styles.itemRow}>
          <Text style={styles.label}>Collection Time</Text>
          <Text style={styles.value}>{new Date(order.date.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.label}>Payment By</Text>
          <Text style={styles.value}>{order.paymentMethod || 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.storeCard}>
        <Text style={styles.storeName}>{storeName}</Text>
        <Image source={require('./../assets/images/storeDisplay.png')} style={styles.storeImage} />
        {/* <Image source={{ uri: './../assets/images/storeDisplay.png' }} style={styles.storeImage} /> */}
        <Text style={styles.storeAddress}>{location}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Received" onPress={() => alert('Order received!')} color="#10390A" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#10390A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    marginBottom: 10,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  storeCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  storeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  storeAddress: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});

export default OrderDetails;
