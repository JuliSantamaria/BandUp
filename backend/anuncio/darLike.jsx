import appFirebase from '../../credenciales';
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';

async function darLike(id) {
    try {
        const db = getFirestore(appFirebase);
        const anuncioRef = doc(db, 'anuncios', id);

        await updateDoc(anuncioRef, {
            likes: increment(1)
        });

        return { message: "Like añadido con éxito" };
    } catch (error) {
        console.error("Error al añadir like: ", error);
        return Promise.reject(error);
    }
}

export default darLike