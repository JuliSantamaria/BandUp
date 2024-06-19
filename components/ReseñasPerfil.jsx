import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReseñasPerfil = () => {
  return (
    <View style={styles.container}>
      <Text>Reseñas Section</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReseñasPerfil;