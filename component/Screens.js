import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Button } from 'react-native';

const Stack = createStackNavigator();
  
const Screens = (props) => {
  const navigation = useNavigation();
  
  const goToButtonComponent = () => {
    navigation.navigate('Results', { Number: props.Number });
  };
  
  return (
    <View>
      <Button title="Proceed" onPress={goToButtonComponent} />
    </View>
  );
};

export default Screens;
