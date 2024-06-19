import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import subirAnuncio from '../backend/anuncio/subirAnuncio';

function SubirAnuncio({ navigation }) {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [idUsuario, setIdUsuario] = useState("1");

    const guardarAnuncio = () => {
        if (!titulo || !descripcion || !mensaje) {
            Alert.alert(
                "Error",
                "Todos los campos son obligatorios",
                [{ text: "OK" }]
            );
            return;
        }
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
            <Text style={styles.title}>Publicar</Text>
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
            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    style={styles.roundButtonLeft}
                    onPress={guardarAnuncio}
                >
                    <Icon name="bullhorn" size={30} color="#fff" />
                    <Text style={styles.roundButtonText}>Publicar anuncio</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.roundButtonRight}
                    onPress={() => console.log('Photo or video pressed')}
                >
                    <Icon name="camera" size={30} color="#fff" />
                    <Text style={styles.roundButtonText}>Foto o video</Text>
                </TouchableOpacity>
            </View>
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
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    input: {
        width: '80%',
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    roundButtonLeft: {
        backgroundColor: '#f39c12',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    roundButtonRight: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    roundButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
});