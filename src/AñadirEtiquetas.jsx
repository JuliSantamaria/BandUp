import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const etiquetasPredefinidas = {
  instrumentos: ['Guitarra', 'Bajo', 'Piano', 'Batería', 'Flauta', 'Otro'],
  generos: ['Pop', 'Clásica', 'Rock', 'Jazz', 'Techno', 'Metal'],
  experiencia: ['Principiante', 'Amateur', 'Semi-profesional', 'Profesional']
};

const iconMap = {
  instrumentos: 'musical-notes-outline',
  generos: 'musical-note-outline',
  experiencia: 'school-outline'
};

const EtiquetasAnuncios = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentTags, onAddTag } = route.params;

  const [etiquetas, setEtiquetas] = useState(currentTags || {});

  const handleSelectEtiqueta = (tagType, etiqueta) => {
    const updatedEtiquetas = { ...etiquetas };
    if (!updatedEtiquetas[tagType]) {
      updatedEtiquetas[tagType] = [];
    }

    if (updatedEtiquetas[tagType].includes(etiqueta)) {
      updatedEtiquetas[tagType] = updatedEtiquetas[tagType].filter(tag => tag !== etiqueta);
    } else {
      updatedEtiquetas[tagType].push(etiqueta);
    }

    setEtiquetas(updatedEtiquetas);
  };

  const handleSave = () => {
    onAddTag(etiquetas);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Etiquetas</Text>
      {Object.keys(etiquetasPredefinidas).map((tagType, index) => (
        <View key={index}>
          <Text style={styles.sectionTitle}>{tagType.charAt(0).toUpperCase() + tagType.slice(1)}:</Text>
          <View style={styles.etiquetasContainer}>
            {etiquetasPredefinidas[tagType].map((etiqueta, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.etiqueta,
                  etiquetas[tagType]?.includes(etiqueta) && styles.etiquetaSeleccionada,
                ]}
                onPress={() => handleSelectEtiqueta(tagType, etiqueta)}
              >
                <Ionicons
                  name={iconMap[tagType]}
                  size={16}
                  color={etiquetas[tagType]?.includes(etiqueta) ? 'white' : 'tomato'}
                />
                <Text
                  style={[
                    styles.etiquetaText,
                    etiquetas[tagType]?.includes(etiqueta) && styles.etiquetaTextSeleccionada,
                  ]}
                >
                  {etiqueta}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Aceptar</Text>
      </TouchableOpacity>
    </ScrollView>
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

export default EtiquetasAnuncios;