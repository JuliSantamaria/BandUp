
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
      let q = collection(db, 'anuncios');

      if (searchTerm) {
        const normalizedSearchTerm = searchTerm.toLowerCase();
        q = query(
          q,
          where('titulo', '>=', normalizedSearchTerm),
          where('titulo', '<=', normalizedSearchTerm + '\uf8ff')
        );
      }

      if (location) {
        const formattedLocation = location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
        q = query(
          q,
          where('location', '==', formattedLocation)
        );
      }

      const etiquetasQueries = [];

      Object.keys(selectedEtiquetas).forEach(tagType => {
        selectedEtiquetas[tagType].forEach(tag => {
          etiquetasQueries.push(
            query(q, where(`etiquetas.${tagType}`, 'array-contains', tag))
          );
        });
      });

      if (etiquetasQueries.length === 0 && !searchTerm && !location) {
        q = collection(db, 'anuncios');
      }

      const promises = etiquetasQueries.length > 0 ? etiquetasQueries.map(query => getDocs(query)) : [getDocs(q)];
      const snapshots = await Promise.all(promises);

      const resultadosFiltrados = [];
      const idsVistos = new Set();

      snapshots.forEach(snapshot => {
        snapshot.docs.forEach(doc => {
          const publicacion = doc.data();
          const id = doc.id;
          if (!idsVistos.has(id)) {
            resultadosFiltrados.push(publicacion);
            idsVistos.add(id);
          }
        });
      });

      setResults(resultadosFiltrados);
    } catch (error) {
      console.error('Error al buscar publicaciones:', error);
    }
    setLoading(false);
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setLocation('');
    setSelectedEtiquetas({});
    setResults([]);
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
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>{item.titulo}</Text>
              <Text style={styles.resultText}>{item.descripcion}</Text>
              <Text style={styles.resultText}>{item.location}</Text>
            </View>
          )}
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
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultText: {
    fontSize: 16,
  },
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
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