import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './loginScreen';
import AllStores from './AllStores';
import Western from './Western';
import CartScreen from './CartScreen'; // Import the CartScreen
import CheckoutScreen from './CheckoutScreen';
import CreateStore from './CreateStore';
import ManageStore from './ManageStore';
import ViewStore from './(tabs)/ViewStore';
import viewReviews from './viewReviews';
import StoreDetailsPage from './StoreDetailsPage';
import ManageListing from './ManageListing';
import StoresCategories from './StoresCategories';
import CustViewOrders from './CustViewOrders';
import HomeScreen from './index';
import HomePage from './Homepage'
import VendorHomepage from './VendorHomepage';
import ChatScreen from './ChatScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="VendorHomePage" component={VendorHomepage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AllStores" component={AllStores} />
        <Stack.Screen name="Western" component={Western} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
        <Stack.Screen name="CreateStore" component={CreateStore} />
        <Stack.Screen name="ManageStore" component={ManageStore} />
        <Stack.Screen name="ViewStore" component={ViewStore} />
        <Stack.Screen name="viewReviews" component={viewReviews} />
        <Stack.Screen name="StoreDetailsPage" component={StoreDetailsPage} />
        <Stack.Screen name="StoresCategories" component={StoresCategories} />
        <Stack.Screen name="ManageListing" component={ManageListing} />
        <Stack.Screen name="CustViewOrders" component={CustViewOrders} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
