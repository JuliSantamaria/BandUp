import React, {useState} from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import obtenerTodosAnuncios from "../backend/anuncio/obtenerTodosAnuncios";

function ObtenerTodosLosAnuncios() {

    const [anuncios, setAnuncios] = useState([]);  

    const obtenerTodos = () => {
        obtenerTodosAnuncios()
        .then((resultados) => {
            setAnuncios(resultados);
            console.log(resultados);
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Obtener todos los anuncios</Text>
            <TouchableOpacity style={styles.button} onPress={obtenerTodos}>
                <Text style={styles.buttonText}>Obtener</Text>
            </TouchableOpacity>
            {anuncios.map((anuncio) => {
                return (
                    <View key={anuncio.id} style={{backgroundColor: 'white', width: 255, borderBottomWidth: 1}}>
                        <Text>{anuncio.titulo}</Text>
                        <Text>{anuncio.descripcion}</Text>
                        <Text>{anuncio.mensaje}</Text>
                    </View>
                );
            })}
        </View>
    );

}

export default ObtenerTodosLosAnuncios;


const styles = StyleSheet.create({
    container: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 150
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    }
});