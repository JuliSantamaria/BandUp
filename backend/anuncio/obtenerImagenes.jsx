import appFirebase, { auth } from '../../credenciales';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

async function obtenerImagenes(uid) {
    console.log("uid", uid)
    const user = uid;
    if (user) {
        const db = getFirestore(appFirebase);
        const anunciosRef = collection(db, 'anuncios');
        const q = query(anunciosRef, where('userId', '==', uid));
        try {
            const querySnapshot = await getDocs(q);
            const imagenes = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.images) {
                    imagenes.push(...data.images);
                }
            });
            return imagenes;
        } catch (error) {
            console.error('Error al obtener las imÃ¡genes: ', error);
            return await Promise.reject(error);
        }
    } else {
        console.error('No hay un usuario autenticado.');
        return Promise.reject('No hay un usuario autenticado.');
    }
}

export { obtenerImagenes }