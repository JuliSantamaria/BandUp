import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, db } from '../credenciales';
import { doc, updateDoc } from 'firebase/firestore';

const etiquetasPredefinidas = {
  instrumentos: ['Guitarra', 'Bajo', 'Piano', 'Batería', 'Flauta', 'Otro'],
  generos: ['Pop', 'Classic', 'Rock', 'Jazz', 'Techno', 'Metal'],
  experiencia: ['Principiante', 'Amateur', 'Semi-profesional', 'Profesional']
};

const iconMap = {
  instrumentos: 'musical-notes-outline',
  generos: 'musical-note-outline',
  experiencia: 'school-outline'
};

const AñadirEtiquetas = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tagType, currentTags, onAddTag } = route.params;

  const [etiquetas, setEtiquetas] = useState(currentTags || []);

  const handleSelectEtiqueta = (etiqueta) => {
    if (tagType === 'experiencia') {
      setEtiquetas([etiqueta]);
    } else {
      if (etiquetas.includes(etiqueta)) {
        setEtiquetas(etiquetas.filter(tag => tag !== etiqueta));
      } else {
        setEtiquetas([...etiquetas, etiqueta]);
      }
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { [tagType]: etiquetas });
        if (onAddTag) onAddTag(etiquetas);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error al actualizar las etiquetas del usuario: ', error);
      Alert.alert('Error', 'Hubo un problema al actualizar las etiquetas. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      onAddTag: (newTags) => {
        console.log('Etiquetas añadidas:', newTags);
      }
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar {tagType.charAt(0).toUpperCase() + tagType.slice(1)}</Text>
      <View style={styles.etiquetasContainer}>
        {etiquetasPredefinidas[tagType].map((etiqueta, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.etiqueta, etiquetas.includes(etiqueta) && styles.etiquetaSeleccionada]}
            onPress={() => handleSelectEtiqueta(etiqueta)}
          >
            <Ionicons 
              name={iconMap[tagType]} 
              size={16} 
              color={etiquetas.includes(etiqueta) ? 'white' : 'tomato'} 
            />
            <Text style={[styles.etiquetaText, etiquetas.includes(etiqueta) && styles.etiquetaTextSeleccionada]}>
              {etiqueta}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Aceptar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    borderColor: 'tomato',
  },
  etiquetaSeleccionada: {
    backgroundColor: 'tomato',
  },
  etiquetaText: {
    color: 'tomato',
    marginLeft: 5,
  },
  etiquetaTextSeleccionada: {
    color: 'white',
  },
  saveButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'tomato',
    borderRadius: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AñadirEtiquetas;
