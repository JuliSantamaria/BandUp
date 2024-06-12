import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import obtenerAnuncioPorId from "../backend/anuncio/obtenerAnuncioPorId";

function ObtenerAnuncios() {

    const [anuncios, setAnuncios] = useState([]);
    const [idUsuario, setIdUsuario] = useState("");

    const obtenerAnuncios = async () => {
        obtenerAnuncioPorId(idUsuario).then((resultados) => {
            setAnuncios(resultados);
            console.log(resultados);
        }).catch((error) => {
            console.log('Error: ', error);
        });
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Obtener anuncios de alguien especifico</Text>
            <TextInput 
            placeholder="ID de usuario" 
            style={styles.input}
            value= {idUsuario}
            onChangeText={(e) => setIdUsuario(e)}
            />
            <TouchableOpacity
            style={styles.button}
            onPress={obtenerAnuncios}
            >
                <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>
            <View>
                {anuncios.map((anuncio) => (
                    <View key={anuncio.id}>
                        <Text>{anuncio.titulo}</Text>
                        <Text>{anuncio.descripcion}</Text>
                        <Text>{anuncio.mensaje}</Text>
                    </View>
                ))}
            </View>  
        </View>
    );
}

export default ObtenerAnuncios;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});