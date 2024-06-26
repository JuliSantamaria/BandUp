import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import comentarAnuncio from "../backend/anuncio/comentarAnuncio";

function ComentarAnuncio({ id }) {
  const [comentario, setComentario] = useState("");

  const handleComentar = () => {
    comentarAnuncio(id, { texto: comentario, fecha: new Date() })
      .then((response) => {
        console.log("Comentario añadido con éxito", response);
        setComentario(""); 
      })
      .catch((error) => {
        console.error("Error al comentar publicación: ", error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Escribe un comentario"
        value={comentario}
        onChangeText={setComentario}
      />
      <TouchableOpacity style={styles.button} onPress={handleComentar}>
        <Text style={styles.buttonText}>Comentar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ComentarAnuncio;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  input: {
    flex: 1,
    height: 40,
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