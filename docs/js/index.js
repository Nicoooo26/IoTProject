import {
    saveEspacio,
    getEspacios,
    deleteEspacio,
    saveDispositivo,
    getDispositivos,
    deleteDispositivo,
    updateEspacio,
    updateDispositivo
} from "./firebase.js"

// Obtener datos del usuario almacenados en el localStorage
const user = localStorage.getItem('username')
const idUsuario = localStorage.getItem('id')

// Elementos del DOM
const logOut = document.getElementById('logOut')
const bienvenida = document.getElementById('bienvenida')
const formEspacio = document.getElementById('formEspacio')
const espaciosSitio = document.getElementById('espaciosSitio')
const formEjecutor = document.getElementById('formEjecutor')
const formSensor = document.getElementById('formSensor')
const formEditarEspacio = document.getElementById('formEditarEspacio')
const formEditarDispositivo = document.getElementById('formEditarDispositivo')

// Evento de cierre de sesión
logOut.addEventListener('click', () => {
    localStorage.clear()
    window.location.href = '../index.html'
})

// Evento al cargar la página
window.addEventListener('DOMContentLoaded', async () => {
    bienvenida.innerHTML = `Bienvenido ${user}`
    try {
        // Obtener y mostrar espacios del usuario
        await getEspacios(idUsuario, espaciosGenerador)
    } catch (e) {
        console.log(e)
    }
})

// Evento para crear un nuevo espacio
formEspacio['crearEspacio'].addEventListener('click', (e) => {
    e.preventDefault()
    // Validar si el nombre del espacio está vacío
    if (formEspacio['nombreEspacio'].value === '') {
        document.getElementById('espacioVacio').style.display = 'block'
        setTimeout(() => {
            document.getElementById('espacioVacio').style.display = 'none'
        }, 2000)
    } else {
        try {
            // Guardar nuevo espacio en la base de datos
            saveEspacio({
                idUser: idUsuario,
                nameSpace: formEspacio['nombreEspacio'].value
            })

            alert('Espacio creado correctamente')
            formEspacio['nombreEspacio'].value = ''
        } catch (e) {
            console.log(e)
        }
    }
})

//Función para recorrer los espacios y mostrarlos.
const espaciosGenerador = (espaciosSnapshot) => {
    espaciosSitio.innerHTML = '' // Limpiar contenido existente

    espaciosSnapshot.forEach((el) => {
        const idEspacio = el.id

        // Crear elemento contenedor para el espacio
        const divEspacio = document.createElement('div')
        divEspacio.classList.add('espacio-container')

        // Crear el contenido HTML del espacio
        divEspacio.innerHTML = `
            <h1 class="nameSpace">${el.data().nameSpace}</h1>
            <p>${idEspacio}</p>
            <button class="btn btn-outline-primary anadirSensor" data-bs-toggle="modal" data-bs-target="#anadirSensorModal">Añadir sensor</button>
            <button class="btn btn-outline-primary anadirEjecutor" data-bs-toggle="modal" data-bs-target="#anadirEjecutorModal">Añadir ejecutor</button>
            <button class="btn btn-outline-danger eliminarEspacio"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
            </svg></button>
            <button class="btn btn-outline-warning editarEspacio" data-bs-toggle="modal" data-bs-target="#editarEspacioModal"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
            </svg></button>
            <button class="btn btn-outline-secondary" data-toggle="collapse" data-target="#dispositivos-${idEspacio}" aria-expanded="false" aria-controls="dispositivos-${idEspacio}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                </svg>
            </button>
            <div id="dispositivos-${idEspacio}" class="collapse">
            </div>
        `

        // Obtener elementos y asignar eventos
        const btnEliminarEspacio = divEspacio.querySelector('.eliminarEspacio')
        btnEliminarEspacio.addEventListener('click', () => eliminarEspacio(idEspacio))

        // Añadir espacio al contenedor principal
        espaciosSitio.appendChild(divEspacio)

        // Obtener dispositivos del espacio y mostrarlos
        getDispositivos(idEspacio, (dispositivos) => {
            const divDispositivos = divEspacio.querySelector(`#dispositivos-${idEspacio}`)
            divDispositivos.innerHTML = '' // Limpiar contenido existente

            dispositivos.forEach((dispositivo) => {
                const idDispositivo = dispositivo.id
                const divDispositivo = document.createElement('div')
                divDispositivo.classList.add('dispositivo-container')

                // Contenido HTML según el tipo de dispositivo
                let contenidoHTML = ''

                if (dispositivo.data().tipo === 'Sensor') {
                    contenidoHTML = `
                    <h2 id="tituloSensor">${dispositivo.data().name}</h2>
                    <div class="input-group mb-3">
                    <input type="text" class="form-control inputSensor" aria-label="Recipient's username" aria-describedby="button-addon2" value="${dispositivo.data().name}">
                    <button class="btnEditarSensor btn-outline-secondary" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg></button>
                    </div>
                    <p>${dispositivo.id}</p>
                    <p>${dispositivo.data().medida} ${dispositivo.data().unidad}</p>
                    <button class="btn btn-outline-danger eliminarDispositivo"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                    </svg></button>
                    <button class=" btn btn-outline-success PaginaNueva"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                    <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                  </svg></button>
                    `
                } else if (dispositivo.data().tipo === 'Ejecutor') {
                    const estado = dispositivo.data().estado

                    contenidoHTML = `
                        <h2 id="tituloEjecutor">${dispositivo.data().name}</h2>
                        <p>${dispositivo.id}</p>
                        <div class="form-check form-switch">
                        <input class="form-check-input btnCambioEstado" type="checkbox" id="customSwitch-${idDispositivo}" ${estado ? 'checked' : ''}>
                        <label class="form-check-label" for="customSwitch-${idDispositivo}">Última modificación: ${dispositivo.data().fecha}</label>
                        </div>
                        <button class="btn btn-outline-warning editar" data-bs-toggle="modal" data-bs-target="#editarDispositivoModal"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg></button>
                        <button class="btn btn-outline-danger eliminarDispositivo"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                        </svg></button>
                        <button class="btn btn-outline-success PaginaNueva"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                        <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                      </svg></button>
                    `
                }
                //Añadir dispositivos al div para dispositivos
                divDispositivo.innerHTML = contenidoHTML
                divDispositivos.appendChild(divDispositivo)
                //Evento click para cambiar nombre del sensor
                const btnEditarSensor = divDispositivo.querySelector('.btnEditarSensor')
                if (btnEditarSensor) {
                    btnEditarSensor.addEventListener('click', () => {
                        const inputSensor = divDispositivo.querySelector('.inputSensor')
                        if (inputSensor) {
                            updateDispositivo(idDispositivo, { name: inputSensor.value })
                        }
                    })
                }
                //Evento click para pasar el id al formulario
                const btnEditar = divDispositivo.querySelector('.editar')
                if (btnEditar) btnEditar.addEventListener('click', () => asignarID(formEditarDispositivo['editarDispositivo'], idDispositivo))
                //Si el input cambia se actualizan los datos
                const btnCambioEstado = divDispositivo.querySelector(".btnCambioEstado")
                if (btnCambioEstado) {
                    btnCambioEstado.addEventListener('change', () => cambiarEstadoDispositivo(idDispositivo, btnCambioEstado.checked))
                }
                //Evento click para eliminar el dispositivo
                const btnEliminarDispositivo = divDispositivo.querySelector('.eliminarDispositivo')
                btnEliminarDispositivo.addEventListener('click', () => eliminarDispositivo(idDispositivo))

                //Evento click para cambiar de aplicación.
                const btnPaginaNueva = divDispositivo.querySelector('.PaginaNueva')
                btnPaginaNueva.addEventListener('click',()=>reubicacionWeb(idDispositivo))
            })
        })
        //Evento click para pasar el id al formulario
        const btnAnadirSensor = divEspacio.querySelector('.anadirSensor')
        btnAnadirSensor.addEventListener('click', () => asignarID(formSensor['crearSensor'], idEspacio))
        //Evento click para pasar el id al formulario
        const btnAnadirEjecutor = divEspacio.querySelector('.anadirEjecutor')
        btnAnadirEjecutor.addEventListener('click', () => asignarID(formEjecutor['crearEjecutor'], idEspacio))
        //Evento click para pasar el id al formulario
        const btnEditarEspacio = divEspacio.querySelector('.editarEspacio')
        btnEditarEspacio.addEventListener('click', () => asignarID(formEditarEspacio['editarEspacio'], idEspacio))
    })
}

// Función que asigna un ID a un elemento del DOM mediante el atributo 'data-id'
const asignarID = (elemento, id) => {
    if (elemento) {
        elemento.dataset.id = id
    }
}

// Función para eliminar un dispositivo después de mostrar una confirmación al usuario
const eliminarDispositivo = (idDispositivo) => {
    try {
        const confirmacion = window.confirm('¿Seguro que deseas eliminar este dispositivo?')
        if (confirmacion) {
            deleteDispositivo(idDispositivo)
        }
    } catch (e) {
        console.error(e)
    }
}

// Evento para crear un ejecutor al hacer clic en el formulario correspondiente
formEjecutor['crearEjecutor'].addEventListener('click', (e) => {
    e.preventDefault()
    const idEspacio = e.target.dataset.id

    // Validar y guardar el ejecutor o mostrar un mensaje de error
    if (formEjecutor['nombreEjecutor'].value === '') {
        // Mostrar mensaje de error si el nombre del ejecutor está vacío
        document.getElementById('ejecutorVacio').style.display = 'block'
        setTimeout(() => {
            document.getElementById('ejecutorVacio').style.display = 'none'
        }, 2000)
    } else {
        guardarEjecutor(idEspacio)
        formEjecutor['nombreEjecutor'].value = ''
    }
})

// Evento para crear un sensor al hacer clic en el formulario correspondiente
formSensor['crearSensor'].addEventListener('click', (e) => {
    e.preventDefault()
    const idEspacio = e.target.dataset.id

    // Validar y guardar el sensor o mostrar un mensaje de error
    if (formSensor['nombreSensor'].value === '') {
        // Mostrar mensaje de error si el nombre del sensor está vacío
        document.getElementById('sensorVacio').style.display = 'block'
        setTimeout(() => {
            document.getElementById('sensorVacio').style.display = 'none'
        }, 2000)
    } else {
        guardarSensor(idEspacio)
        formSensor['nombreSensor'].value = ''
    }
})

// Evento para editar un espacio al hacer clic en el formulario correspondiente
formEditarEspacio['editarEspacio'].addEventListener('click', (e) => {
    e.preventDefault()
    const idEspacio = e.target.dataset.id

    // Validar y actualizar el nombre del espacio o mostrar un mensaje de error
    if (formEditarEspacio['nombreEspacioEditar'].value === '') {
        // Mostrar mensaje de error si el nombre del espacio está vacío
        document.getElementById('espacioVacioEditar').style.display = 'block'
        setTimeout(() => {
            document.getElementById('espacioVacioEditar').style.display = 'none'
        }, 2000)
    } else {
        updateEspacio(idEspacio, {
            nameSpace: formEditarEspacio['nombreEspacioEditar'].value
        })
        formEditarEspacio['nombreEspacioEditar'].value = ''
    }
})

// Evento para editar un dispositivo al hacer clic en el formulario correspondiente
formEditarDispositivo['editarDispositivo'].addEventListener('click', (e) => {
    e.preventDefault()
    const idDispositivo = e.target.dataset.id

    // Validar y actualizar el nombre del dispositivo o mostrar un mensaje de error
    if (formEditarDispositivo['nombreDispositivoEditar'].value === '') {
        // Mostrar mensaje de error si el nombre del dispositivo está vacío
        document.getElementById('dispositivoVacioEditar').style.display = 'block'
        setTimeout(() => {
            document.getElementById('dispositivoVacioEditar').style.display = 'none'
        }, 2000)
    } else {
        updateDispositivo(idDispositivo, {
            name: formEditarDispositivo['nombreDispositivoEditar'].value
        })
        formEditarDispositivo['nombreDispositivoEditar'].value = ''
    }
})

// Función para eliminar un espacio después de mostrar una confirmación al usuario
const eliminarEspacio = (id) => {
    try {
        const confirmacion = window.confirm('¿Seguro que deseas eliminar este espacio?\nSe eliminarán todos los dispositivos asociados')
        if (confirmacion) {
            deleteEspacio(id)
        }
    } catch (e) {
        console.error(e)
    }
}

// Función para guardar un ejecutor en un espacio específico
const guardarEjecutor = (id) => {
    try {
        saveDispositivo({
            idEspacio: id,
            estado: false,
            fecha: "-",
            name: formEjecutor['nombreEjecutor'].value,
            tipo: 'Ejecutor'
        })
        alert('Ejecutor creado correctamente')
    } catch (e) {
        console.log(e)
    }
}

// Función para guardar un sensor en un espacio específico
const guardarSensor = (id) => {
    try {
        saveDispositivo({
            idEspacio: id,
            medida:'-',
            unidad: formSensor['tamanoSensor'].value,
            name: formSensor['nombreSensor'].value,
            tipo: 'Sensor'
        })
        alert('Sensor creado correctamente')
    } catch (e) {
        console.log(e)
    }
}

// Función para cambiar el estado de un dispositivo y actualizar la fecha
const cambiarEstadoDispositivo = (idDispositivo, nuevoEstado) => {
    try {
        updateDispositivo(idDispositivo, {
            estado: nuevoEstado,
            fecha: obtenerFechaActual()
        })
    } catch (error) {
        console.error(error)
    }
}

// Función para obtener la fecha actual en formato UTC
const obtenerFechaActual = () => {
    const fechaActual = new Date()
    return fechaActual.toUTCString()
}

const reubicacionWeb = (id) => { 
    const baseURL = window.location.origin
    const url = baseURL+'/vista/dispositivosIOT.html?id='+id
    window.open(url,'_blank')
}
