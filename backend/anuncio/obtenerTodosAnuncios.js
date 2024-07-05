import appFirebase from '../../credenciales';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

async function obtenerTodosAnuncios(filtros) {
    try {
        const db = getFirestore(appFirebase);
        const anunciosRef = collection(db, 'anuncios');
        let q = query(anunciosRef);

        // Aplicar filtros si existen
        if (filtros) {
            for (const [key, values] of Object.entries(filtros)) {
                if (values.length > 0) {
                    q = query(q, where(key, 'array-contains-any', values));
                }
            }
        }

        return await getDocs(q).then((querySnapshot) => {
            const resultados = [];
            querySnapshot.forEach((doc) => {
                resultados.push({ id: doc.id, ...doc.data() });
            });
            return resultados;
        }).catch((error) => {
            console.error("Error al obtener anuncios: ", error);
            return Promise.reject(error);
        });
    } catch (error) {
        console.error("Error al inicializar Firestore o crear la consulta: ", error);
        return Promise.reject(error);
    }
}

export default obtenerTodosAnuncios;
