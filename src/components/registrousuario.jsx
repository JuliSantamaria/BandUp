import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { credenciales } from "../../credenciales"
import {getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";

const SignUpForm = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      Alert.alert(
        'Registro exitoso',
        'Usuario creado con éxito ✔️. Por favor, verifica tu correo electrónico.',
        [{ text: 'OK' }]
      );

      navigation.navigate('Code'); // Navega a la pantalla para ingresar el código
    } catch (error) {
      console.log("ERROR", error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./../../assets/images/logobandup.png')} style={styles.logo} />
      <Text style={styles.title}>Registrate</Text>
      <Text style={styles.subtitle1}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <Text style={styles.subtitle2}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Password"
        onChangeText={setPassword}
        secureTextEntry
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttontype2} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttontypetext}>Iniciar Sesion</Text>
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

export default SignUpForm;

