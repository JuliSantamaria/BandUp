import React, {useState} from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import obtenerInfoDeUsuarioPorId from "../backend/usuario/obtenerInfoDeUsuarioPorId";

function ObtenerInfoUsuario() {

    const [idUsuario, setIdUsuario] = useState("");
    const [infoUsuario, setInfoUsuario] = useState(false);
    const [botonUtilizado, setBotonUtilizado] = useState(false);

    const obtenerInfoUsuario = () => {
        //console.log(idUsuario);
        obtenerInfoDeUsuarioPorId(idUsuario).then((resultados) => {
            setInfoUsuario(resultados);
            console.log(resultados);
            setBotonUtilizado(true);
        }).catch((error) => {
            console.log('Error: ', error);
        });
        
        
    }

    return (
        <View style={styles.container}>
            <Text>Obtener Info de Usuario</Text>
            <TextInput placeholder="Introducir id de usuario" style={styles.input} onChangeText={setIdUsuario} value={idUsuario}/>
            <TouchableOpacity 
            style={styles.button}
            onPress={obtenerInfoUsuario}
            >
                <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>
            {botonUtilizado && (
                infoUsuario ? (<View>
                    <Text>Nombre: {infoUsuario.nombre}</Text>
                    <Text>Descripcion: {infoUsuario.descripcion}</Text>
                    <Text>Estado: {infoUsuario.estado}</Text>
                    <Text>Instrumentos: {infoUsuario.instrumentos.join(" ")}</Text>
                    <Text>Pais: {infoUsuario.pais}</Text>
                </View>) : <View><Text>Usuario no encontrado</Text></View>
                )
            }
        </View>
    );
}

export default ObtenerInfoUsuario;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    input: {
        width: '80%',
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
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