import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';



const ResetPassword = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = () => {
    if (username === '' || password === '') {
      Alert.alert('Error', 'Por favor ingrese ambos campos');
      return;
    }

    // Aquí puedes agregar tu lógica de autenticación
    if (username === 'user' && password === 'password') {
      Alert.alert('Éxito', 'Inicio de sesión exitoso');
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logobandup.png')} style={styles.logo} />
      <Text style={styles.title}>Restablece tu contraseña</Text>
      <Text style={styles.subtitle1}>Nueva contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.subtitle2}>Confirma tu contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button}  onPress={ () => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style= {styles.buttontype3}>
        <Text style= {styles.buttontypetext}>Registrate</Text> 
      </TouchableOpacity>
      
    </View>

     
  );
}

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
    fontSize: 30,
    marginBottom: 20,
  },
  subtitle1: {
      marginBottom:10,
      marginLeft: -250,
  },
  subtitle2: {
    marginBottom:10,
    marginLeft: -222,
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
    marginLeft: -245,
    paddingTop: 35,
  },
  buttontype3: {
    marginLeft: -315,
    paddingTop: 20,
  },
  buttontypetext: {
    color:'#d55038',
    fontSize:14,
  },
});

export default ResetPassword;