import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Index from './(tabs)/index';
import Homepage from './(tabs)/homepage'
// import Screen2 from './Screen2';

const Tab = createBottomTabNavigator();

const BottomFoot: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Homepage} />
      {/* <Tab.Screen name="Screen2" component={Screen2} /> */}
    </Tab.Navigator>
  );
};

export default BottomFoot;
