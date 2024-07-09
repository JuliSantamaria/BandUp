import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, Button } from 'react-native';
import { obtenerImagenes } from '../backend/anuncio/obtenerImagenes';
import { auth } from '../credenciales';
const FotosVideosPerfil = ( {uid} ) => {
  console.log(uid)
  console.log(auth.currentUser.uid)
  const [imagenes, setImagenes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  
  const handleImagenes = () => {
    obtenerImagenes(uid).then((imagenes) => {
      setImagenes(imagenes);
      console.log('Imágenes:', imagenes);
    }).catch((error) => {
      console.error('Error al obtener las imágenes:', error);
    });
  };

  useEffect(() => {
    handleImagenes();
  }, []);

  const openImageModal = (image) => {
    setCurrentImage(image);
    setIsModalVisible(true);
  };

  const closeImageModal = () => {
    setCurrentImage(null);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={imagenes}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openImageModal(item)}>
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
      />
      {currentImage && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          onRequestClose={closeImageModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: currentImage }} style={styles.modalImage} />
              <Button title="Cerrar" onPress={closeImageModal} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export default FotosVideosPerfil;