import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../credenciales';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Busqueda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'anuncios'),
        where('titulo', '>=', searchTerm),
        where('titulo', '<=', searchTerm + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const publicaciones = querySnapshot.docs.map(doc => doc.data());
      setResults(publicaciones);
    } catch (error) {
      console.error('Error al buscar publicaciones:', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar publicaciones..."
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>{item.titulo}</Text>
              <Text style={styles.resultText}>{item.descripcion}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#d35400', 
    borderWidth: 1,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderRightWidth: 0,
  },
  searchIcon: {
    height: 40,
    width: 40,
    backgroundColor: '#d35400', 
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultText: {
    fontSize: 16,
  },
});

export default Busqueda;