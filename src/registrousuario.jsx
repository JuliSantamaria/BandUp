import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../credenciales';

const Registrarse = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    return password.length >= minLength && hasNumber.test(password) && hasSpecialChar.test(password);
  };

  const handleSignUp = async () => {
    if (!validateEmail(email)) {
      Alert.alert('❌ Email inválido', 'Por favor, introduce un email válido.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('❌ Contraseña inválida', 'La contraseña debe tener al menos 6 caracteres, incluir un número y un carácter especial.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user, {
        handleCodeInApp: true,
        url: 'https://bandupbdd.firebaseapp.com',
      });

      navigation.navigate('profile');
    } catch (error) {
      Alert.alert('❌ Error en el registro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logobandup.png')} style={styles.logo} />
      <Text style={styles.title}>Regístrate</Text>
      <Text style={styles.subtitle1}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <Text style={styles.subtitle2}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu contraseña"
        onChangeText={setPassword}
        secureTextEntry
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttontype2} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttontypetext}>Iniciar Sesión</Text>
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
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  subtitle2: {
    marginBottom: 10,
    alignSelf: 'flex-start',
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
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttontype2: {
    marginTop: 20,
  },
  buttontypetext: {
    color: '#d55038',
    fontSize: 14,
  },
});

export default Registrarse;
