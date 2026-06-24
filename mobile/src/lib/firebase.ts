import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Nota: desde Firebase JS SDK v11+, en React Native la sesión persiste
// automáticamente usando AsyncStorage si el paquete está instalado
// (@react-native-async-storage/async-storage), sin pasos adicionales.
const firebaseConfig = {
  apiKey: 'AIzaSyDOnl8UbbzmKSM_iesGxufmfxcmrcidJzw',
  authDomain: 'una-montanita.firebaseapp.com',
  projectId: 'una-montanita',
  storageBucket: 'una-montanita.firebasestorage.app',
  messagingSenderId: '330284307816',
  appId: '1:330284307816:web:5efac891b45e278167f2dd',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
