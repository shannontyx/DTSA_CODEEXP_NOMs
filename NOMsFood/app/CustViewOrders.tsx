import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, getDocs, getDoc, doc, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustViewOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [location, setLocation] = useState("");
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
        const ordersCollection = collection(db, 'Order');
        const q = query(ordersCollection, where('customerId', '==', currentUser.uid));
        const ordersSnapshot = await getDocs(q);

        const ordersData = await Promise.all(
          ordersSnapshot.docs.map(async (doc) => {
            const orderData = doc.data();
            const storeName = await fetchStoreName(orderData.storeId);
            return { id: doc.id, ...orderData, storeName };
          })
        );

        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching orders now:', error);
    }
  };

  const fetchStoreName = async (storeId: string) => {
    if (!storeId) {
      return 'Unknown Store';
    }

    try {
      const storeDoc = await getDoc(doc(db, 'Stores', storeId));
      if (storeDoc.exists()) {
        const storeData = storeDoc.data();
        console.log(storeData.locationString)
        setLocation(storeData.locationString);
        return storeData.name || 'Unknown Store';
      } else {
        return 'Unknown Store';
      }
    } catch (error) {
      console.error('Error fetching store name:', error);
      return 'Unknown Store';
    }
  };

  const handleViewDetails = (order: any) => {
    navigation.navigate('OrderDetails', { order, storeName: order.storeName, location: location });
  };

  const filteredOrders = orders.filter(order => {
    return activeTab === 'In Progress'
      ? order.orderStatus === 'In Progress'
      : order.orderStatus === 'Completed';
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headText}>Orders</Text>
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
              <Text style={styles.bold}>Store Name: {order.storeName}</Text>
              <Text style={styles.bold}>Collection Time: {new Date(order.date.seconds * 1000).toLocaleString()}</Text>
              <Text style={styles.status}>Status: {order.orderStatus}</Text>
              <TouchableOpacity onPress={() => handleViewDetails(order)}>
                <Text style={styles.detailsLink}>View Details</Text>
              </TouchableOpacity>
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
<TouchableOpacity
  style={styles.footerButton}
  // onPress={() => navigation.navigate('CustViewOrders')}
>
  <Icon name="file" size={24} color="#2c5f2d" />
  <Text style={styles.footerButtonText}>Orders</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.footerButton}
onPress={() => navigation.navigate('Profile')}>
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
    padding:0, 
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
    textDecorationLine: 'underline',
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
  noOrdersText: {
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    height: 60,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#DDDDDD",
  },
  footerButton: {
    alignItems: "center",
  },
  footerButtonText: {
    fontSize: 12,
    color: "#333333",
    marginTop: 5,
  },
});

export default CustViewOrders;
