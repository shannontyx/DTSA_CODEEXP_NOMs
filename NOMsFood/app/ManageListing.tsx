import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';

interface Listing {
    id: string;
    userId: string;
    storeId: string
    price: number;
    quantity: number;
    description: string;
    name: string;
  }

const ManageListing = () => {
    const [activeTab, setActiveTab] = useState('In Stock');
    const [modalVisible, setModalVisible] = useState(false);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [listings, setListings] = useState<Listing[]>([]);
    const auth = getAuth();
    const userId = auth.currentUser?.uid || ''; // Replace with the actual current user ID
  
    useEffect(() => {
      const fetchListings = async () => {
        // const auth = getAuth();
        // const activeUser = auth.currentUser;
        console.log(userId);
        const q = query(collection(db, 'Listing'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        // const fetchedListings: Listing[] = [];
        // querySnapshot.forEach((doc) => {
        //   fetchedListings.push({ id: doc.id, ...doc.data() });
        // });
        // setListings(fetchedListings);
        const fetchedListings = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Listing));
          setListings(fetchedListings);
          console.log(fetchListings.length);
        // const fetchedListings = querySnapshot.docs.map(doc => doc.data() as Listing);
        // setListings(fetchedListings);
      };
  
      fetchListings();
    }, [userId]);
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Manage Listing</Text>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'In Stock' && styles.activeTab]}
            onPress={() => setActiveTab('In Stock')}>
            <Text style={[styles.tabText, activeTab === 'In Stock' && styles.activeTabText]}>In Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Out Of Stock' && styles.activeTab]}
            onPress={() => setActiveTab('Out Of Stock')}>
            <Text style={[styles.tabText, activeTab === 'Out Of Stock' && styles.activeTabText]}>Out Of Stock</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <TouchableOpacity style={styles.listingButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.listingButtonText}>Create Listing</Text>
          </TouchableOpacity>
          {activeTab === 'In Stock' && (
            <>
              {listings.map((listing) => (
                <View key={listing.id} style={styles.listingCard}>
                  <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.listingImage} />
                  <View style={styles.listingInfo}>
                    <Text style={styles.listingTitle}>{listing.name}</Text>
                    <Text style={styles.listingDescription}>Description: {listing.description}</Text>
                    <Text style={styles.listingDetails}>Price: ${listing.price}</Text>
                    <Text style={styles.listingDetails}>Quantity: {listing.quantity}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Icon name="group" size={24} color="#2c5f2d" />
            <Text style={styles.footerButtonText}>Manage Store</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => setModalVisible(true)}>
            <Icon name="plus-square" size={24} color="#2c5f2d" />
            <Text style={styles.footerButtonText}>Create Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Icon name="star" size={24} color="#2c5f2d" />
            <Text style={styles.footerButtonText}>View Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Icon name="shopping-cart" size={24} color="#2c5f2d" />
            <Text style={styles.footerButtonText}>View Orders</Text>
          </TouchableOpacity>
        </View>
  
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Upload Image</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={productName}
                onChangeText={setProductName}
              />
              <TextInput
                style={styles.input}
                placeholder="Product Description"
                value={productDescription}
                onChangeText={setProductDescription}
              />
              <TextInput
                style={styles.input}
                placeholder="Price ($)"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.updateButton}>
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    height: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  headerText: {
    fontSize: 20,
    color: '#2c5f2d',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  tab: {
    padding: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2c5f2d',
  },
  tabText: {
    fontSize: 16,
    color: '#888888',
  },
  activeTabText: {
    color: '#2c5f2d',
    fontWeight: 'bold',
  },
  listingButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#2c5f2d',
    borderRadius: 10,
    alignItems: 'center',
  },
  listingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  listingInfo: {
    marginLeft: 10,
    flex: 1,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  listingDescription: {
    color: '#777777',
    marginTop: 5,
  },
  listingDetails: {
    color: '#333333',
    marginTop: 5,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#2c5f2d',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingVertical: 10,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#2c5f2d',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ManageListing;
