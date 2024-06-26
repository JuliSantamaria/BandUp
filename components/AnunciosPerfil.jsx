import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const AnunciosPerfil = ({ userAds }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anuncios</Text>
      {userAds && userAds.length > 0 ? (
        <FlatList
          data={userAds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.anuncio}>
              <Text style={styles.anuncioTitulo}>{item.titulo}</Text>
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
  anuncioTitulo: {
    fontSize: 18,
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