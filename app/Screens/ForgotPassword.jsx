import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (username === '') {
      Alert.alert('Error', 'Por favor ingresa el email correctamente');
      return;
    }

    // Aquí puedes agregar tu lógica de autenticación
    if (username === 'juliansantamaria323@gmail.com') {
      Alert.alert('Éxito', 'Inicio de sesión exitoso');
    } else {
      Alert.alert('Error', 'email incorrecto');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logobandup.png')} style={styles.logo} />
      <Text style={styles.title}>Reset your password</Text>
      <Text>Type your account email and you will receive a code for a new password</Text>
      <Text style={styles.subtitle1}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Send code</Text>
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
  subtitle1: {
      marginBottom:10,
      marginLeft: -300,
  },
  
button: {
  backgroundColor: '#d55038', 
  paddingVertical: 12,
  paddingHorizontal: 32,
  borderRadius: 5,
},
buttonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;