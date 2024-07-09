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
  const [UserName, setUserName] = useState(null);
  const [Surname, setSurname] = useState(null);
  const [images, setimages] = useState(null);

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
            setUserName(userSnap.data().UserName);
            setSurname(userSnap.data().Surname);
            setimages(userSnap.data().images);

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
            const imagen = await getDoc(doc(db, 'anuncios'));
            const userDoc = await getDoc(doc(db, 'users', anuncioData.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              resultsSet.add({
                ...anuncioData,
                userName: userData.name,
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
      <View style={styles.userInfoContainer}>
        {item.userPhotoURL && <Image source={{ uri: item.userPhotoURL }} style={styles.userPhoto} />}
        <View style={styles.userNameContainer}>
          <Text style={styles.userName}>{item.userName} {item.userLastName}</Text>
        </View>
      </View>
      <Image source={{ uri: item.imagenURL }} style={styles.anuncioImage} />
      <View style={styles.anuncioContent}>
        <Text style={styles.anuncioTitulo}>{item.titulo}</Text>
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
    backgroundColor: '#d35400',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d35400',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  etiquetasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  etiquetaSeleccionada: {
    backgroundColor: 'tomato',
  },
  etiquetaText: {
    marginLeft: 5,
    color: 'tomato',
  },
  etiquetaTextSeleccionada: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#d35400',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  anuncioContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userNameContainer: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  anuncioImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  anuncioContent: {
    flexDirection: 'column',
  },
  anuncioTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  anuncioDescripcion: {
    fontSize: 14,
    marginBottom: 5,
  },
  anuncioLocation: {
    fontSize: 12,
    color: 'gray',
  },
});

export default Busqueda;
