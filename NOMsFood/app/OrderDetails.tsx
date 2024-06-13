import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import MapView, { Marker } from 'react-native-maps';

type OrderDetailsProps = {
  route: RouteProp<{ params: { order: any, storeName: string, storeId: string } }, 'params'>;
};

const OrderDetails = () => {
  const route = useRoute<OrderDetailsProps>();
  const { order, storeName, storeId } = route.params;
  const [storeDetails, setStoreDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        if (!storeId) {
          console.error("storeId is undefined or empty.");
          setLoading(false);
          return;
        }
        const storeDocRef = doc(db, 'Stores', storeId);
        const storeDoc = await getDoc(storeDocRef);

        if (storeDoc.exists()) {
          const storeData = storeDoc.data();
          setStoreDetails(storeData);
        } else {
          console.error("Store not found.");
        }
      } catch (error) {
        console.error("Error fetching store details: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [storeId]);

  const handleReceived = async () => {
    try {
      const orderDocRef = doc(db, 'Order', order.orderId);
      await updateDoc(orderDocRef, { orderStatus: 'Completed' });
      Alert.alert('Order has been collected!');
    } catch (error) {
      console.error("Error updating order status: ", error);
      Alert.alert('Error', 'There was an error updating the order status');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10390A" />
      </View>
    );
  }

  if (!storeDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text>Store details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Orders</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Order Summary</Text>
        <Text style={styles.orderId}>Order ID: #{order.orderId.slice(-4)}</Text>
        <Text style={styles.storeName}>From {storeName}</Text>
        {order.orderItems.cart.map((item, index) => (
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
        <Text style={styles.storeAddress}>{storeDetails.location}</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: storeDetails.locationG.lat,
            longitude: storeDetails.locationG.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={{
            latitude: storeDetails.locationG.lat,
            longitude: storeDetails.locationG.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={{ latitude: storeDetails.locationG.lat, longitude: storeDetails.locationG.lng }} />
        </MapView>
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
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderDetails;
