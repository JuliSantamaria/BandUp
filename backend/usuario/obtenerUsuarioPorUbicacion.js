import appFirebase from '../../credenciales';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

async function obtenerUsuariosPorUbicacion(ubicacion) {
    try {
        const db = getFirestore(appFirebase);
        const usuariosRef = collection(db, 'usuarios');
        const q = query(usuariosRef, where('ubicacion', '==', ubicacion));

        return await getDocs(q).then((querySnapshot) => {
            const resultados = [];
            querySnapshot.forEach((doc) => {
                resultados.push({ id: doc.id, ...doc.data() });
            });
            return resultados;
        }).catch((error) => {
            console.error("Error al obtener usuarios por ubicación: ", error);
            return Promise.reject(error);
        });
    } catch (error) {
        console.error("Error al inicializar Firestore o crear la consulta: ", error);
        return Promise.reject(error);
    }
}

export default obtenerUsuariosPorUbicacion;