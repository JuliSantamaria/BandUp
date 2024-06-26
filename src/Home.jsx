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
            <Text style={styles.anuncioTitulo}>{anuncio.titulo}</Text>
            <Text style={styles.anuncioDescripcion}>{anuncio.descripcion}</Text>
            <Text style={styles.anuncioMensaje}>{anuncio.mensaje}</Text>
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
  anunciosContainer: {
    marginTop: 20,
    width: '100%', // Ensure container takes up full width
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Center align the title
  },
  anuncio: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  anuncioTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d55038',
    marginBottom: 5,
  },
  anuncioDescripcion: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  anuncioMensaje: {
    fontSize: 14,
    color: '#777',
  },
});

export default Home;