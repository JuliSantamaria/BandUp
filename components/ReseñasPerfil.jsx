import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';
import obtenerInfoDeUsuarioPorId from '../backend/usuario/obtenerInfoDeUsuarioPorId';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { escribirResenia } from '../backend/usuario/escribirResenia';
import { auth } from '../credenciales';

const ReseñasPerfil = ({ reseniasIniciales, navigation, uid }) => {
  const [autores, setAutores] = useState([]);
  const [resenias, setResenias] = useState(reseniasIniciales);
  const [resenia, setResenia] = useState('');
  const [flag, setFlag] = useState(false);

  const handleEscribirResenia = async () => {
    try {
      await escribirResenia(uid, resenia);
      reseniasIniciales.push({ autor: auth.currentUser.uid, message: resenia});
      setResenias(reseniasIniciales);
      setResenia('');
      setFlag(!flag);
    } catch (error) {
      console.error('Error al escribir la reseña:', error);
  };
  };

  const handleObtenerInfoDeAutores = async () => {
    try {
      if (resenias === null) return;
      const autoresResenias = await Promise.all(resenias.map(async resenia => {
      const autor = await obtenerInfoDeUsuarioPorId(resenia.autor);
      return { autor, mensajeResenia: resenia.message, autorId: resenia.autor};
      }));  
      console.log(autoresResenias);
      setAutores(autoresResenias);
    } catch (error) {
      console.error('Error al obtener la información de los autores:', error);
    }
  };

  const verPerfilUsuario = (userId) => {
    navigation.navigate('PerfilAjeno', { usuarioId: userId });
  };

  useEffect(() => {
    handleObtenerInfoDeAutores();
  }, [flag]);

  return (
    <View style={styles.container}>
      {autores.length > 0 ? (
        <FlatList
        data={autores}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.anuncio}>
            <View style={{flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => verPerfilUsuario(item.autorId)}>
                <Image source={{ uri: item.autor.photoURL }} style={styles.usuarioFoto} />
              </TouchableOpacity>
              <View>
                <Text style={styles.usuarioNombre}>{item.autor.name} {item.autor.surname}</Text>
                <Text style={styles.descripcion}>{item.autor.description}</Text>
              </View>
            </View>
            <Text style={styles.mensajeResenia}>{item.mensajeResenia}</Text>
          </View>
        )}
      />) : (
        <Text>No hay reseñas disponibles</Text>
      )}
      {
        uid !== auth.currentUser.uid && (
          <View style={[styles.anuncio, {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}>
        <TextInput
        style={styles.input}
        placeholder="Escribe un comentario"
        value={resenia || ''}
        onChangeText={setResenia}
        />
        <TouchableOpacity style={styles.iconButton} onPress={handleEscribirResenia}>
          <Ionicons name="send" size={24} color="#d35400" />
        </TouchableOpacity>
      </View>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  anuncio: {
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  usuarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  usuarioFoto: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
  },
  userinfo: {
    flex: 1,
    flexDirection: 'column',
  },
  usuarioNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  descripcion: {
    fontSize: 14,
    color: '#777',
  },
  mensajeResenia: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
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
  iconButton: {
    marginRight: 10,
  },
});

export default ReseñasPerfil;