import {
    getDispositivo,
    updateDispositivo
}
from "./firebase.js";

// Obtener la URL actual
const urlActual = window.location.href;
// Crear un objeto URL
const url = new URL(urlActual);
// Obtener el parámetro 'id' de la URL
const id = url.searchParams.get("id");
const divDispositivo = document.getElementById('dispositivoDiv')
getDispositivo(id,(datos)=>{
    divDispositivo.innerHTML=''
    const divDispo = document.createElement('div')
    if(datos.data().tipo=='Sensor'){
        divDispo.innerHTML=`
        <h1>${datos.data().name} (${datos.data().tipo})</h1>
        <div class="input-wrapper">
            <input type="text" class="inputMedida" value="${datos.data().medida}" />
            <span>${datos.data().unidad}</span>
        </div>
        <input type="button" class="btnEditarMedida" value="Cambiar" />
        `
    }
    if(datos.data().tipo=='Ejecutor'){
        divDispo.innerHTML=`
        <h1>${datos.data().name} (${datos.data().tipo})</h1>
        <div class="switch">
            <input class="form-check-input btnCambioEstado" type="checkbox" id="customSwitch" ${datos.data().estado ? 'checked' : ''}>
            <label class="slider" for="customSwitch"></label>
        </div>
        <div id="estadoText">${datos.data().estado ? 'ON' : 'OFF'}</div>
        `
    }
    const btnCambioEstado = divDispo.querySelector(".btnCambioEstado")
    if (btnCambioEstado) {
        btnCambioEstado.addEventListener('change', () => cambiarEstadoDispositivo(datos.id, btnCambioEstado.checked))
    }

    const btnEditarMedida = divDispo.querySelector('.btnEditarMedida')
                if (btnEditarMedida) {
                    btnEditarMedida.addEventListener('click', () => {
                        const inputMedida = divDispositivo.querySelector('.inputMedida')
                        if (inputMedida) {
                            updateDispositivo(datos.id, { medida: inputMedida.value })
                        }
                    })
                }

    divDispositivo.append(divDispo)
})

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
