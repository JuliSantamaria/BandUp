import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth'; // Importa las funciones necesarias de Firebase

const LogoutButton = ({ navigation }) => {
  const auth = getAuth(); // Obtén la instancia de autenticación

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Cierre de sesión', 'Has cerrado sesión correctamente.');
      navigation.navigate('Login'); // Navega a la pantalla de inicio de sesión después de cerrar sesión
    } catch (error) {
      Alert.alert('❌ Error al cerrar sesión', 'Hubo un problema al intentar cerrar sesión. Inténtelo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Cerrar Sesión" onPress={handleLogout} color="#d55038" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 200,
  },
});

export default LogoutButton;
