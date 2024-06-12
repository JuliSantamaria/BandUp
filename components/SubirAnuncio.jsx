import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import subirAnuncio from '../backend/anuncio/subirAnuncio';


function SubirAnuncio({navigation}) {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [idUsuario, setIdUsuario] = useState("1");

    const guardarAnuncio = () => {
        subirAnuncio(idUsuario, titulo, descripcion, mensaje)
        .then(() => {
            console.log('Anuncio subido');
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Subir anuncio</Text>
            <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={(e) => setTitulo(e)}
            placeholder="Titulo"
            />
            <TextInput
            style={styles.input}
            value={descripcion}
            onChangeText={(e) => setDescripcion(e)}
            placeholder="Descripcion"
            />
            <TextInput
            style={styles.input}
            value={mensaje}
            onChangeText={(e) => setMensaje(e)}
            placeholder="Mensaje adicional"
            />
            <TouchableOpacity 
            style={styles.button}
            onPress={guardarAnuncio}
            >
                <Text style={styles.buttonText}>Subir</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('ObtenerAnuncios')}
            >
                <Text style={styles.buttonText}>Ir a Obtener Anuncios por ID</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('ObtenerTodosLosAnuncios')}
            >
                <Text style={styles.buttonText}>Ir a Obtener Todos los Anuncios</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('ObtenerInfoUsuario')}
            >
                <Text style={styles.buttonText}>Ir a Obtener Info de un Usuario</Text>
            </TouchableOpacity>
        </View>
    );
}

export default SubirAnuncio;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    });