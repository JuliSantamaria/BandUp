import appFirebase, { auth } from '../../credenciales';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

function obtenerImagenes() {
    const user = auth.currentUser;
    if (user) {
        const db = getFirestore(appFirebase);
        const anunciosRef = collection(db, 'anuncios');
        const q = query(anunciosRef, where('userId', '==', user.uid));
        return getDocs(q).then((querySnapshot) => {
            const imagenes = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.images) {
                    imagenes.push(...data.images);
                }
            });
            return imagenes;
        }).catch((error) => {
            console.error('Error al obtener las imÃ¡genes: ', error);
            return Promise.reject(error);
        });
    } else {
        console.error('No hay un usuario autenticado.');
        return Promise.reject('No hay un usuario autenticado.');
    }
}

export { obtenerImagenes }