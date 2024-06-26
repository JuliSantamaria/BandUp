import React from "react";
import appFirebase from '../../credenciales';
import { addDoc, getFirestore, collection } from 'firebase/firestore';


async function subirAnuncio(idUsuario, titulo, descripcion, mensaje) {
    console.log(titulo, descripcion, mensaje);
        const anuncio = {
            idUsuario: idUsuario,
            titulo: titulo,
            descripcion: descripcion,
            mensaje: mensaje,
        };
        
    try {
        const db = getFirestore(appFirebase);
        return await addDoc(collection(db,'anuncios'), anuncio)

    } catch (error) {
        console.error("Error al inicializar Firestore: ", error);
        return Promise.reject(error);
    }
}

export default subirAnuncio;