import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
     const unsubscribe = firestore()
        .collection('users') 
        .where('yourField', '>=', searchQuery)
        .where('yourField', '<=', searchQuery + '\uf8ff')
        .onSnapshot((querySnapshot) => {
          const resultsData = [];
          querySnapshot.forEach((documentSnapshot) => {
            resultsData.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setResults(resultsData);
        });
 
      return () => unsubscribe();
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const handleKeyPress = (key) => {
    setSearchQuery(searchQuery + key);
  };

  const handleDeletePress = () => {
    setSearchQuery(searchQuery.slice(0, -1));
  };

  const handleSpacePress = () => {
    setSearchQuery(searchQuery + ' ');
  };

  const handleEnterPress = () => {
    // Aquí puedes manejar la acción de "aceptar" o "buscar"
    console.log('Buscar:', searchQuery);
  };

  const renderKey = (key) => (
    <TouchableOpacity onPress={() => handleKeyPress(key)} style={styles.key}>
      <Text style={styles.keyText}>{key}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TextInput
        style={styles.input}
        placeholder="Buscar..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.Buscar}</Text> 
        )}
      />
      <View style={styles.keyboard}>
        <View style={styles.keyRow}>
          {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(renderKey)}
        </View>
        <View style={styles.keyRow}>
          {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(renderKey)}
        </View>
        <View style={styles.keyRow}>
          {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(renderKey)}
        </View>
        <View style={styles.keyRow}>
          <TouchableOpacity onPress={handleDeletePress} style={styles.specialKey}>
            <Text style={styles.keyText}>⌫</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSpacePress} style={styles.spaceKey}>
            <Text style={styles.keyText}>Espacio</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEnterPress} style={styles.specialKey}>
            <Text style={styles.keyText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff', // Fondo blanco
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    item: {
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      fontWeight: 'bold', // Letras en negrita
    },
    keyboard: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: '#ddd',
      paddingBottom: 16,
    },
    keyRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 8,
    },
    key: {
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    specialKey: {
      padding: 16,
      backgroundColor: '#ccc',
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    spaceKey: {
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 2,
      marginHorizontal: 4,
    },
    acceptKey: {
      padding: 16,
      backgroundColor: 'orange', // Fondo naranja para el botón Aceptar
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    keyText: {
      fontSize: 16,
      color: '#000',
      fontWeight: 'bold', // Letras en negrita
    },
  });

export default Search;