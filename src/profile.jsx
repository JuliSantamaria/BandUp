import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../credenciales';
import { doc, getDoc, updateDoc, getDocs, collection, where, query } from 'firebase/firestore';
import AnunciosPerfil from '../components/AnunciosPerfil';
import FotosVideosPerfil from '../components/FotosVideosPerfil';
import ReseñasPerfil from '../components/ReseñasPerfil';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getStorage, getDownloadURL } from 'firebase/storage';

const Profile = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Anuncios');
  const [userData, setUserData] = useState(null);
  const [userAds, setUserAds] = useState([]);

  const onRefresh = () => {
    setRefreshing(true);
    obtenerTodos().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
            console.log(userDoc.data())
            fetchUserAds(user.uid);
          } else {
            console.log('No existe el documento!');
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario: ', error);
      }
    };

    fetchUserData();
  }, [activeTab]);

  const fetchUserAds = async (userId) => {
    const adsCollectionRef = query(collection(db, 'anuncios'), where('userId', '==', userId));
    const adsSnapshot = await getDocs(adsCollectionRef);
    const ads = [];
    adsSnapshot.forEach(doc => ads.push({ id: doc.id, ...doc.data() }));
    setUserAds(ads);
  };

  const handlePickImage = async () => {
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
        // Subir la imagen a Firebase Storage y guardar la URL en Firestore
        const uri = pickerResult.assets[0].uri;
        const imageName = `${auth.currentUser.uid}`;
        const response = await fetch(uri);
        const blob = await response.blob();
        const storage = getStorage();
        // Subir imagen a Firebase Storage
        const storageRef = ref(storage, `profile_images/${imageName}`);
        await uploadBytes(storageRef, blob);

        // Obtener la URL de descarga de la imagen
        const downloadUrl = await getDownloadURL(storageRef);

        // Actualizar el documento de usuario en Firestore con la URL de la imagen
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, { photoURL: downloadUrl });

        // Actualizar el estado local si es necesario
        setUserData(prevUserData => ({
          ...prevUserData,
          photoURL: downloadUrl // Si `photoURL` es el campo donde guardas la URL de la foto de perfil en Firestore
        }));

        Alert.alert('Éxito', 'La imagen de perfil se ha actualizado correctamente.');
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen: ', error);
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen. Inténtalo de nuevo más tarde.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Anuncios':
        return <AnunciosPerfil borrar='0' description={userData.description} name={userData.name} surname={userData.surname} profileImage={userData.photoURL && userData.photoURL} userAds={userAds} refreshAds={() => fetchUserAds(auth.currentUser.uid)} />;
      case 'Fotos/Videos':
        return <FotosVideosPerfil uid={auth.currentUser.uid} />;
      case 'Reseñas':
        return <ReseñasPerfil uid={auth.currentUser.uid} reseniasIniciales={userData.resenias ? userData.resenias : null} navigation={navigation}/>;
      default:
        return <AnunciosPerfil />;
    }
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickImage}>
        <View style={styles.imageContainer}>
          <Image 
            source={userData.photoURL ? { uri: userData.photoURL } : require('../assets/images/defaultprofile.png')} 
            style={styles.profileImage} 
            resizeMode='cover' // Puedes probar con 'contain' si 'cover' no funciona como esperas
          />
        </View>
      </TouchableOpacity>
      <Text style={styles.name}>{userData.name} {userData.surname}</Text>
      
      <View style={styles.tagsContainer}>
        {userData.InstrumentosMusicales.map((InstrumentosMusicales, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{InstrumentosMusicales}</Text>
          </View>
        ))}
        {userData.favoriteGenres.map((favoriteGenres, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{favoriteGenres}</Text>
          </View>
        ))}
        {userData.Experiencia.map((Experiencia, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{Experiencia}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.description}>{userData.description}</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Anuncios')} style={[styles.tabButton, activeTab === 'Anuncios' && styles.activeTab]}>
          <Text style={styles.tabText}>Anuncios</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Fotos/Videos')} style={[styles.tabButton, activeTab === 'Fotos/Videos' && styles.activeTab]}>
          <Text style={styles.tabText}>Fotos/Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Reseñas')} style={[styles.tabButton, activeTab === 'Reseñas' && styles.activeTab]}>
          <Text style={styles.tabText}>Reseñas</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    flexWrap: 'wrap', // Para que las etiquetas se ajusten a la pantalla y no se corten
    justifyContent: 'center', // Centrar las etiquetas
  },
  tag: {
    backgroundColor: '#d35400', // Naranja más oscuro
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5, // Añadir un margen inferior para que haya espacio entre filas
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#d35400', // Naranja más oscuro para la pestaña activa
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
});

export default Profile;
