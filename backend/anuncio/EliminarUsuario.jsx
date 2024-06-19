import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import eliminarUsuario from "../backend/usuario/eliminarUsuario";

function EliminarUsuario() {
    const [idUsuario, setIdUsuario] = useState("");

    const eliminarUsuarioPorId = () => {
        eliminarUsuario(idUsuario)
            .then(() => {
                console.log('Usuario eliminado con éxito');
            })
            .catch((error) => {
                console.log('Error al eliminar el usuario: ', error);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Eliminar Usuario</Text>
            <TextInput
                style={styles.input}
                placeholder="ID del Usuario"
                value={idUsuario}
                onChangeText={setIdUsuario}
            />
            <TouchableOpacity style={styles.button} onPress={eliminarUsuarioPorId}>
                <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );
}

export default EliminarUsuario;

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
        backgroundColor: 'red',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    }
});