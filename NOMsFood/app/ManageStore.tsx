import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ManageStore = () => {
  const navigation = useNavigation();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const auth = getAuth();
        const activeUser = auth.currentUser;
        if (activeUser) {
          const userQuerySnapshot = await getDocs(
            query(collection(db, 'Users'), where('userId', '==', activeUser.uid))
          );
          const activeStoreId = userQuerySnapshot.docs[0].data().storeId;

          const storesRef = collection(db, 'Stores');
          const storeQuerySnapshot = await getDocs(query(storesRef, where('__name__', '==', activeStoreId)));
          const storeData = storeQuerySnapshot.docs[0].data();
          setStore(storeData);
        }
      } catch (error) {
        console.error("Error fetching store data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!store) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No store found for the current user.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Store: {store.name}</Text>
      </View>
      <Image source={require('../assets/icons/westt.jpg')} style={styles.storeImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Store Name:</Text>
        <Text style={styles.value}>{store.name}</Text>
        
        <Text style={styles.label}>Store Description:</Text>
        <Text style={styles.value}>{store.description}</Text>
        
        <Text style={styles.label}>Contact Details:</Text>
        <Text style={styles.value}>{store.contact}</Text>
        
        <Text style={styles.label}>Opening Time:</Text>
        <Text style={styles.value}>{store.opening}</Text>
        
        <Text style={styles.label}>Closing Time:</Text>
        <Text style={styles.value}>{store.closing}</Text>
        
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{store.location}</Text>
        
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{store.category}</Text>
        
        <Text style={styles.label}>Be part of Go Green?</Text>
        {store.isGreen ? (
          <View style={styles.greenContainer}>
          
          <View>
          <Text style={styles.value}>Allowing Bring Your Own Container</Text>
          <View>
          <Icon name="recycle" size={20} color="#10390A" style={styles.icon} />

            <Text style={styles.greenText}>
              Thank you for being a part of Go GREEN, Your part matters.
            </Text>
            
          </View>
          </View>
          
        </View>
        ) : (
          <Text style={styles.value}>Not allowing Bring Your Own Container</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={() => navigation.navigate('EditStore')} color="#10390A" />
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
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#10390A',
    marginBottom: 15,
  },
  storeImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  infoContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#10390A',
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
  },
  greenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 5,
  },
  greenText: {
    fontSize: 16,
    color: '#10390A',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    color: '#10390A'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ManageStore;
