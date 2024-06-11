import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './(tabs)/loginScreen';
import HomeScreen from './(tabs)/homepage';
import AllStores from './AllStores';
import Western from './Western';
import CartScreen from './CartScreen'; // Import the CartScreen
import CheckoutScreen from './CheckoutScreen';
import CreateStore from './CreateStore';
import ManageStore from './ManageStore';
import ViewStore from './(tabs)/ViewStore';
<<<<<<< HEAD
import viewReviews from './(tabs)/viewReviews';
=======
import StoreDetailsPage from './StoreDetailsPage';
>>>>>>> origin/origin/eunice

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
