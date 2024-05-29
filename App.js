import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Login from "./src/components/Login"; 
import ForgotPassword from "./src/components/ForgotPassword";
import ResetPassword from './src/components/ResetPassword';
import Home from './src/components/Home';
import Registro from './src/components/registrousuario';
import CreateProfile from './src/components/CrearPerfil';
import verificaremail from './src/components/verificaremail';
import Generosmusicales from './src/components/GenerosMusicales';
import Profile from './src/components/profile';
import Settings from './src/components/settings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{headerShown: false}} />
      <Tab.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
      <Tab.Screen name="Settings" component={Settings} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen 
          name="Forgot" 
          component={ForgotPassword} 
          options={{title: 'forgotpassword', headerShown: false}}  />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPassword} 
          options={{title: 'Reset', headerShown: false}} />
        <Stack.Screen 
          name="Registro" 
          component={Registro} 
          options= {{title: 'Registro', headerShown: false}} />
        <Stack.Screen 
          name="home" 
          component={Home} 
          options={{title: 'home', headerShown: false}} />
        <Stack.Screen 
          name="profile" 
          component={CreateProfile} 
          options={{title: 'profile', headerShown: false}} />
        <Stack.Screen 
          name="verifyemail" 
          component={verificaremail} 
          options={{title: 'verify', headerShown: false}} />
        <Stack.Screen 
          name="GenerosMusicales" 
          component={Generosmusicales} 
          options={{title: 'genres', headerShown: false}} />
        <Stack.Screen 
          name="HomeTabs" 
          component={HomeTabs} 
          options={{ title: 'Home', headerShown: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}