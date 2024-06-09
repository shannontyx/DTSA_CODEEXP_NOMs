import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './(tabs)/loginScreen';
import HomeScreen from './(tabs)/homepage';
import AllStores from './AllStores';
import Western from './Western';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AllStores" component={AllStores} />
        <Stack.Screen name="Western" component={Western} />      
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;