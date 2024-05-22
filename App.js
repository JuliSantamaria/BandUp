import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./src/components/Home"; 
import ForgotPassword from "./src/components/ForgotPassword";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="Forgot" component={ForgotPassword} options={{title: 'forgotpassword', headerShown: false}}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}