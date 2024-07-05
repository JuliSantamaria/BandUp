import { getAuth, signOut } from 'firebase/auth';
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput, Image, Dimensions, RefreshControl } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import obtenerTodosAnuncios from "../backend/anuncio/obtenerTodosAnuncios";
import darLike from "../backend/anuncio/darLike";
import comentarAnuncio from "../backend/anuncio/comentarAnuncio";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../credenciales.js";

const Home = ({ navigation }) => {
  const auth = getAuth();
  const [anuncios, setAnuncios] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [refreshing, setRefreshing] = useState(false); // Estado para controlar el refresh

  const onRefresh = () => {
    setRefreshing(true);
    obtenerTodos().finally(() => setRefreshing(false));
  };

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
    obtenerTodos();
  }, []);

  const obtenerTodos = async () => {
    try {
      const resultados = await obtenerTodosAnuncios();
      const anunciosConUsuarios = await Promise.all(resultados.map(async (anuncio) => {
        const usuario = await obtenerUsuario(anuncio.userId);
        return { ...anuncio, usuario };
      }));
      setAnuncios(anunciosConUsuarios);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const obtenerUsuario = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log('No existe el usuario con ID:', userId);
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  };

  const handleLike = async (id) => {
    try {
      await darLike(id);
      obtenerTodos(); // Actualizar la lista de anuncios
    } catch (error) {
      console.error('Error al añadir like', error);
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
        console.error('Error al añadir comentario:', error);

        setComentarios({ ...comentarios, [id]: '' });
        obtenerTodos(); 
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.anunciosContainer}>
        {anuncios.map((anuncio) => (
          <View key={anuncio.id} style={styles.anuncio}>
            {anuncio.usuario && (
              <View style={styles.usuarioContainer}>
                <Image
                  style={styles.usuarioFoto}
                  source={{ uri: anuncio.usuario.photoURL }}
                />
                <View style={styles.userinfo}>
                  <Text style={styles.usuarioNombre}>{anuncio.usuario.name} {anuncio.usuario.surname}</Text>
                  <Text style={styles.descripcion}>{anuncio.usuario.description}</Text>
                </View>
              </View>
            )}
            <Text style={styles.anuncioTitulo}>{anuncio.titulo}</Text>
            {anuncio.images && anuncio.images.length > 0 && (
              <Image
                style={styles.imagenAnuncio}
                source={{ uri: anuncio.images[0] }}
                resizeMode="cover"
              />
            )}
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
    backgroundColor: '#f4f2ee',
  },
  anunciosContainer: {
    paddingTop: 10,
  },
  anuncio: {
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  usuarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  usuarioFoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userinfo: {
    flex: 1,
    flexDirection: 'column',
  },
  usuarioNombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descripcion: {
    fontSize: 14,
    color: '#777',
  },
  anuncioTitulo: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  imagenAnuncio: {
    width: '100%',
    aspectRatio: 16/9, // Relación de aspecto estándar, puedes ajustarla según tus necesidades
    borderRadius: 10,
    marginBottom: 10,
  },
  anuncioDescripcion: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  anuncioMensaje: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  likeCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  iconButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  commentButton: {
    backgroundColor: '#d35400',
    padding: 10,
    borderRadius: 5,
  },
  commentButtonText: {
    color: 'white',
  },
});

export default Home;
