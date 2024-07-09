import appFirebase, { auth } from '../../credenciales';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';

async function escribirResenia(id, message) {
    try {
        const db = getFirestore(appFirebase);
        const anuncioRef = doc(db, 'users', id);
        let uid = auth.currentUser.uid;
        await updateDoc(anuncioRef, {
            resenias: arrayUnion({autor: uid, message: message})
        });

        return { message: "Reseña añadida con éxito" };
    } catch (error) {
        console.error("Error al añadir reseña: ", error);
        return Promise.reject(error);
    }
}

export { escribirResenia }