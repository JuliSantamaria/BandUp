import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../credenciales';
import { doc, setDoc } from 'firebase/firestore';

const Generosmusicales = ({ navigation }) => {
    const [items, setItems] = useState([
        { id: '1', name: 'Pop' },
        { id: '2', name: 'Rock' },
        { id: '3', name: 'Jazz' },
        { id: '4', name: 'Metal' },
        { id: '5', name: 'Classic' },
        { id: '6', name: 'Techno' },
    ]);

    const [selectedItems, setSelectedItems] = useState([]);

    const toggleItem = (itemName) => {
        setSelectedItems(prevSelectedItems =>
            prevSelectedItems.includes(itemName)
                ? prevSelectedItems.filter(name => name !== itemName)
                : [...prevSelectedItems, itemName]
        );
    };

    const saveSelectedItems = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                await setDoc(doc(db, 'users', userId), {
                    favoriteGenres: selectedItems,
                }, { merge: true });
                
                navigation.navigate('InstrumentosMusicales');
            } else {
                Alert.alert('Error', 'Usuario no autenticado.');
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al guardar los géneros musicales.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/logobandup.png')} style={styles.logo} />
            <Text style={styles.title}>Generos Musicales!</Text>
            <Text style={styles.subtitle}>Elige tus generos musicales favoritos</Text>
            <FlatList
                contentContainerStyle={styles.checklistContainer}
                data={items}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => toggleItem(item.name)}
                    >
                        <View style={styles.itemContent}>
                            <Text style={styles.itemText}>
                                {selectedItems.includes(item.name) ? '☑️' : '⬜️'}
                            </Text>
                            <Text style={styles.itemName}>
                                {item.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={saveSelectedItems}>
                    <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 30,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 30,
    },
    checklistContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
        marginTop: 5,
    },
    item: {
        width: '100%',
        alignItems: 'center',
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: '100%',
    },
    itemText: {
        fontSize: 18,
        marginLeft: 100,
    },
    itemName: {
        fontSize: 18,
        flex: 1,
        marginLeft: -120,
        textAlign: 'center',
    },
    buttonsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#d55038',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 5,
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    button2: {
        backgroundColor: '#d55038',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 5,
        marginTop: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Generosmusicales;
