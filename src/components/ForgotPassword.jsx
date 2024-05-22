import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';

const ForgotPassword = () => {
    return(
    <View style={styles.container}>
         <Text style={styles.text}>Welcome to BandUp!</Text>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    text: {
      fontSize: 20,
    },
  });

export default ForgotPassword;