import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getDoc, doc, getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../credenciales';
import AnunciosPerfil from '../components/AnunciosPerfil';
import FotosVideosPerfil from '../components/FotosVideosPerfil';
import ReseñasPerfil from '../components/ReseñasPerfil';
import Ionicons from 'react-native-vector-icons/Ionicons';


const PerfilAjeno = ({ route, navigation }) => {
  const { usuarioId } = route.params;
  const [usuario, setUsuario] = useState(null);
  const [activeTab, setActiveTab] = useState('Anuncios');
  const [userAds, setUserAds] = useState([]);
  
  

  const fetchUserAds = async (userId) => {
    const adsCollectionRef = query(collection(db, 'anuncios'), where('userId', '==', userId));
    const adsSnapshot = await getDocs(adsCollectionRef);
    const ads = [];
    adsSnapshot.forEach(doc => ads.push({ id: doc.id, ...doc.data() }));
    setUserAds(ads);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', usuarioId));
        if (userDoc.exists()) {
          setUsuario(userDoc.data());
          fetchUserAds(usuarioId);
        } else {
          console.log('No existe el usuario con ID:', usuarioId);
        }
      } catch (error) {
        console.error('Error obteniendo usuario:', error);
      }
    };

    fetchUserData();
  }, [usuarioId]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Anuncios':
        return <AnunciosPerfil borrar= '1' userAds={userAds} name={usuario.name} surname={usuario.surname} profileImage={usuario.photoURL} description={usuario.description} refreshAds={() => fetchUserAds(auth.currentUser.uid)} />;
      case 'Fotos/Videos':
        return <FotosVideosPerfil uid={usuarioId} />;
      case 'Reseñas':
        return <ReseñasPerfil reseniasIniciales={usuario.resenias ? usuario.resenias : null} navigation={navigation} uid={usuarioId} />;
      default:
        return <AnunciosPerfil />;
    }
  };

  const renderIcon = (category) => {
    switch (category) {
      case 'InstrumentosMusicales':
        return <Ionicons name="musical-notes-outline" size={16} color="#fff" style={styles.tagIcon} />;
      case 'favoriteGenres':
        return <Ionicons name="musical-note-outline" size={16} color="#fff" style={styles.tagIcon} />;
      case 'Experiencia':
        return <Ionicons name="school-outline" size={16} color="#fff" style={styles.tagIcon} />;
      default:
        return null;
    }
  };

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image 
        source={usuario.photoURL ? { uri: usuario.photoURL } : require('../assets/images/defaultprofile.png')} 
        style={styles.profileImage} 
      />
      <Text style={styles.name}>{usuario.name} {usuario.surname}</Text>
      {usuario.location && <Text style={styles.location}>{usuario.location}</Text>}
      <View style={styles.tagsContainer}>
        {usuario.InstrumentosMusicales && usuario.InstrumentosMusicales.map((instrumento, index) => (
          <View key={index} style={styles.tag}>
            {renderIcon('InstrumentosMusicales')}
            <Text style={styles.tagText}>{instrumento}</Text>
          </View>
        ))}
        {usuario.favoriteGenres && usuario.favoriteGenres.map((genero, index) => (
          <View key={index} style={styles.tag}>
            {renderIcon('favoriteGenres')}
            <Text style={styles.tagText}>{genero}</Text>
          </View>
        ))}
        {usuario.Experiencia && usuario.Experiencia.map((experiencia, index) => (
          <View key={index} style={styles.tag}>
            {renderIcon('Experiencia')}
            <Text style={styles.tagText}>{experiencia}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.description}>{usuario.description}</Text>
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffa07a',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  tagIcon: {
    marginRight: 5,
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
    borderBottomColor: '#ffa07a',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
});

export default PerfilAjeno;
