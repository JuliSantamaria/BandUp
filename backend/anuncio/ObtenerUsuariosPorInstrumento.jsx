import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, TextInput } from "react-native";
import obtenerUsuariosPorInstrumento from "../backend/usuario/obtenerUsuariosPorInstrumento";

function ObtenerUsuariosPorInstrumento() {
    const [instrumento, setInstrumento] = useState('');
    const [usuarios, setUsuarios] = useState([]);

    const obtenerUsuarios = () => {
        obtenerUsuariosPorInstrumento(instrumento)
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
            <Text style={styles.title}>Obtener usuarios por instrumento</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingrese el instrumento"
                value={instrumento}
                onChangeText={setInstrumento}
            />
            <TouchableOpacity style={styles.button} onPress={obtenerUsuarios}>
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

export default ObtenerUsuariosPorInstrumento;

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
    }
})