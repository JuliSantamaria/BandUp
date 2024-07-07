import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../credenciales.js";

const Perfil = ({ route }) => {
  const { usuarioId } = route.params;
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', usuarioId));
        if (userDoc.exists()) {
          setUsuario(userDoc.data());
        } else {
          console.log('No existe el usuario con ID:', usuarioId);
        }
      } catch (error) {
        console.error('Error obteniendo usuario:', error);
      }
    };

    obtenerUsuario();
  }, [usuarioId]);

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image style={styles.usuarioFoto} source={{ uri: usuario.photoURL }} />
      <Text style={styles.usuarioNombre}>{usuario.name} {usuario.surname}</Text>
      <Text style={styles.descripcion}>{usuario.description}</Text>
      {/* Agrega más detalles del usuario según tus necesidades */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f4f2ee',
  },
  usuarioFoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  usuarioNombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default Perfil;
