import appFirebase from '../../credenciales';
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { auth } from '../../credenciales';
import { notificacionPorLike } from '../notificacion/notificaciones';

async function darLike(id) {
    try {
        const db = getFirestore(appFirebase);
        const anuncioRef = doc(db, 'anuncios', id);
        let uid = auth.currentUser.uid;
        await updateDoc(anuncioRef, {
            likes: arrayUnion(uid)
        });
        const destinatario = (await getDoc(anuncioRef)).data().userId;
        notificacionPorLike(destinatario); // Disparador para notificacion de 'Me gusta'
        return { message: "Like añadido con éxito" };
    } catch (error) {
        console.error("Error al añadir like: ", error);
        return Promise.reject(error);
    }
}

async function quitarLike(id) {
    try {
        const db = getFirestore(appFirebase);
        const anuncioRef = doc(db, 'anuncios', id);
        let uid = auth.currentUser.uid;
        await updateDoc(anuncioRef, {
            likes: arrayRemove(uid)
        });

        return { message: "Like eliminado con éxito" };
    } catch (error) {
        console.error("Error al eliminar like: ", error);
        return Promise.reject(error);
    }
}

export default darLike
export {quitarLike}