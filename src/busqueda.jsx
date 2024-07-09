import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../credenciales';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const etiquetasPredefinidas = {
  instrumentos: ['Guitarra', 'Bajo', 'Piano', 'Batería', 'Flauta', 'Otro'],
  generos: ['Pop', 'Clásica', 'Rock', 'Jazz', 'Techno', 'Metal'],
  experiencia: ['Principiante', 'Amateur', 'Semi-profesional', 'Profesional']
};

const Busqueda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState({});
  const [location, setLocation] = useState('');
  const [photoURL, setPhotoURL] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDoc);
          if (userSnap.exists()) {
            setPhotoURL(userSnap.data().photoURL);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error al obtener la foto de perfil:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const anunciosRef = collection(db, 'anuncios');
      const filters = [];

      if (searchTerm) {
        const normalizedSearchTerm = searchTerm.toLowerCase();
        filters.push(where('titulo', '>=', normalizedSearchTerm));
        filters.push(where('titulo', '<=', normalizedSearchTerm + '\uf8ff'));
      }

      if (location) {
        const formattedLocation = location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
        filters.push(where('location', '>=', formattedLocation));
        filters.push(where('location', '<=', formattedLocation + '\uf8ff'));
      }

      const selectedKeys = Object.keys(selectedEtiquetas);
      let resultsSet = new Set();

      for (const key of selectedKeys) {
        for (const tag of selectedEtiquetas[key]) {
          const q = query(anunciosRef, ...filters, where(`etiquetas.${key}`, 'array-contains', tag));
          const querySnapshot = await getDocs(q);
          for (const docSnap of querySnapshot.docs) {
            const anuncioData = docSnap.data();
            const userDoc = await getDoc(doc(db, 'users', anuncioData.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              resultsSet.add({
                ...anuncioData,
                userName: userData.name,
                description: userData.description,
                userLastName: userData.surname,
                userPhotoURL: userData.photoURL,
              });
            }
          }
        }
      }

      setResults(Array.from(resultsSet));
    } catch (error) {
      console.error('Error al buscar publicaciones:', error);
    }
    setLoading(false);
  };

  const handleSelectEtiqueta = (tagType, etiqueta) => {
    const updatedEtiquetas = { ...selectedEtiquetas };
    if (!updatedEtiquetas[tagType]) {
      updatedEtiquetas[tagType] = [];
    }

    if (updatedEtiquetas[tagType].includes(etiqueta)) {
      updatedEtiquetas[tagType] = updatedEtiquetas[tagType].filter(tag => tag !== etiqueta);
    } else {
      updatedEtiquetas[tagType].push(etiqueta);
    }

    setSelectedEtiquetas(updatedEtiquetas);
  };

  const renderAnuncio = ({ item }) => (
    <View style={styles.anuncioContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
        {console.log(item)}
        {item.userPhotoURL && <Image source={{ uri: item.userPhotoURL }} style={styles.userPhoto} />}
        <View>
          <Text style={styles.userName}>{item.userName} {item.userLastName}</Text>
          <Text style={{fontSize: 12, color: 'gray'}}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.anuncioContent}>
        <Text style={styles.anuncioTitulo}>{item.titulo}</Text>
        {item.images && item.images.length > 0 && item.images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.anuncioImage} />
        ))}
        <Text style={styles.anuncioDescripcion}>{item.descripcion}</Text>
        <Text style={styles.anuncioLocation}>{item.location}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar publicaciones..."
            value={searchTerm}
            onChangeText={text => setSearchTerm(text)}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchIcon} activeOpacity={0.7}>
            <Ionicons name="search" size={20} color="#d35400" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterIcon}>
          <Ionicons name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderAnuncio}
        />
      )}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.title}>Filtrar por Etiquetas y Ubicación</Text>
          <TextInput
            style={styles.input}
            placeholder="Ubicación"
            value={location}
            onChangeText={text => setLocation(text)}
          />
          {Object.keys(etiquetasPredefinidas).map((tagType, index) => (
            <View key={index}>
              <Text style={styles.sectionTitle}>{tagType.charAt(0).toUpperCase() + tagType.slice(1)}:</Text>
              <View style={styles.etiquetasContainer}>
                {etiquetasPredefinidas[tagType].map((etiqueta, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.etiqueta,
                      selectedEtiquetas[tagType]?.includes(etiqueta) && styles.etiquetaSeleccionada,
                    ]}
                    onPress={() => handleSelectEtiqueta(tagType, etiqueta)}
                  >
                    <Ionicons
                      name="pricetag"
                      size={16}
                      color={selectedEtiquetas[tagType]?.includes(etiqueta) ? 'white' : 'tomato'}
                    />
                    <Text
                      style={[
                        styles.etiquetaText,
                        selectedEtiquetas[tagType]?.includes(etiqueta) && styles.etiquetaTextSeleccionada,
                      ]}
                    >
                      {etiqueta}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              setModalVisible(false);
              handleSearch();
            }}
          >
            <Text style={styles.saveButtonText}>Aceptar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderColor: '#d35400',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#eff3f4',
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  searchIcon: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  filterIcon: {
    height: 40,
    width: 40,
    backgroundColor: '#d35400',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
  },
  anuncioContainer: {
    flexDirection: 'colums',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  anuncioImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 15,
  },
  anuncioContent: {
    flex: 1,
    marginLeft: 10,
  },
  anuncioTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  anuncioDescripcion: {
    fontSize: 16,
    marginBottom: 5,
  },
  anuncioLocation: {
    fontSize: 14,
    color: '#777',
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#d35400',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  etiquetasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: '#d35400',
  },
  etiquetaSeleccionada: {
    backgroundColor: '#d35400',
  },
  etiquetaText: {
    color: '#d35400',
    marginLeft: 5,
  },
  etiquetaTextSeleccionada: {
    color: 'white',
  },
  saveButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#d35400',
    borderRadius: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Busqueda;
