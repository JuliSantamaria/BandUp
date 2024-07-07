// VistaPreviaAnuncio.jsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const VistaPreviaAnuncio = ({ titulo, descripcion, etiquetas, imagenes, usuario }) => {
    return (
        <View style={styles.container}>
            {usuario && (
                <View style={styles.usuarioContainer}>
                    <Image source={{ uri: usuario.photoURL }} style={styles.avatar} />
                    <Text>{usuario.name} {usuario.surname}</Text>
                </View>
            )}
            <Text style={styles.titulo}>{titulo}</Text>
            <View style={styles.imagenesContainer}>
                {imagenes.map((imagen, index) => (
                    <Image key={index} source={{ uri: imagen.uri }} style={styles.imagen} resizeMode="cover" />
                ))}
            </View>
            <Text style={styles.descripcion}>{descripcion}</Text>
            <View style={styles.etiquetasContainer}>
                {Object.keys(etiquetas).map((tagType) => (
                    <View key={tagType} style={styles.etiqueta}>
                        <Text style={styles.etiquetaText}>{etiquetas[tagType].join(', ')}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default VistaPreviaAnuncio;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'white',
        marginBottom: 20,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    descripcion: {
        marginBottom: 10,
    },
    etiquetasContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    etiqueta: {
        backgroundColor: 'tomato',
        padding: 5,
        borderRadius: 10,
        marginRight: 5,
        marginBottom: 5,
    },
    etiquetaText: {
        color: '#fff',
    },
    imagenesContainer: {
        width: '100%',
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 250,
    },
    imagen: {
        width: '100%',
        borderRadius: 10,
        marginBottom: 5,
    },
    usuarioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
});
