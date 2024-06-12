import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, getDoc, getDocs, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const VendorViewOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'In Progress' | 'Completed'>('In Progress');
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Fetch the vendor's storeId from the user's profile
        const vendorDoc = await getDoc(doc(db, 'Users', currentUser.uid));
        const vendorData = vendorDoc.data();
        const storeId = vendorData?.storeId;

        if (storeId) {
          const ordersCollection = collection(db, 'Order');
          const q = query(ordersCollection, where('storeId', '==', storeId));
          const ordersSnapshot = await getDocs(q);

          const ordersData = ordersSnapshot.docs.map((doc) => {
            const orderData = doc.data();
            return { id: doc.id, ...orderData };
          });

          setOrders(ordersData);
        } else {
          console.error('Store ID not found for the current vendor.');
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleViewDetails = (order: any) => {
    const storeName = orders.find(o => o.storeId === order.storeId)?.storeName || 'Unknown Store';
    navigation.navigate('OrderDetails', { order, storeName, storeId: order.storeId });
  };

  const handleOrderReceived = async (orderId: string) => {
    try {
      const orderDocRef = doc(db, 'Order', orderId);
      await updateDoc(orderDocRef, { orderStatus: 'Completed' });
      Alert.alert('Success', 'Order status has been updated to Completed.');
      fetchOrders(); // Refresh orders after status update
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'There was an error updating the order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    return activeTab === 'In Progress'
      ? order.orderStatus === 'In Progress'
      : order.orderStatus === 'Completed';
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Vendor Order Management</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'In Progress' && styles.activeTab]}
          onPress={() => setActiveTab('In Progress')}
        >
          <Text style={[styles.tabText, activeTab === 'In Progress' && styles.activeTabText]}>In Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <View key={order.id} style={styles.card}>
              <Text style={styles.orderId}>Order ID: {order.id.slice(-4)}</Text>
              <Text style={styles.bold}>Customer Name: {order.customerName}</Text>
              <Text style={styles.bold}>Collection Time: {new Date(order.date.seconds * 1000).toLocaleString()}</Text>
              <Text style={styles.status}>Status: {order.orderStatus}</Text>
              <TouchableOpacity onPress={() => handleViewDetails(order)}>
                <Text style={styles.detailsLink}>View Details</Text>
              </TouchableOpacity>
              {order.orderStatus === 'In Progress' && (
                <TouchableOpacity style={styles.receivedButton} onPress={() => handleOrderReceived(order.id)}>
                  <Icon name="check-circle" size={24} color="#2c5f2d" />
                  <Text style={styles.receivedButtonText}>Mark as Completed</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noOrdersText}>No orders found.</Text>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Homepage')}
        >
          <Icon name="home" size={24} color="#2c5f2d" />
          <Text style={styles.footerButtonText}>Home Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="file" size={24} color="#2c5f2d" />
          <Text style={styles.footerButtonText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="group" size={24} color="#2c5f2d" />
          <Text style={styles.footerButtonText}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  headText: {
    fontSize: 20,
    padding: 10,
    marginTop: 25,
    textAlign: 'center',
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#10390A',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    color: '#10390A',
    fontWeight: 'bold',
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  orderId: {
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailsLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  receivedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  receivedButtonText: {
    marginLeft: 5,
    color: '#2c5f2d',
    fontWeight: 'bold',
  },
  noOrdersText: {
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 12,
    color: '#333333',
    marginTop: 5,
  },
  header: {
    height: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 33,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  headerText: {
    fontSize: 20,
    color: '#2c5f2d',
    fontWeight: 'bold',
  },
});

export default VendorViewOrders;
