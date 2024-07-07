import appFirebase from '../../credenciales';
import { getFirestore, getDoc, doc} from 'firebase/firestore';

async function obtenerInfoDeUsuarioPorId(userId) {
    try {
        const db = getFirestore(appFirebase);
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          return userDoc.data();
        } else {
          console.log('No existe el usuario con ID:', userId);
          return null;
        }
      } catch (error) {
        console.error('Error obteniendo usuario:', error);
        return null;
      }
}

export default obtenerInfoDeUsuarioPorId;