 import React, {useState} from 'react';
import { View, Text, TextInput,FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Generosmusicales = ({navigation}) => {
    const [items, setItems] = useState([
        { id: '1', name: 'Option 1' },
        { id: '2', name: 'Option 2' },
        { id: '3', name: 'Option 3' },
        { id: '4', name: 'Option 4' },
      ]);
    
      const [selectedItems, setSelectedItems] = useState([]);
    
      const toggleItem = (itemId) => {
        setSelectedItems(prevSelectedItems =>
          prevSelectedItems.includes(itemId)
            ? prevSelectedItems.filter(id => id !== itemId)
            : [...prevSelectedItems, itemId]
        );
      };
  

    return(
    <View style={styles.container}>
      <Image source={require('./../../assets/images/logobandup.png')} style={styles.logo} />
      <Text style={styles.title}>Generos Musicales!</Text>
      <Text style={styles.subtitle}>Elige tus generos musicales favoritos</Text>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => toggleItem(item.id)}
          >
            <Text style={styles.itemText}>
              {selectedItems.includes(item.id) ? '☑️' : '⬜️'} {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={ () => navigation.navigate('Code')}>
        <Text style={styles.buttonText}>Aceptar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={ () => navigation.navigate('Code')}>
        <Text style={styles.buttonText}>Omitir</Text>
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
  button2: {
    backgroundColor: '#d55038', 
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 10,
    borderRadius: 5,
    width: 120,
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

export default Generosmusicales; 