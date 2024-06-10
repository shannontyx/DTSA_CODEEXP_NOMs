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
import BottomFoot from './BottomFoot';
import Error from './Error';

type RootStackParamList = {
  Home: undefined;
  Error: undefined; // Add Error route to the stack param list
  Login: undefined;
  AllStores: undefined;
  Western: undefined;
  CartScreen: undefined;
  CheckoutScreen: undefined;
  CreateStore:undefined;
  ManageStore: undefined;
  ViewStore: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Error" component={Error} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AllStores" component={AllStores} />
        <Stack.Screen name="Western" component={Western} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
        <Stack.Screen name="CreateStore" component={CreateStore} />
        <Stack.Screen name="ManageStore" component={ManageStore} />
        <Stack.Screen name="ViewStore" component={ViewStore} />
      </Stack.Navigator>
      <BottomFoot />
    </NavigationContainer>
  );
};

export default AppNavigator;
