import appFirebase from '../../credenciales';
import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { notificacionPorComentario } from '../notificacion/notificaciones';

async function comentarAnuncio(id, comentario) {
    try {
        const db = getFirestore(appFirebase);
        const anuncioRef = doc(db, 'anuncios', id);

        await updateDoc(anuncioRef, {
            comentarios: arrayUnion(comentario)
        });
        const destinatario = (await getDoc(anuncioRef)).data().userId;
        notificacionPorComentario(destinatario, comentario); // Disparador para notificacion de comentario
        return { message: "Comentario añadido con éxito" };
    } catch (error) {
        console.error("Error al comentar publicación: ", error);
        return Promise.reject(error);
    }
}

export default comentarAnuncio;
