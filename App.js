import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./src/components/Login"; 
import ForgotPassword from "./src/components/ForgotPassword";
import Code from "./src/components/Code";
import ResetPassword from './src/components/ResetPassword';
import Home from './src/components/Home';
import Registro from './src/components/registrousuario';
import CreateProfile from './src/components/CrearPerfil';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="Forgot" component={ForgotPassword} options={{title: 'forgotpassword', headerShown: false}}  />
        <Stack.Screen name="Code" component={Code} options={{title: 'code', headerShown:false}} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{title: 'Reset', headerShown: false}} />
        <Stack.Screen name="Registro" component={Registro} options= {{title: 'Registro', headerShown: false}} />
        <Stack.Screen name="home" component={Home} options={{title: 'home', headerShown: false}} />
        <Stack.Screen name="profile" component={CreateProfile} options={{title: 'profile', headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}