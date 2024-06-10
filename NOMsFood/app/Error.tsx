// ErrorScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<any>; // Define the type for navigation prop
};

const ErrorScreen: React.FC<Props> = ({ navigation }) => {
  const handleGoHome = () => {
    navigation.navigate('Home'); // Navigate to the home screen
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Oops! The requested page was not found.</Text>
      <Button title="Go to Home" onPress={handleGoHome} />
    </View>
  );
};

export default ErrorScreen;
