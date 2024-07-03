import React, { useState, useEffect } from 'react';
import { auth } from './credenciales';
import { Image, TouchableOpacity, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Login from "./src/Login"; 
import ForgotPassword from "./src/ForgotPassword";
import ResetPassword from './src/ResetPassword';
import Home from './src/Home';
import Registro from './src/registrousuario';
import CreateProfile from './src/CrearPerfil';
import Generosmusicales from './src/GenerosMusicales';
import Profile from './src/profile';
import busqueda from './src/busqueda';
import publicar from './src/publicar';
import instrumentosmusicales from './src/Instrumentos';
import experiencia from './src/Experiencia';
import BarraMenu from './src/BarraMenu';
import Configuraciones from './src/Configuraciones';
import Premium from './src/Premium';
import EditarInformacion from './src/EditarInformacion';
import EditarEtiquetas from './src/EditarEtiquetas';
import AñadirEtiquetas from './src/AñanirEtiquetas';
import Notificaciones from './src/Notificaciones';
import Chat from './components/Chat';
import ChatScreen from './src/Chats';

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
          } else if (route.name === 'busqueda') {
            iconName = 'search-outline';
          } else if (route.name === 'publicar') {
            iconName = 'add-circle-outline';
          } else if (route.name === 'Chats') {
            iconName = 'chatbox-ellipses-outline';
          } else if (route.name === 'Perfil') {
            iconName = 'person';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: 'flex' },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{headerShown: false}} />
      <Tab.Screen name="busqueda" component={busqueda} options={{headerShown: false}} />
      <Tab.Screen name="publicar" component={publicar} options={{headerShown: false}} />
      <Tab.Screen name="Chats" component={ChatScreen} options={{headerShown: false}} />
      <Tab.Screen name="Perfil" component={Profile} options={{headerShown: false}} />
    </Tab.Navigator>
  );
}

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen 
          name="Registro" 
          component={Registro} 
          options={{ title: 'Registro', headerShown: false }} />
        <Stack.Screen 
          name="Forgot" 
          component={ForgotPassword} 
          options={{ title: 'forgotpassword', headerShown: false }} />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPassword} 
          options={{ title: 'Reset', headerShown: false }} />
      </Stack.Navigator>
    );
  }

  return (
    <>
      <Stack.Navigator initialRouteName="HomeTabs">
        <Stack.Screen 
          name="profile" 
          component={CreateProfile} 
          options={{ title: 'profile', headerShown: false }} />
        <Stack.Screen 
          name="GenerosMusicales" 
          component={Generosmusicales} 
          options={{ title: 'genres', headerShown: false }} />
        <Stack.Screen
          name="InstrumentosMusicales"
          component={instrumentosmusicales}
          options={{ title: 'instrumentos', headerShown: false }} />
        <Stack.Screen
          name="Experiencia"
          component={experiencia}
          options={{ title: 'experiencia', headerShown: false }} />
        <Stack.Screen 
          name="HomeTabs" 
          component={HomeTabs} 
          options={{
            title: '',
            headerLeft: () => (
              <Image 
                source={require('./assets/images/logobandup.png')}
                style={{ width: 50, height: 50 }}
              />
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Ionicons name="notifications-outline" size={25} style={{ marginRight: 15, color: modalVisible ? 'orange' : 'black' }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
                  <Ionicons name="menu-outline" size={25} color={menuOpen ? 'tomato' : 'black'} />
                </TouchableOpacity>
              </View>
            ),
          }} 
        />
        <Stack.Screen 
          name="Chat" 
          component={Chat} 
          options={{ title: 'Chat' }} />
        <Stack.Screen 
          name="Configuraciones" 
          component={Configuraciones} 
          options={{ title: 'Configuraciones', headerShown: true }} />
        <Stack.Screen 
          name="Premium" 
          component={Premium} 
          options={{ title: 'Premium', headerShown: true }} />
        <Stack.Screen 
          name="EditarInformacion" 
          component={EditarInformacion} 
          options={{ title: 'Editar Informacion', headerShown: true }} />
        
        <Stack.Screen 
          name="EditarEtiquetas" 
          component={EditarEtiquetas} 
          options={{ title: 'Editar Etiquetas', headerShown: true }} />
        <Stack.Screen 
          name="AñadirEtiquetas" 
          component={AñadirEtiquetas} 
          options={{ title: 'Añadir Etiquetas', headerShown: true }} />
      </Stack.Navigator>
      <Notificaciones visible={modalVisible} onClose={() => setModalVisible(false)} />
      <BarraMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
};
