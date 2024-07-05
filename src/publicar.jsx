import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ref, uploadBytes, getStorage, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../credenciales';
import { doc, updateDoc, getFirestore, addDoc, collection, getDoc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import VistaPreviaAnuncio from '../components/VistaPreviaAnuncio';

function SubirAnuncio({ navigation }) {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [etiquetas, setEtiquetas] = useState({});
    const [imagenes, setImagenes] = useState([]);
    const [usuario, setUsuario] = useState(null); // Estado para almacenar datos del usuario

    // Obtener datos del usuario al cargar el componente
    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            try {
                const userDocRef = doc(db, 'users', auth.currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUsuario(userDoc.data());
                } else {
                    console.log('No se encontraron datos del usuario');
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
            }
        };

        obtenerDatosUsuario();
    }, []);

    // Función para subir el anuncio
    const subirAnuncio = async (titulo, descripcion, etiquetas, imagenes) => {
        try {
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            let location = '';
            if (userDoc.exists()) {
                location = userDoc.data().location || '';
            }

            // Crear documento de anuncio en Firestore
            const anuncioRef = await addDoc(collection(db, 'anuncios'), {
                titulo,
                descripcion,
                etiquetas,
                location,
                timestamp: Date.now(),
                userId: auth.currentUser.uid,
            });
            const adId = anuncioRef.id;
            console.log('Anuncio creado con ID: ', adId);

            // Subir imágenes a Firebase Storage y obtener URLs
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

            // Actualizar documento de anuncio con URLs de imágenes
            await updateDoc(doc(db, 'anuncios', adId), {
                images: urls,
            });
            console.log('Anuncio actualizado con URLs de las imágenes');

            // Mostrar alerta de éxito y limpiar campos
            Alert.alert('Éxito', 'El anuncio ha sido publicado correctamente.');
            setTitulo("");
            setDescripcion("");
            setEtiquetas({});
            setImagenes([]);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error al crear el anuncio o subir las imágenes: ', error);
        }
    };

    // Función para manejar la selección de imágenes desde la galería
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

            if (!pickerResult.cancelled) {
                const selectedImages = pickerResult.assets.map(asset => ({ uri: asset.uri }));
                setImagenes([...imagenes, ...selectedImages]);
            }
        } catch (error) {
            console.error('Error al solicitar permisos: ', error);
        }
    };

    // Función para eliminar una imagen de la lista
    const eliminarImagen = (uri) => {
        setImagenes(imagenes.filter(imagen => imagen.uri !== uri));
    };

    // Función para eliminar una etiqueta seleccionada
    const eliminarEtiqueta = (tagType, etiqueta) => {
        const updatedEtiquetas = { ...etiquetas };
        updatedEtiquetas[tagType] = updatedEtiquetas[tagType].filter(tag => tag !== etiqueta);
        if (updatedEtiquetas[tagType].length === 0) {
            delete updatedEtiquetas[tagType];
        }
        setEtiquetas(updatedEtiquetas);
    };

    // Función para manejar la publicación del anuncio
    const handleSubirAnuncio = () => {
        if (!titulo || !descripcion || Object.keys(etiquetas).length === 0) {
            Alert.alert(
                "Error",
                "Todos los campos son obligatorios",
                [{ text: "OK" }]
            );
            return;
        }
        subirAnuncio(titulo, descripcion, etiquetas, imagenes);
    };

    // Función para manejar la navegación a la pantalla de añadir etiquetas
    const handleEtiquetas = () => {
        navigation.navigate('AñadirEtiquetas', {
            tagType: 'some_unique_key',
            currentTags: etiquetas,
            onAddTag: (updatedTags) => setEtiquetas(updatedTags) // Pasar la función para actualizar etiquetas
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
            <TouchableOpacity style={styles.addTagsButton} onPress={handleEtiquetas}>
                <Ionicons name="pricetag" size={24} color="#fff" />
                <Text style={styles.addTagsButtonText}>Añadir Etiquetas</Text>
            </TouchableOpacity>
            <View style={styles.etiquetasContainer}>
                {Object.keys(etiquetas).map((tagType) => (
                    <View key={tagType}>
                        {etiquetas[tagType].map((etiqueta, index) => (
                            <View key={index} style={[styles.etiqueta, styles.etiquetaSeleccionada]}>
                                <Ionicons name={iconMap[tagType]} size={20} color="#fff" />
                                <Text style={styles.etiquetaText}>{etiqueta}</Text>
                                <TouchableOpacity onPress={() => eliminarEtiqueta(tagType, etiqueta)}>
                                    <Icon name="times" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
            <View style={styles.imageContainer}>
                {imagenes.map((imagen, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri: imagen.uri }} style={styles.image} />
                        <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarImagen(imagen.uri)}>
                            <Icon name="times" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            {/* Vista previa del anuncio */}
            <VistaPreviaAnuncio
                titulo={titulo}
                descripcion={descripcion}
                etiquetas={etiquetas}
                imagenes={imagenes}
                usuario={usuario}
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
        </ScrollView>
    );
}

export default SubirAnuncio;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        marginTop: -50,
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
    addTagsButton: {
        backgroundColor: 'tomato',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    addTagsButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
    },
    etiquetasContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    etiqueta: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'tomato',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        margin: 5,
    },
    etiquetaText: {
        color: '#fff',
        marginLeft: 5,
    },
    etiquetaSeleccionada: {
        backgroundColor: 'rgba(255, 99, 71, 0.8)',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 10,
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 50,
        padding: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    roundButtonLeft: {
        flexDirection: 'row',
        backgroundColor: 'tomato',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
    },
    roundButtonRight: {
        flexDirection: 'row',
        backgroundColor: 'deepskyblue',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
    },
    roundButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
    },
});