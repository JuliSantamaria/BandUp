import { Firestore } from "firebase/firestore"
import { db } from '../../credenciales';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { et } from "date-fns/locale/et";

async function obtenerAnunciosPorTitulo(titulo, anunciosRef) {
    const q = query(anunciosRef, 
        where('titulo', '>=', titulo),
        where('titulo', '<=', titulo + '\uf8ff')
    );
    return getDocs(q);
}

async function obtenerAnunciosPorLocalizacion(localizacion, anunciosRef) {
    const q = query(anunciosRef, 
        where('location', '==', localizacion)
    );
    return getDocs(q);
}

async function filtrarAnunciosPorLocalizacion(anuncios, localizacion) {
    let anunciosFiltrados = [];
    anuncios.forEach((anuncio) => {
        if (anuncio.location === localizacion) {
            anunciosFiltrados.push(anuncio);
        }
    });
    return anunciosFiltrados;
}

function extraerEtiquetasDeAnuncio(anuncio) {
    let etiquetas = [];
    anuncio.etiquetas.experiencia.forEach((etiqueta) => {
        etiquetas.push(etiqueta);
    });
    anuncio.etiquetas.generos.forEach((etiqueta) => {
        etiquetas.push(etiqueta);
    });
    anuncio.etiquetas.instrumentos.forEach((etiqueta) => {
        etiquetas.push(etiqueta);
    });
    return etiquetas;

}

function extraerEtiquetasDeEtiquetasParametro(etiquetas) {
    let etiquetasRetorno = [];
    etiquetas.experiencia && etiquetas.experiencia.forEach((etiqueta) => {
        etiquetasRetorno.push(etiqueta);
    });
    etiquetas.generos && etiquetas.generos.forEach((etiqueta) => {
        etiquetasRetorno.push(etiqueta);
    });
    etiquetas.instrumentos && etiquetas.instrumentos.forEach((etiqueta) => {
        etiquetasRetorno.push(etiqueta);
    });
    return etiquetasRetorno;
}

async function obtenerAnunciosPorEtiquetas(selectedEtiquetas, anunciosRef) {
    let anunciosRetorno = [];
    const querySnapshot = await getDocs(anunciosRef);

    querySnapshot.forEach((doc) => {
        let anuncio = doc.data();
        let anuncioValido = true;

        // Iterar sobre cada categoría en selectedEtiquetas
        for (let categoria in selectedEtiquetas) {
            let etiquetasSeleccionadas = selectedEtiquetas[categoria];
            let etiquetasAnuncio = anuncio.etiquetas[categoria] || [];

            // Verificar si al menos una etiqueta seleccionada está presente en las etiquetas del anuncio
            if (etiquetasSeleccionadas.length > 0) {
                let etiquetaEncontrada = etiquetasSeleccionadas.some(etiqueta => etiquetasAnuncio.includes(etiqueta));
                if (!etiquetaEncontrada) {
                    anuncioValido = false;
                    break;
                }
            }
        }

        if (anuncioValido) {
            anunciosRetorno.push(anuncio);
        }
    });

    return anunciosRetorno;
}


async function obtenerAnuncios(searchTerm, location, etiquetas) {
    let anunciosRetorno = [];
    const anunciosRef = collection(db, 'anuncios');

    if (searchTerm !== "") {
        console.log("Buscando anuncios por título...");
        const querySnapshot = await obtenerAnunciosPorTitulo(searchTerm, anunciosRef);
        querySnapshot.forEach((doc) => {
            anunciosRetorno.push(doc.data());
        });

        if (location !== "") {
            console.log("Filtrando anuncios por localización...");
            anunciosRetorno = await filtrarAnunciosPorLocalizacion(anunciosRetorno, location);

            let etiquetasExtraidas = extraerEtiquetasDeEtiquetasParametro(etiquetas);
            if (etiquetasExtraidas.length > 0) {
                console.log("Filtrando anuncios por etiquetas...");
                let anunciosFiltrados = [];
                anunciosRetorno.forEach((anuncio) => {
                    let etiquetasAnuncio = extraerEtiquetasDeAnuncio(anuncio);
                    let anuncioValido = etiquetasExtraidas.every(etiqueta => etiquetasAnuncio.includes(etiqueta));
                    if (anuncioValido) {                        
                        anunciosFiltrados.push(anuncio);
                    }
                });
                anunciosRetorno = anunciosFiltrados;
            }
            
        } else if (extraerEtiquetasDeEtiquetasParametro(etiquetas).length > 0) {
            etiquetasExtraidas = extraerEtiquetasDeEtiquetasParametro(etiquetas);
            console.log("Filtrando anuncios por etiquetas...");
                let anunciosFiltrados = [];
                anunciosRetorno.forEach((anuncio) => {
                    let etiquetasAnuncio = extraerEtiquetasDeAnuncio(anuncio);
                    let anuncioValido = etiquetasExtraidas.every(etiqueta => etiquetasAnuncio.includes(etiqueta));
                    if (anuncioValido) {                        
                        anunciosFiltrados.push(anuncio);
                    }
                });
                anunciosRetorno = anunciosFiltrados;

        }

    } else if (location !== "") {
        console.log("Buscando anuncios por localización...");
        const querySnapshot = await obtenerAnunciosPorLocalizacion(location, anunciosRef);
        querySnapshot.forEach((doc) => {
            anunciosRetorno.push(doc.data());
        });

        let etiquetasExtraidas = extraerEtiquetasDeEtiquetasParametro(etiquetas);
        if (etiquetasExtraidas.length > 0) {
            console.log("Filtrando anuncios por etiquetas...");
            let anunciosFiltrados = [];
            let etiquetasExtraidas = extraerEtiquetasDeEtiquetasParametro(etiquetas);
            anunciosRetorno.forEach((anuncio) => {
                let etiquetasAnuncio = extraerEtiquetasDeAnuncio(anuncio);
                let anuncioValido = etiquetasExtraidas.every(etiqueta => etiquetasAnuncio.includes(etiqueta));
                if (anuncioValido) {
                    anunciosFiltrados.push(anuncio);
                }
            });
            anunciosRetorno = anunciosFiltrados;
        }
    
    } else if (extraerEtiquetasDeEtiquetasParametro(etiquetas).length > 0) {
        console.log("Buscando anuncios por etiquetas...");
        anunciosRetorno = await obtenerAnunciosPorEtiquetas(etiquetas, anunciosRef)

    
        
    } else {
        console.log("No se especificó ningún criterio de búsqueda...");
        const querySnapshot = await getDocs(anunciosRef);
        querySnapshot.forEach((doc) => {
            anunciosRetorno.push(doc.data());
        });
    }

    console.log("Motor de busqueda V2: ", anunciosRetorno);
    return anunciosRetorno; // Devuelve los resultados para que puedan ser utilizados posteriormente
}

export { obtenerAnuncios }