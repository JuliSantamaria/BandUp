import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import actualizarInfoUsuario from "../backend/usuario/actualizarInfoUsuario";

function ActualizarInfoUsuario() {
    const [idUsuario, setIdUsuario] = useState("");
    const [nuevaInfo, setNuevaInfo] = useState({ nombre: "", email: "" });

    const actualizarUsuario = () => {
        actualizarInfoUsuario(idUsuario, nuevaInfo)
            .then(() => {
                console.log('Información actualizada con éxito');
            })
            .catch((error) => {
                console.log('Error al actualizar la información del usuario: ', error);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Actualizar Información del Usuario</Text>  
            <TextInput
                style={styles.input}
                placeholder="ID del Usuario"
                value={idUsuario}
                onChangeText={setIdUsuario}
            />
            <TextInput
                style={styles.input}
                placeholder="Nuevo Nombre"
                value={nuevaInfo.nombre}
                onChangeText={(text) => setNuevaInfo({ ...nuevaInfo, nombre: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Nuevo Email"
                value={nuevaInfo.email}
                onChangeText={(text) => setNuevaInfo({ ...nuevaInfo, email: text })}
            />
            <TouchableOpacity style={styles.button} onPress={actualizarUsuario}>
                <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
        </View>
    );
}

export default ActualizarInfoUsuario;

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
    }
});