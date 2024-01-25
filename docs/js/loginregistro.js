import {
    getUsuarios,
    saveUser
} from "./firebase.js"

// Seleccionar elementos del DOM
const formLogin = document.getElementById('formLogin')
const formRegistro = document.getElementById('formRegistro')
const errorText = document.getElementById('errorText')
const vaciosText = document.getElementById('vaciosText')

// Evento de escucha para el formulario de inicio de sesión
formLogin['loginBtn'].addEventListener('click', async (e) => {
    e.preventDefault()
    errorText.style.display = 'none'
    errorText.innerHTML = ''

    try {
        // Obtener usuarios de la base de datos
        const usuarios = await getUsuarios()
        let usuarioEncontrado = false

        // Verificar si los campos de inicio de sesión están vacíos
        if (formLogin['loginUsername'].value === "" || formLogin['loginPassword'].value === "") {
            errorText.innerHTML = 'Rellene los campos.'
            errorText.style.display = 'block'
            return
        }

        // Verificar si las credenciales proporcionadas coinciden con algún usuario
        usuarios.forEach((el) => {
            const usuario = el.data()
            if (usuario.username === formLogin['loginUsername'].value && usuario.password === formLogin['loginPassword'].value) {
                localStorage.setItem('id', el.id)
                localStorage.setItem('username', usuario.username)
                // Redirigir a la página "inicio.html" si las credenciales son correctas
                window.location.href = "./vista/inicio.html"
                usuarioEncontrado = true
            }
        })

        // Mostrar mensaje de error si las credenciales son incorrectas
        if (!usuarioEncontrado) {
            errorText.innerHTML = 'Credenciales incorrectas.'
            errorText.style.display = 'block'
        }
    } catch (e) {
        console.log(e)
    }
})

// Evento de escucha para el formulario de registro
formRegistro['registroBtn'].addEventListener('click', async (e) => {
    e.preventDefault()
    vaciosText.style.display = 'none'
    vaciosText.innerHTML = ""

    try {
        // Obtener usuarios de la base de datos
        const usuarios = await getUsuarios()

        let usuarioExistente = false

        // Verificar la existencia de un usuario y campos de registro vacíos
        usuarios.forEach((el) => {
            const usuario = el.data()

            if (formRegistro['user'].value === "" || formRegistro['pswd'].value === "") {
                usuarioExistente = true
                vaciosText.style.display = 'block'
                vaciosText.innerHTML = 'Rellene los campos.'
                return
            }
            if (usuario.username === formRegistro['user'].value) {
                usuarioExistente = true
                vaciosText.style.display = 'block'
                vaciosText.innerHTML = 'Usuario existente.'
                return
            }
        })

        // Guardar un nuevo usuario si no existe previamente
        if (!usuarioExistente) {
             saveUser({
                username: formRegistro['user'].value,
                password: formRegistro['pswd'].value
            })
            formRegistro['user'].value = ''
            formRegistro['pswd'].value = ''
            alert('Usuario registrado correctamente')
        }
    } catch (e) {
        console.error(e)
    }
})
