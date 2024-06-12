import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
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
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar publicaciones..."
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
        onSubmitEditing={handleSearch}
      />
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
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
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
