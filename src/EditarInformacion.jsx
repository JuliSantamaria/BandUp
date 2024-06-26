import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../credenciales';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditarInformacion = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name);
          setSurname(userData.surname);
          setDescription(userData.description);
          setLocation(userData.location);
        } else {
          Alert.alert('Error', 'No se encontraron datos de perfil.');
        }
      } else {
        Alert.alert('No autenticado', 'No se pudo encontrar un usuario autenticado.');
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveProfile = async () => {
    // Validación de los campos
    if (!name.trim() || !surname.trim() || !description.trim() || !location.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          name,
          surname,
          description,
          location,
        });
        Alert.alert('Éxito', 'Tu perfil ha sido actualizado correctamente.');
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', 'Hubo un error al actualizar tu perfil: ' + error.message);
      }
    } else {
      Alert.alert('No autenticado', 'No se pudo encontrar un usuario autenticado.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logobandup.png')} style={styles.logo} />
      <Text style={styles.title}>Editar Información del Perfil</Text>
      <Text style={styles.subtitle}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu nombre"
        onChangeText={setName}
        value={name}
      />
      <Text style={styles.subtitle}>Apellido</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu apellido"
        onChangeText={setSurname}
        value={surname}
      />
      <Text style={styles.subtitle}>Descripción</Text>
      <TextInput
        style={styles.input}
        placeholder="Breve descripción"
        onChangeText={setDescription}
        value={description}
      />
      <Text style={styles.subtitle}>Ubicación</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu ubicación"
        onChangeText={setLocation}
        value={location}
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#d55038',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EditarInformacion;