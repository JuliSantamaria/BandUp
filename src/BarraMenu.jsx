import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth'; // Importa las funciones necesarias de Firebase

const BarraMenu = ({ isOpen, onClose }) => {
  const navigation = useNavigation();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const auth = getAuth(); // Obtén la instancia de autenticación

  useEffect(() => {
    if (!isOpen) {
      setEditProfileOpen(false);
    }
  }, [isOpen]);

  const handleOptionPress = (option) => {
    console.log('Opción seleccionada:', option);

    onClose();

    switch (option) {
      case 'Configuraciones':
        navigation.navigate('Configuraciones');
        break;
      case 'Editar Información':
        navigation.navigate('EditarInformacion');
        break;
      case 'Editar Etiquetas':
        navigation.navigate('EditarEtiquetas');
        break;
      case 'Premium':
        navigation.navigate('Premium');
        break;
      case 'Cerrar Sesión':
        confirmLogout();
        break;
      default:
        break;
    }
  };

  const handleEditProfilePress = () => {
    setEditProfileOpen(!editProfileOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Cierre de sesión', 'Has cerrado sesión correctamente.');
      navigation.navigate('Login'); // Navega a la pantalla de inicio de sesión después de cerrar sesión
    } catch (error) {
      Alert.alert('❌ Error al cerrar sesión', 'Hubo un problema al intentar cerrar sesión. Inténtelo de nuevo.');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          onPress: handleLogout,
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.menuContainer, isOpen ? styles.openMenu : styles.closedMenu]}>
      <TouchableOpacity style={styles.menuOption} onPress={() => handleOptionPress('Configuraciones')}>
        <Ionicons name="settings-outline" size={30} color="black" style={styles.menuIcon} />
        <Text style={styles.menuText}>Configuraciones</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuOption} onPress={handleEditProfilePress}>
        <Ionicons name="person-circle-outline" size={30} color="black" style={styles.menuIcon} />
        <Text style={styles.menuText}>Editar Perfil</Text>
      </TouchableOpacity>
      {editProfileOpen && (
        <View style={styles.subMenu}>
          <TouchableOpacity style={styles.subMenuOption} onPress={() => handleOptionPress('Editar Información')}>
            <Text style={styles.subMenuText}>Editar Información</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subMenuOption} onPress={() => handleOptionPress('Editar Etiquetas')}>
            <Text style={styles.subMenuText}>Editar Etiquetas</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.menuOption} onPress={() => handleOptionPress('Premium')}>
        <Ionicons name="star-outline" size={30} color="black" style={styles.menuIcon} />
        <Text style={styles.menuText}>Premium</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuOption} onPress={() => handleOptionPress('Cerrar Sesión')}>
        <Ionicons name="log-out-outline" size={30} color="black" style={styles.menuIcon} />
        <Text style={styles.menuText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={28} color="tomato" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 90,
    right: 0,
    backgroundColor: '#f9f9f9',
    width: 200,
    elevation: 5,
    zIndex: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    display: 'none',
  },
  openMenu: {
    display: 'flex',
  },
  closedMenu: {
    display: 'none',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: 'black',
  },
  subMenu: {
    paddingLeft: 20,
    width: '100%',
  },
  subMenuOption: {
    paddingVertical: 10,
  },
  subMenuText: {
    fontSize: 14,
    color: 'gray',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default BarraMenu;