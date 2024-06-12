import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const categories = [
    { name: 'Western', icon: require('../../assets/icons/western.png') },
    { name: 'Greens', icon: require('../../assets/icons/greens.png') },
    { name: 'Japanese', icon: require('../../assets/icons/japanese.png') },
    { name: 'Pastries', icon: require('../../assets/icons/pastries.png') },
    { name: 'Chinese', icon: require('../../assets/icons/chinese.png') },
    { name: 'Indian', icon: require('../../assets/icons/indian.png') },
    { name: 'Korean', icon: require('../../assets/icons/korean.png') },
    { name: 'Halal', icon: require('../../assets/icons/halal.png') },
  ];
  const greenVendors = [
    { name: 'Stuffd', image: require('../../assets/images/stuffd.jpg') },
    { name: 'EggTopia', image: require('../../assets/images/eggtopia.png') },
    { name: 'Wafflesia', image: require('../../assets/images/wafflesia.png') },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={20} color="#000" />
        <TextInput placeholder="Search Store..." style={styles.searchBar} />
      </View>
      <TouchableOpacity 
        style={styles.browseStoresButton} 
        onPress={() => navigation.navigate('AllStores')}>
        <Text style={styles.browseStoresText}>Browse All Stores</Text>
      </TouchableOpacity>
      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.category} onPress={() => navigation.navigate('StoresCategories', { category: category.name })}>
            <Image source={category.icon} style={styles.categoryIcon} />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Go GREEN</Text>
        <Text style={styles.sectionSubtitle}>
          Order from vendors that support sustainable packaging!
        </Text>
        <Text style={styles.sectionSubtitle}>
          Bring your own container for Cheaper Prices!
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {greenVendors.map((vendor, index) => (
            <View key={index} style={styles.vendorContainer}>
              <Image source={vendor.image} style={styles.vendorImage} />
              <Text style={styles.vendorText}>{vendor.name}</Text>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate('Western')}>
          <Text>Western Stores</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
          <Text>Cart Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CheckoutScreen')}>
          <Text>Checkout Cart Screen</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Order Again</Text>
        <Text style={styles.sectionSubtitle}>Order from your past orders</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {pastOrders.map((order, index) => (
            <View key={index} style={styles.vendorContainer}>
              <Image source={order.image} style={styles.vendorImage} />
              <Text style={styles.vendorText}>{order.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginTop: 50,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  browseStoresButton: {
    alignItems: 'center',
    marginVertical: 10,
  },
  browseStoresText: {
    color: '#007BFF',
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  category: {
    alignItems: 'center',
    marginBottom: 10,
    width: '22%',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  vendorContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  vendorImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  vendorText: {
    fontSize: 14,
  },
});

export default HomeScreen;
