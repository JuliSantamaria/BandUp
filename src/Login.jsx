import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import  { auth }  from '../credenciales';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logueo = async () => {
    try {
      console.log(`Attempting to log in with email: ${email} and password: ${password}`);
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Iniciando sesión', 'Accediendo...');
      navigation.navigate('HomeTabs');
    } catch (error) {
      Alert.alert('❌ Error de inicio de sesión', 'Usuario o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logobandup.png')} style={styles.logo} />
      <Text style={styles.title}>Bienvenido a BandUp!</Text>
      <Text style={styles.subtitle1}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu email"
        onChangeText={(email) => setEmail(email)}
        value={email}
      />
      <Text style={styles.subtitle2}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu contraseña"
        onChangeText={(password) => setPassword(password)}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={logueo}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttontype2} onPress={() => navigation.navigate('Forgot')}>
        <Text style={styles.buttontypetext}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttontype3} onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.buttontypetext}>Registrate</Text>
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
    alignSelf: 'flex-start',
    paddingTop: 35,
  },
  buttontype3: {
    alignSelf: 'flex-start',
    paddingTop: 20,
  },
  buttontypetext: {
    color: '#d55038',
    fontSize: 14,
  },
});


export default LoginScreen;