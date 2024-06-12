import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const VendorHomepage = () => {

  const navigation = useNavigation();

  const handleIconPress = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/noms2.png')} style={styles.logo} />
        <Icon name="user" size={24} color="#000" style={styles.userIcon} onPress={handleIconPress}/>
      </View>
      <Text style={styles.greeting}>Good Day VendorName,</Text>
      <Text style={styles.subGreeting}>What would you like to do today?</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('ManageStore')}>
          <Icon name="home" size={40} color="#6B8E23" />
          <Text style={styles.buttonText}>Manage Store</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManageListing')}>
          <Icon name="cutlery" size={40} color="#6B8E23" />
          <Text style={styles.buttonText}>Manage Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('viewReviews')}>
          <Icon name="star" size={40} color="#6B8E23" />
          <Text style={styles.buttonText}>View Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="shopping-cart" size={40} color="#6B8E23" />
          <Text style={styles.buttonText}>View Orders</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.greenSection}>
        <Image source={require('../../assets/images/gogreen.jpg')} style={styles.greenImage} />
        <View style={styles.greenTextContainer}>
          <Text style={styles.greenTitle}>Go GREEN</Text>
          <Text style={styles.greenSubtitle}>
            Join the Go Green Initiative with other 123 Vendors! Do your part to STOP Global Warming!
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade your store</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 0,
    position: 'relative',
  },
  logo: {
    width: 170,
    height: 80,
    resizeMode: 'contain',
  },
  userIcon: {
    position: 'absolute',
    right: 0,
    top: 30,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '45%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  greenSection: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  greenImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  greenTextContainer: {
    padding: 20,
  },
  greenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  greenSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  upgradeButton: {
    backgroundColor: '#6B8E23',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default VendorHomepage;
