import appFirebase from '../../credenciales';
import { auth } from '../../credenciales';
import { getFirestore, doc, getDoc, addDoc, collection, getDocs, where, query, updateDoc, orderBy } from 'firebase/firestore';

async function notificacionPorLike(destinatario) {
    const db = getFirestore(appFirebase);
    const notificacionesRef = collection(db, 'notificaciones');
    try {
        let uid = auth.currentUser.uid;
        await addDoc(notificacionesRef, {
            mensaje: 'Le dio like a tu anuncio.',
            emisor: uid,
            destinatario: destinatario,
            fecha: new Date(),
            visto: '1'
        });
        console.log('Notificación de like enviada con éxito');
    } catch (error) {
        console.error('Error al enviar notificación de like:', error);
    }
}

async function notificacionPorComentario(destinatario, mensaje) {
    const db = getFirestore(appFirebase);
    const notificacionesRef = collection(db, 'notificaciones');
    try {
        let uid = auth.currentUser.uid;
        await addDoc(notificacionesRef, {
            mensaje: `Comentó '${mensaje.texto}' en tu anuncio.`,
            emisor: uid,
            destinatario: destinatario,
            fecha: new Date(),
            visto: '1'
        });
        console.log('Notificación de comentario enviada con éxito');
    } catch (error) {
        console.error('Error al enviar notificación de comentario:', error);
    }
}

async function obtenerNotificaciones() {
    const db = getFirestore(appFirebase);
    const notificacionesRef = collection(db, 'notificaciones');
    try {
        const notificaciones = [];
        const q = query(notificacionesRef, where('destinatario', '==', auth.currentUser.uid), orderBy('fecha', 'desc')); // Por testeo, cambiar a destinatario
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            notificaciones.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log('Notificaciones:', notificaciones);
        return notificaciones;
    } catch (error) {
        console.error('Error obteniendo notificaciones:', error);
        return [];
    }

}

async function marcarNotificacionComoVista(notificacionId) {
    const db = getFirestore(appFirebase);
    const notificacionRef = doc(db, 'notificaciones', notificacionId);

    try {
        await updateDoc(notificacionRef, {
            visto: '0'
        });
        console.log('Notificación marcada como vista correctamente.');
    } catch (error) {
        console.error('Error al marcar notificación como vista:', error);
        throw error; // Opcional: propagar el error para manejarlo en el componente que llame a esta función
    }
}


export {notificacionPorLike, notificacionPorComentario, obtenerNotificaciones, marcarNotificacionComoVista};