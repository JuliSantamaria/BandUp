import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Premium = () => {
  return (
    <View style={styles.container}>
      <Text>Premium Screen</Text>
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

export default Premium;