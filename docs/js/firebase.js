// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js"

// Your web app's Firebase configuration
const firebaseConfig = {
  //Aquí añadimos los datos de API que nos ha asignado FireBase
  apiKey: "AIzaSyAw0ULm5TusczAtAfUnToiyKF9Ue9IQZBI",
  authDomain: "iotproyecto-af576.firebaseapp.com",
  databaseURL: "https://iotproyecto-af576-default-rtdb.firebaseio.com",
  projectId: "iotproyecto-af576",
  storageBucket: "iotproyecto-af576.appspot.com",
  messagingSenderId: "28462243686",
  appId: "1:28462243686:web:92096ab00e5c82d289f2a7"

}

//Conectamos con la base de datos
const app = initializeApp(firebaseConfig)
const db = getFirestore()

//CRUD
export const getUsuarios = () => getDocs(collection(db, 'Usuarios'))
export const saveUser = (objeto) => addDoc(collection(db, 'Usuarios'), objeto)

export const getEspacios = (idUsuario, callback) => onSnapshot(query(collection(db, 'Espacios'), where('idUser', '==', idUsuario)), callback)
export const saveEspacio = (objeto) => addDoc(collection(db, 'Espacios'), objeto)
export const deleteEspacio = async (id) => {
  const dispositivosQuerySnapshot = await getDocs(query(collection(db, 'Dispositivos'), where('idEspacio', '==', id)))
  dispositivosQuerySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref)
  })
  await deleteDoc(doc(db, 'Espacios', id))
}
export const updateEspacio = (id, objeto) => updateDoc(doc(db, 'Espacios', id), objeto)

export const saveDispositivo = (objeto) => addDoc(collection(db, 'Dispositivos'), objeto)
export const getDispositivos = (idEspacio, callback) => onSnapshot(query(collection(db, 'Dispositivos'), where('idEspacio', '==', idEspacio)), callback)
export const deleteDispositivo = (id) => deleteDoc(doc(db, 'Dispositivos', id))
export const updateDispositivo = (id, objeto) => updateDoc(doc(db, 'Dispositivos', id), objeto)
