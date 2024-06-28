import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import darLike from "../backend/anuncio/darLike";

function LikeAnuncio({ id }) {
  const handleLike = () => {
    darLike(id)
      .then((response) => {
        console.log("Like añadido con éxito" , response);
      })
      .catch((error) => {
        console.error("Error al añadir like: ", error);
      });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLike}>
      <Text style={styles.buttonText}>Like</Text>
    </TouchableOpacity>
  );
}

export default LikeAnuncio;

const styles = StyleSheet.create({
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