import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../credenciales';
import { doc, setDoc } from 'firebase/firestore';

const CreateProfile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name,
          surname,
          description,
          location,
          email: user.email, // Almacenar el email del usuario para referencia
        });
        navigation.navigate('GenerosMusicales');
      } catch (error) {
        Alert.alert('Error', 'Hubo un error al guardar tu perfil: ' + error.message);
      }
    } else {
      Alert.alert('No autenticado', 'No se pudo encontrar un usuario autenticado.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logobandup.png')} style={styles.logo} />
      <Text style={styles.title}>Bienvenido a BandUp!</Text>
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
        <Text style={styles.buttonText}>Siguiente</Text>
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
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
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
  },
  button: {
    backgroundColor: '#d55038',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CreateProfile;
