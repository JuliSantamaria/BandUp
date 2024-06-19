import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import obtenerTodosUsuarios from "../backend/usuario/obtenerTodosUsuarios";

function ObtenerTodosLosUsuarios() {
    const [usuarios, setUsuarios] = useState([]);

    const obtenerTodos = () => {
        obtenerTodosUsuarios()
            .then((resultados) => {
                setUsuarios(resultados);
                console.log(resultados);
            })
            .catch((error) => {
                console.log('Error: ', error);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Obtener todos los usuarios</Text>
            <TouchableOpacity style={styles.button} onPress={obtenerTodos}>
                <Text style={styles.buttonText}>Obtener</Text>
            </TouchableOpacity>
            {usuarios.map((usuario) => {
                return (
                    <View key={usuario.id} style={{ backgroundColor: 'white', width: 255, borderBottomWidth: 1 }}>
                        <Text>{usuario.nombre}</Text>
                        <Text>{usuario.instrumentos.join(", ")}</Text>
                        <Text>{usuario.ubicacion}</Text>
                    </View>
                );
            })}
        </View>
    );
}

export default ObtenerTodosLosUsuarios;

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