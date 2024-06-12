import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';

interface Listing {
    id: string;
    userId: string;
    storeId: string;
    price: number;
    quantity: number;
    description: string;
    name: string;
}

const ManageListing = () => {
    const [activeTab, setActiveTab] = useState('In Stock');
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentListing, setCurrentListing] = useState<Listing | null>(null);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [inStockListings, setInStockListings] = useState<Listing[]>([]);
    const [outOfStockListings, setOutOfStockListings] = useState<Listing[]>([]);
    const auth = getAuth();
    const userId = auth.currentUser?.uid || '';
    const [storeId, setStoreId] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            if (!userId) {
                console.log('User ID not available');
                return;
            }
            console.log('Fetching listings for user:', userId);

            const q2 = query(collection(db, 'Stores'), where('userId', '==', userId));
            const querySnapshot2 = await getDocs(q2);
            
            querySnapshot2.forEach((doc) => {
                setStoreId(doc.id);
            });

            const q = query(collection(db, 'Listing'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);

            console.log('Query snapshot:', querySnapshot.size, 'documents found');

            querySnapshot.forEach((doc) => {
                console.log('Document:', doc.id, doc.data());
            });

            const fetchedListings = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Listing));

            const inStock = fetchedListings.filter(listing => listing.quantity > 0);
            const outOfStock = fetchedListings.filter(listing => listing.quantity <= 0);

            setInStockListings(inStock);
            setOutOfStockListings(outOfStock);
        };

        fetchListings();
    }, [userId]);

    const handleCreateListing = async () => {
        if (!productName || !productDescription || !price || !quantity) {
            console.log('Please fill out all fields');
            return;
        }

        const newListing: Omit<Listing, 'id'> = {
            userId,
            storeId: storeId, 
            name: productName,
            description: productDescription,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
        };

        try {
            const docRef = await addDoc(collection(db, 'Listing'), newListing);
            console.log('Document written with ID: ', docRef.id);

            // Update the local state
            const updatedListing = { ...newListing, id: docRef.id };
            if (updatedListing.quantity > 0) {
                setInStockListings([...inStockListings, updatedListing]);
            } else {
                setOutOfStockListings([...outOfStockListings, updatedListing]);
            }

            // Close the modal
            setModalVisible(false);
            resetForm();
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const handleEditListing = async () => {
        if (!currentListing) return;

        const updatedListing = {
            ...currentListing,
            name: productName,
            description: productDescription,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
        };

        try {
            const listingDoc = doc(db, 'Listing', currentListing.id);
            await updateDoc(listingDoc, updatedListing);

            // Update the local state
            const inStock = updatedListing.quantity > 0;
            if (inStock) {
                setInStockListings(prev => prev.map(listing => listing.id === currentListing.id ? updatedListing : listing));
                setOutOfStockListings(prev => prev.filter(listing => listing.id !== currentListing.id));
            } else {
                setOutOfStockListings(prev => prev.map(listing => listing.id === currentListing.id ? updatedListing : listing));
                setInStockListings(prev => prev.filter(listing => listing.id !== currentListing.id));
            }

            // Close the modal
            setModalVisible(false);
            resetForm();
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    const handleDeleteListing = async (listingId: string) => {
        try {
            await deleteDoc(doc(db, 'Listing', listingId));

            // Update the local state
            setInStockListings(prev => prev.filter(listing => listing.id !== listingId));
            setOutOfStockListings(prev => prev.filter(listing => listing.id !== listingId));
        } catch (error) {
            console.error('Error deleting document: ', error);
        }
    };

    const confirmDeleteListing = (listingId: string) => {
        Alert.alert(
            "Delete Listing",
            "Are you sure you want to delete this listing?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => handleDeleteListing(listingId), style: "destructive" }
            ],
            { cancelable: true }
        );
    };

    const resetForm = () => {
        setProductName('');
        setProductDescription('');
        setPrice('');
        setQuantity('');
        setCurrentListing(null);
        setEditMode(false);
    };

    const openEditModal = (listing: Listing) => {
        setCurrentListing(listing);
        setProductName(listing.name);
        setProductDescription(listing.description);
        setPrice(listing.price.toString());
        setQuantity(listing.quantity.toString());
        setEditMode(true);
        setModalVisible(true);
    };

    const renderListings = (listings: Listing[]) => {
        return listings.map((listing) => (
            <View key={listing.id} style={styles.listingCard}>
                <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.listingImage} />
                <View style={styles.listingInfo}>
                    <Text style={styles.listingTitle}>{listing.name}</Text>
                    <Text style={styles.listingDescription}>Description: {listing.description}</Text>
                    <Text style={styles.listingDetails}>Price: ${listing.price}</Text>
                    <Text style={styles.listingDetails}>Quantity: {listing.quantity}</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(listing)}>
                    <Icon name="edit" size={24} color="#2c5f2d" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteListing(listing.id)}>
                    <Icon name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
        ));
    };

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
                <TouchableOpacity style={styles.listingButton} onPress={() => 
                  { resetForm();
                    setModalVisible(true);
                    }}>
                    <Text style={styles.listingButtonText}>Create Listing</Text>
                </TouchableOpacity>
                {activeTab === 'In Stock' ? renderListings(inStockListings) : renderListings(outOfStockListings)}
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
                        <TouchableOpacity style={styles.updateButton} onPress={editMode ? handleEditListing : handleCreateListing}>
                            <Text style={styles.updateButtonText}>{editMode ? 'Save Changes' : 'Create Listing'}</Text>
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
    position: 'relative',
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
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
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
