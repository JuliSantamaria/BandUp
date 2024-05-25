import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Code = ({navigation}) => {
    
    return(
    <View style={styles.container}>
      <Image source={require('./../../assets/images/logobandup.png')} style={styles.logo} />
      <Text style={styles.title}>Codigo</Text>
      <Text style={styles.subtitle}>Ingresa el codigo que hemos enviado a tu correo electronico</Text>
      <Text style={styles.subtitle1}>Codigo</Text>
      <TextInput
        style={styles.input}
        placeholder="Codigo"
        
      />
      <TouchableOpacity style={styles.button} onPress={ () => navigation.navigate('ResetPassword')}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style= {styles.buttontype3}>
        <Text style= {styles.buttontypetext}>Registrate</Text> 
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
      fontSize: 30,
      marginBottom: 20,
    },
    subtitle: {
       
       marginBottom: 30,
       textAlign: 'center',
    },
    subtitle1: {
        marginBottom:10,
        marginLeft: -317,
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

export default Code;