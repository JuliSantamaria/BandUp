import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import obtenerUsuariosPorUbicacion from "../backend/usuario/obtenerUsuariosPorUbicacion";

function ObtenerUsuariosPorUbicacion() {
    const [ubicacion, setUbicacion] = useState("");
    const [usuarios, setUsuarios] = useState([]);

    const buscarUsuarios = () => {
        obtenerUsuariosPorUbicacion(ubicacion)
            .then((resultados) => {
                setUsuarios(resultados);
                console.log(resultados);
            })
            .catch((error) => {
                console.log('Error al obtener usuarios por ubicación: ', error);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buscar Usuarios por Ubicación</Text>
            <TextInput
                style={styles.input}
                placeholder="Ubicación"
                value={ubicacion}
                onChangeText={setUbicacion}
            />
            <TouchableOpacity style={styles.button} onPress={buscarUsuarios}>
                <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>
            {usuarios.map((usuario) => (
                <View key={usuario.id} style={styles.usuarioContainer}>
                    <Text>{usuario.nombre}</Text>
                    <Text>{usuario.email}</Text>
                    <Text>{usuario.ubicacion}</Text>
                </View>
            ))}
        </View>
    );
}

export default ObtenerUsuariosPorUbicacion;

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
    },
    usuarioContainer: {
        backgroundColor: 'white',
        width: 300,
        padding: 10,
        marginVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});