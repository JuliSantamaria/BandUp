import appFirebase from '../../credenciales';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';

async function comentarAnuncio(id, comentario) {
    try {
        const db = getFirestore(appFirebase);
        const anuncioRef = doc(db, 'anuncios', id);

        await updateDoc(anuncioRef, {
            comentarios: arrayUnion(comentario)
        });

        return { message: "Comentario añadido con éxito" };
    } catch (error) {
        console.error("Error al comentar publicación: ", error);
        return Promise.reject(error);
    }
}

export default comentarAnuncio;