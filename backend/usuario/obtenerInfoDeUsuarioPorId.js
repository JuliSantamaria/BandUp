import appFirebase from '../../util/conexion';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

async function obtenerInfoDeUsuarioPorId(idUsuario) {
    try {
        const db = getFirestore(appFirebase);
        const usuariosRef = collection(db, 'usuarios');
        const q = query(usuariosRef, where('idUsuario', '==', idUsuario));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No existe el usuario con el ID proporcionado");
            return null;
        }

        const usuarioDoc = querySnapshot.docs[0];
        console.log('Documento del usuario:', usuarioDoc);
        return usuarioDoc.data();
    } catch (error) {
        console.error("Error al inicializar Firestore o crear la consulta: ", error);
        return Promise.reject(error);
    }
}

export default obtenerInfoDeUsuarioPorId;