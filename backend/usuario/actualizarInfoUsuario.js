import appFirebase from '../../credenciales';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

async function actualizarInfoUsuario(idUsuario, nuevaInfo) {
    try {
        const db = getFirestore(appFirebase);
        const usuarioRef = doc(db, 'usuarios', idUsuario);
        await updateDoc(usuarioRef, nuevaInfo);
        return true;
    } catch (error) {
        console.error("Error al actualizar información del usuario: ", error);
        return Promise.reject(error);
    }
}

export default actualizarInfoUsuario;