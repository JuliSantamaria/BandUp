import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ref, uploadBytes, getStorage, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../credenciales';
import { doc, updateDoc, getFirestore, addDoc, collection, arrayUnion, where } from 'firebase/firestore';

function SubirAnuncio({ navigation }) {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [imagenes, setImagenes] = useState([]);

    const subirAnuncio = async (titulo, descripcion, imagenes) => {
        try {
            // Paso 1: Crear el anuncio en Firestore y obtener el adId
            const db = getFirestore();
            const anuncioRef = await addDoc(collection(db, `anuncios`), {
                titulo,
                descripcion,
                timestamp: Date.now(),
                userId: auth.currentUser.uid,
            });
            const adId = anuncioRef.id;
            console.log('Anuncio creado con ID: ', adId);

            // Paso 2: Subir las imágenes a Firebase Storage y obtener sus URLs
            const storage = getStorage();
            const urls = [];

            for (let imagen of imagenes) {
                const response = await fetch(imagen.uri);
                const blob = await response.blob();
                const imageName = `${Date.now()}_${auth.currentUser.uid}`;
                const storageRef = ref(storage, `users/${auth.currentUser.uid}/ads/${adId}/images/${imageName}`);
                await uploadBytes(storageRef, blob);
                const url = await getDownloadURL(storageRef);
                urls.push(url);
                console.log('URL de la imagen: ', url);
            }

            // Paso 3: Actualizar el documento del anuncio con las URLs de las imágenes
            await updateDoc(doc(db, `anuncios/${adId}`), {
                images: urls,
            });
            console.log('Anuncio actualizado con URLs de las imágenes');
        } catch (error) {
            console.error('Error al crear el anuncio o subir las imágenes: ', error);
        }
    };

    const subirImagen = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permisos insuficientes', 'Debe otorgar permisos para acceder a la galería de imágenes.');
                return;
            }

            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!pickerResult.canceled) {
                const selectedImages = pickerResult.assets.map(asset => ({ uri: asset.uri }));
                setImagenes([...imagenes, ...selectedImages]);
            }
        } catch (error) {
            console.error('Error al solicitar permisos: ', error);
        }
    };

    const handleSubirAnuncio = () => {
        if (!titulo || !descripcion || !mensaje) {
            Alert.alert(
                "Error",
                "Todos los campos son obligatorios",
                [{ text: "OK" }]
            );
            return;
        }
        subirAnuncio(titulo, descripcion, imagenes);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Publicar</Text>
            <TextInput
                style={styles.input}
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Titulo"
            />
            <TextInput
                style={styles.input}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Descripcion"
            />
            <TextInput
                style={styles.input}
                value={mensaje}
                onChangeText={setMensaje}
                placeholder="Mensaje adicional"
            />
            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    style={styles.roundButtonLeft}
                    onPress={handleSubirAnuncio}
                >
                    <Icon name="bullhorn" size={30} color="#fff" />
                    <Text style={styles.roundButtonText}>Publicar anuncio</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.roundButtonRight}
                    onPress={subirImagen}
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
        marginTop: -50, // Ajusta este valor según necesites
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    roundButtonLeft: {
        backgroundColor: '#d35400',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    roundButtonRight: {
        backgroundColor: '#bbb',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    roundButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
});