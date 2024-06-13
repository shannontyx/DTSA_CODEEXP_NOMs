import React, {useLayoutEffect} from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const categories = [
    { name: 'Western', icon: require('../assets/icons/western.png') },
    { name: 'Greens', icon: require('../assets/icons/greens.png') },
    { name: 'Japanese', icon: require('../assets/icons/japanese.png') },
    { name: 'Pastries', icon: require('../assets/icons/pastries.png') },
    { name: 'Chinese', icon: require('../assets/icons/chinese.png') },
    { name: 'Indian', icon: require('../assets/icons/indian.png') },
    { name: 'Korean', icon: require('../assets/icons/korean.png') },
    { name: 'Halal', icon: require('../assets/icons/halal.png') },
  ];
  const greenVendors = [
    { name: 'Stuffd', image: require('../assets/images/stuffd.png') },
    { name: 'EggTopia', image: require('../assets/images/eggtopia.png') },
    { name: 'Duck', image: require('../assets/images/wafflesia.png') },
  ];
  const pastOrders = [
    { name: 'SaladStop!', image: require('../assets/images/saladstop.png') },
    { name: 'Duck Day', image: require('../assets/images/duck.png') },
    { name: 'Five Fingers', image: require('../assets/images/westagain.png') },
  ];

  const handleSearchBarPress = () => {
    navigation.navigate('AllStores', { autoFocus: true });
  };

  return (
    <View style={styles.container}>
    <ScrollView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.searchBarContainer}>
          <Icon name="search" size={20} color="#000" />
          <TextInput 
            placeholder="Search Store..." 
            style={styles.searchBar} 
            onFocus={handleSearchBarPress} 
          />
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Icon name="user" size={24} color="#000" style={styles.userIcon} />
          </TouchableOpacity>
        </View>
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
        <Text style={styles.sectionTitle}>Go GREEN <Icon name="recycle" size={18} color="green" /></Text>
        <Text style={styles.sectionSubtitle}>
          Order from vendors that support sustainable packaging!
        </Text>
        <Text style={styles.sectionSubtitle2}>
          Bring your own container for Cheaper Prices!
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {greenVendors.map((vendor, index) => (
            <View key={index} style={styles.vendorContainer}>
              <Image source={vendor.image} style={styles.vendorImage} />
              <Text style={styles.vendorText}>{vendor.name} </Text>
            </View>
          ))}
        </ScrollView>
        {/* <TouchableOpacity onPress={() => navigation.navigate('Western')}>
          <Text>Western Stores</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
          <Text>Cart Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CheckoutScreen')}>
          <Text>Checkout Cart Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CustViewOrders')}>
          <Text>Customer View Orders</Text>
        </TouchableOpacity> */}
      </View>
      <View style={styles.sectionContainer}>
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
        
      </View>
      
    </ScrollView>
    <View style={styles.footer}>
    <TouchableOpacity
  style={styles.footerButton}
  // onPress={() => navigation.navigate('Homepage')}
>
  <Icon name="home" size={24} color="#2c5f2d" />
  <Text style={styles.footerButtonText}>Home Page</Text>
</TouchableOpacity>
<TouchableOpacity
  style={styles.footerButton}
  onPress={() => navigation.navigate('ChatScreen')}
>
  <Icon name="podcast" size={24} color="#2c5f2d" />
  <Text style={styles.footerButtonText}>AI Assist</Text>
</TouchableOpacity>
<TouchableOpacity
  style={styles.footerButton}
  onPress={() => navigation.navigate('CustViewOrders')}
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
    padding: 0,
  },
  topContainer: {
    backgroundColor: '#2c5f2d', // Dark green background color for the top part
    paddingBottom: 10, 
    height: 120, // Padding to provide space below the search bar
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Reverted search bar to original color
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20, // Added horizontal margin for spacing
    marginTop: 60, // Added margin top to separate from top container
  },
  searchBar: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000', // Reverted text color to black
  },
  userIcon: {
    marginLeft: 10,
  },
  browseStoresButton: {
    alignItems: 'center',
    marginVertical: 10,
  },
  browseStoresText: {
    color: '#2c5f2d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  category: {
    alignItems: 'center',
    marginBottom: 10,
    width: '22%',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionSubtitle2: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
  vendorContainer: {
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 4,
    marginTop: 8,
  },
  vendorImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  vendorText: {
    fontSize: 14,
    fontWeight: 'bold',
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

export default HomeScreen;
