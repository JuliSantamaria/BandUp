import React from "react";
import appFirebase from '../../credenciales';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

async function obtenerTodosAnuncios () {
    try {
        const db = getFirestore(appFirebase);
        const anunciosRef = collection(db, 'anuncios');
        const q = query(anunciosRef);

        return await getDocs(q).then((querySnapshot) => {
            const resultados = [];
            querySnapshot.forEach((doc) => {
                resultados.push({ id: doc.id, ...doc.data() });
            });
            return resultados;
        }).catch((error) => {
            console.error("Error al obtener anuncios: ", error);
            return Promise.reject(error);
        });
    } catch (error) {
        console.error("Error al inicializar Firestore o crear la consulta: ", error);
        return Promise.reject(error);
    }
}

export default obtenerTodosAnuncios;