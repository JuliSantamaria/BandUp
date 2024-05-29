import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';




const CreateProfile = ({navigation}) => {

  
  return (
    <View style={styles.container}>
      <Image source={require('./../../assets/images/logobandup.png')} style={styles.logo} />
      <Text style={styles.title}>Bienvenido a BandUp!</Text>
      <Text style={styles.subtitle1}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
    />
      <Text style={styles.subtitle2}>Apellido</Text>
      <TextInput
        style={styles.input}
        placeholder="Your surname"
      />
      <Text style={styles.subtitle3}>Descripcion</Text>
      <TextInput
        style={styles.input}
        placeholder="Brief description"
      />
      <Text style={styles.subtitle4}>Ubicacion</Text>
      <TextInput
        style={styles.input}
        placeholder="Your location"
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GenerosMusicales')}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  )
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
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle1: {
      marginBottom:10,
      marginLeft: -315,
  },
  subtitle2: {
    marginBottom:10,
    marginLeft: -300,
},
subtitle3: {
    marginBottom:10,
    marginLeft: -285,
},
subtitle4: {
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

export default CreateProfile;