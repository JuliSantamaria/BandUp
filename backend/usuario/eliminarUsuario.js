import appFirebase from '../../credenciales';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

async function eliminarUsuario(idUsuario) {
    try {
        const db = getFirestore(appFirebase);
        const usuarioRef = doc(db, 'usuarios', idUsuario);
        await deleteDoc(usuarioRef);
        return true;
    } catch (error) {
        console.error("Error al eliminar usuario: ", error);
        return Promise.reject(error);
    }
}

export default eliminarUsuario;