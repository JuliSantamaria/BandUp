import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../credenciales'; // Asegúrate de importar correctamente tus credenciales de Firebase

const AnunciosPerfil = ({ userAds, refreshAds }) => {
  const handleDelete = async (anuncioId) => {
    try {
      const anuncioDocRef = doc(db, 'anuncios', anuncioId);
      await deleteDoc(anuncioDocRef);
      Alert.alert('Éxito', 'El anuncio ha sido eliminado correctamente.');
      refreshAds(); // Llama a la función para actualizar la lista de anuncios
    } catch (error) {
      console.error('Error al eliminar el anuncio: ', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el anuncio. Inténtalo de nuevo más tarde.');
    }
  };

  const confirmDelete = (anuncioId) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que quieres eliminar este anuncio?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => handleDelete(anuncioId),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anuncios</Text>
      {userAds && userAds.length > 0 ? (
        <FlatList
          data={userAds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.anuncio}>
              <View style={styles.anuncioHeader}>
                <Text style={styles.anuncioTitulo}>{item.titulo}</Text>
                <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>X</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.anuncioDescripcion}>{item.descripcion}</Text>
              <View style={styles.imagenesContainer}>
                {item.images && item.images.map((imagen, index) => (
                  <Image key={index} source={{ uri: imagen }} style={styles.imagen} />
                ))}
              </View>
              {/* Puedes agregar más campos según tu estructura de datos */}
            </View>
          )}
        />
      ) : (
        <Text>No hay anuncios para mostrar</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  anuncio: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%', // Opcional: ajusta el ancho según tus necesidades
  },
  anuncioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anuncioTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: -16,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 30,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  anuncioDescripcion: {
    fontSize: 14,
  },
  imagenesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  imagen: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});

export default AnunciosPerfil;