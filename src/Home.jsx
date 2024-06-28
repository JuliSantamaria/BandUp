import { getAuth, signOut } from 'firebase/auth';
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Button, ScrollView, TextInput } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import obtenerTodosAnuncios from "../backend/anuncio/obtenerTodosAnuncios";
import darLike from "../backend/anuncio/darLike";
import comentarAnuncio from "../backend/anuncio/comentarAnuncio";


const Home = ({ navigation }) => {
  const auth = getAuth();
  const [anuncios, setAnuncios] = useState([]);
  const [comentarios, setComentarios] = useState({});

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Cierre de sesión', 'Has cerrado sesión correctamente.');
      navigation.navigate('Login');
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

  const handleLike = async (id) => {
    try {
      await darLike(id);
      obtenerTodos(); // Actualizar la lista de anuncios
    } catch (error) {
      console.error('Error adding like:', error);
    }
  };

  const handleComment = async (id) => {
    const comentario = comentarios[id];
    if (comentario) {
      try {
        await comentarAnuncio(id, { texto: comentario, fecha: new Date() });
        setComentarios({ ...comentarios, [id]: '' }); // Limpiar el campo de comentario
        obtenerTodos(); // Actualizar la lista de anuncios
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Button title="Cerrar Sesión" onPress={handleLogout} color="#d35400" />
      <View style={styles.anunciosContainer}>
        <Text style={styles.title}>Obtener todos los anuncios</Text>
        {anuncios.map((anuncio) => (
          <View key={anuncio.id} style={styles.anuncio}>
            <Text style={styles.anuncioTitulo}>{anuncio.titulo}</Text>
            <Text style={styles.anuncioDescripcion}>{anuncio.descripcion}</Text>
            <Text style={styles.anuncioMensaje}>{anuncio.mensaje}</Text>
            <View style={styles.likeCommentContainer}>
              <TouchableOpacity style={styles.iconButton} onPress={() => handleLike(anuncio.id)}>
                <Ionicons name="heart-outline" size={24} color="#d35400" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Escribe un comentario"
                value={comentarios[anuncio.id] || ''}
                onChangeText={(text) => setComentarios({ ...comentarios, [anuncio.id]: text })}
              />
              <TouchableOpacity style={styles.commentButton} onPress={() => handleComment(anuncio.id)}>
                <Text style={styles.commentButtonText}>Comentar</Text>
              </TouchableOpacity>
            </View>
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
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
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
    color: '#d35400',
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
  likeCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  commentButton: {
    backgroundColor: '#d35400',
    padding: 10,
    borderRadius: 5,
  },
  commentButtonText: {
    color: 'white',
  }
});

export default Home;