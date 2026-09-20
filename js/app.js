let personajes = [];

const contenedor = document.querySelector("#personajes");
const inputNombre = document.querySelector("#nombre");
const selectEstado = document.querySelector("#estado");
const selectEspecie = document.querySelector("#especie");
const selectGenero = document.querySelector("#genero");
const selectOrden = document.querySelector("#orden");
const cantidad = document.querySelector("#cantidad");
const vivos = document.querySelector("#vivos");
const muertos = document.querySelector("#muertos");
const desconocidos = document.querySelector("#desconocidos");
const buscarId = document.querySelector("#buscarId");
const botonBuscar = document.querySelector("#botonBuscar");
const hayVivos = document.querySelector("#hayVivos");
const todosDesconocidos = document.querySelector("#todosDesconocidos");

async function obtenerPersonajes() {
    const conexion = await fetch("https://rickandmortyapi.com/api/character");
    const respuesta = await conexion.json();
    personajes = respuesta.results;
    mostrarPersonajes(personajes);
    calcularEstadisticas(personajes);
    verificarVivos(personajes);
    verificarDesconocidos(personajes);
}

function mostrarPersonajes(lista) {
    contenedor.innerHTML = "";
    lista.map(personaje => {
        contenedor.innerHTML += `
        <div>
            <img src="${personaje.image}" alt="${personaje.name}">
            <h3>${personaje.name}</h3>
            <p>ID: ${personaje.id}</p>
            <p>Estado: ${personaje.status}</p>
            <p>Especie: ${personaje.species}</p>
            <p>Género: ${personaje.gender}</p>
        </div>
        `;
    });
}

function filtrarPersonajes() {
    let resultado = personajes;
    resultado = resultado.filter(item => item.name.toLowerCase().includes(inputNombre.value.toLowerCase()));
    resultado = resultado.filter(item => selectEstado.value === "" || item.status === selectEstado.value);
    resultado = resultado.filter(item => selectEspecie.value === "" || item.species === selectEspecie.value);
    resultado = resultado.filter(item => selectGenero.value === "" || item.gender === selectGenero.value);
    return resultado;
}

function ordenarPersonajes(lista) {
    if (selectOrden.value === "az") {
        lista.sort((a,b) => a.name.localeCompare(b.name));
    }
    if (selectOrden.value === "za") {
        lista.sort((a,b) => b.name.localeCompare(a.name));
    }
    return lista;
}

function calcularEstadisticas(lista) {
    const estadisticas = lista.reduce((contador, personaje) => {
        if (personaje.status === "Alive") {
            contador.vivos++;
        }
        if (personaje.status === "Dead") {
            contador.muertos++;
        }
        if (personaje.status === "unknown") {
            contador.desconocidos++;
        }
        return contador;
    },{
        vivos: 0,
        muertos: 0,
        desconocidos: 0
    });
    cantidad.textContent = `Resultados: ${lista.length}`;
    vivos.textContent =`Vivos: ${estadisticas.vivos}`;
    muertos.textContent = `Muertos: ${estadisticas.muertos}`;
    desconocidos.textContent = `Desconocidos: ${estadisticas.desconocidos}`;
}

function buscarPersonajeId() {
    const id = Number(buscarId.value);
    const personaje = personajes.find(item => item.id === id);
    if (personaje) {
        mostrarPersonajes([personaje]);
    }else {
        contenedor.innerHTML ="<p>No se encontró ningún personaje.</p>";
    }
}

function verificarVivos(lista) {
    const existenVivos = lista.some(item => item.status === "Alive");
    if (existenVivos) {
        hayVivos.textContent = "Sí hay al menos un personaje vivo en nuestra base de datos."
    } else {
        hayVivos.textContent = "No hay personajes vivos en nuestra base de datos.";
    }
}

function verificarDesconocidos(lista) {
    const desconocidos = lista.every(item => item.status === "unknown");
    if(desconocidos){
        todosDesconocidos.textContent = "Todos los personajes de la serie tienen un estado desconocido.";
    } else {
        todosDesconocidos.textContent = "No todos los personajes de la serie tienen un estado desconocido.";
    }
}

function actualizarVista() {
    let resultado = filtrarPersonajes();
    resultado = ordenarPersonajes(resultado);
    resultado = calcularEstadisticas(resultado);
    verificarVivos(resultado);
    verificarDesconocidos(resultado);
    mostrarPersonajes(resultado);
}

inputNombre.addEventListener("input", actualizarVista);
selectEstado.addEventListener("change", actualizarVista);
selectEspecie.addEventListener("change", actualizarVista);
selectGenero.addEventListener("change", actualizarVista);
selectOrden.addEventListener("change", actualizarVista);
botonBuscar.addEventListener("click", buscarPersonajeId);

obtenerPersonajes();