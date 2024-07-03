import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../credenciales';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const iconMap = {
  instrumentos: 'musical-notes-outline',
  generos: 'musical-note-outline',
  experiencia: 'school-outline'
};

const TagList = ({ tags, onAddTag, tagType, isExperience }) => {
  return (
    <View style={styles.tagListContainer}>
      <FlatList
        data={tags}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.tagContainer, tags.includes(item) && styles.etiquetaSeleccionada]}>
            <Ionicons 
              name={iconMap[tagType]}
              size={16}
              color={tags.includes(item) ? 'white' : '#d35400'}
            />
            <Text style={[styles.tagText, tags.includes(item) && styles.etiquetaTextSeleccionada]}>{item}</Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.addButton} onPress={onAddTag}>
        <Ionicons
          name={isExperience ? "sync" : "add-circle-outline"}
          size={24}
          color='#d35400'
        />
      </TouchableOpacity>
    </View>
  );
};

const EditarEtiquetas = () => {
  const navigation = useNavigation();
  const [tags, setTags] = useState({
    instrumentos: [],
    generos: [],
    experiencia: []
  });

  useEffect(() => {
    const fetchUserTags = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setTags({
              instrumentos: userData.InstrumentosMusicales || [],
              generos: userData.favoriteGenres || [],
              experiencia: userData.Experiencia || []
            });
          } else {
            console.log('No existe el documento!');
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario: ', error);
      }
    };

    fetchUserTags();
  }, []);

  const handleAddTag = (tagType) => {
    navigation.navigate('AñadirEtiquetas', { 
      tagType, 
      currentTags: tags[tagType],
      onAddTag: newTags => setTags({ ...tags, [tagType]: newTags })
    });
  };

  const handleSaveChanges = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          InstrumentosMusicales: tags.instrumentos,
          favoriteGenres: tags.generos,
          Experiencia: tags.experiencia
        });
        alert('Cambios guardados exitosamente');
      }
    } catch (error) {
      console.error('Error al guardar los cambios: ', error);
      alert('Hubo un error al guardar los cambios. Por favor, intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Etiquetas</Text>
      <Text style={styles.sectionTitle}>Instrumentos:</Text>
      <TagList tags={tags.instrumentos} onAddTag={() => handleAddTag('instrumentos')} tagType="instrumentos" />
      <Text style={styles.sectionTitle}>Géneros Musicales:</Text>
      <TagList tags={tags.generos} onAddTag={() => handleAddTag('generos')} tagType="generos" />
      <Text style={styles.sectionTitle}>Experiencia:</Text>
      <TagList tags={tags.experiencia} onAddTag={() => handleAddTag('experiencia')} tagType="experiencia" isExperience />
      
      {/* Botón Guardar Cambios */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  tagListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tagContainer: {
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
  tagText: {
    color: '#d35400',
    marginLeft: 5,
  },
  etiquetaTextSeleccionada: {
    color: 'white',
  },
  addButton: {
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#d35400',
    borderRadius: 20,
    alignItems: 'center',
  },
};

export default EditarEtiquetas;