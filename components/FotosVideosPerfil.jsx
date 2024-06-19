import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FotosVideosPerfil = () => {
  return (
    <View style={styles.container}>
      <Text>Fotos/Videos Section</Text>
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

export default FotosVideosPerfil;