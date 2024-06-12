import { getAuth, signOut } from 'firebase/auth'; // Importa las funciones necesarias de Firebase
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Button, ScrollView } from "react-native";
import obtenerTodosAnuncios from "../backend/anuncio/obtenerTodosAnuncios";
import subirAnuncio from '../backend/anuncio/subirAnuncio';

const Home = ({ navigation }) => {
  const auth = getAuth(); // Obtén la instancia de autenticación
  const [anuncios, setAnuncios] = useState([]); // Estado para almacenar los anuncios
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Cierre de sesión', 'Has cerrado sesión correctamente.');
      navigation.navigate('Login'); // Navega a la pantalla de inicio de sesión después de cerrar sesión
    } catch (error) {
      Alert.alert('❌ Error al cerrar sesión', 'Hubo un problema al intentar cerrar sesión. Inténtelo de nuevo.');
    }
  };
  
  useEffect(() => {
    const fetchAds = async () => {
        obtenerTodos();
    }
    fetchAds();
    }, []);

  

  const obtenerTodos = async () => {
    try {
      const resultados = await obtenerTodosAnuncios();
      setAnuncios(resultados);
      console.log(resultados);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  return (
    
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Button title="Cerrar Sesión" onPress={handleLogout} color="#d55038" />
            <View style={styles.anunciosContainer}>
                <Text style={styles.title}>Obtener todos los anuncios</Text>
                
                {anuncios.map((anuncio) => (
                    <View key={anuncio.id} style={styles.anuncio}>
                        <Text>{anuncio.titulo}</Text>
                        <Text>{anuncio.descripcion}</Text>
                        <Text>{anuncio.mensaje}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    
);
};
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    
  },
  anunciosContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#d55038',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  anuncio: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Home;
