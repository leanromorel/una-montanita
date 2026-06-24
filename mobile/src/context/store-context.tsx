import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { productos, type Producto } from '@/data/productos';
import { auth, db } from '@/lib/firebase';

function fotoKey(uid: string) {
  return `foto-perfil-${uid}`;
}

export type CartItem = { producto: Producto; cantidad: number };

export type MetodoPago = 'Mercado Pago' | 'Transferencia';
export type Entrega = 'Envío a domicilio' | 'Retiro en local';
export type EstadoPedido = 'Pendiente' | 'Confirmado' | 'En preparación' | 'Enviado' | 'Entregado';

export type Pedido = {
  id: string;
  fecha: string;
  items: CartItem[];
  total: number;
  metodoPago: MetodoPago;
  entrega: Entrega;
  estado: EstadoPedido;
};

export type Usuario = { uid: string; nombre: string; telefono: string; email: string; foto?: string };

type StoreContextValue = {
  usuario: Usuario | null;
  cargandoSesion: boolean;
  registrarse: (nombre: string, telefono: string, email: string, password: string) => Promise<string | null>;
  ingresar: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  actualizarFoto: (uri: string) => Promise<void>;
  actualizarEmail: (email: string) => void;

  notificacionesActivas: boolean;
  setNotificacionesActivas: (activas: boolean) => void;

  productos: Producto[];

  carrito: CartItem[];
  agregarAlCarrito: (productoId: number) => void;
  cambiarCantidad: (productoId: number, delta: number) => void;
  vaciarCarrito: () => void;
  totalCarrito: number;
  cantidadCarrito: number;

  pedidos: Pedido[];
  ultimoPedido: Pedido | undefined;
  repetirUltimoPedido: () => void;
  confirmarPedido: (metodoPago: MetodoPago, entrega: Entrega) => Promise<Pedido | null>;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function traducirErrorAuth(codigo: string): string {
  switch (codigo) {
    case 'auth/email-already-in-use':
      return 'Ese email ya está registrado. Probá ingresar en vez de registrarte.';
    case 'auth/invalid-email':
      return 'El email no es válido.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email o contraseña incorrectos.';
    default:
      return 'Ocurrió un error. Probá de nuevo.';
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [notificacionesActivas, setNotificacionesActivasState] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUsuario(null);
        setPedidos([]);
        setCargandoSesion(false);
        return;
      }
      const snap = await getDoc(doc(db, 'usuarios', firebaseUser.uid));
      const datos = snap.data();
      const foto = (await AsyncStorage.getItem(fotoKey(firebaseUser.uid))) ?? undefined;
      setUsuario({
        uid: firebaseUser.uid,
        nombre: datos?.nombre ?? '',
        telefono: datos?.telefono ?? '',
        email: firebaseUser.email ?? '',
        foto,
      });
      setNotificacionesActivasState(datos?.notificacionesActivas ?? false);
      setCargandoSesion(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!usuario) return;
    const q = query(
      collection(db, 'pedidos'),
      where('uid', '==', usuario.uid),
      orderBy('creadoEn', 'desc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setPedidos(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: data.numero,
            fecha: data.fecha,
            items: data.items,
            total: data.total,
            metodoPago: data.metodoPago,
            entrega: data.entrega,
            estado: data.estado,
          } as Pedido;
        }),
      );
    });
    return unsub;
  }, [usuario?.uid]);

  async function registrarse(
    nombre: string,
    telefono: string,
    email: string,
    password: string,
  ): Promise<string | null> {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'usuarios', cred.user.uid), {
        nombre,
        telefono,
        notificacionesActivas: false,
      });
      return null;
    } catch (e: any) {
      return traducirErrorAuth(e?.code ?? '');
    }
  }

  async function ingresar(email: string, password: string): Promise<string | null> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (e: any) {
      return traducirErrorAuth(e?.code ?? '');
    }
  }

  function logout() {
    signOut(auth);
  }

  async function actualizarFoto(uri: string) {
    if (!usuario) return;
    await AsyncStorage.setItem(fotoKey(usuario.uid), uri);
    setUsuario((prev) => (prev ? { ...prev, foto: uri } : prev));
  }

  function actualizarEmail(email: string) {
    // El email de inicio de sesión no se cambia desde aquí: queda fijo al registrarse.
  }

  function setNotificacionesActivas(activas: boolean) {
    setNotificacionesActivasState(activas);
    if (usuario) {
      updateDoc(doc(db, 'usuarios', usuario.uid), { notificacionesActivas: activas });
    }
  }

  function agregarAlCarrito(productoId: number) {
    setCarrito((prev) => {
      const existe = prev.find((it) => it.producto.id === productoId);
      if (existe) {
        return prev.map((it) =>
          it.producto.id === productoId ? { ...it, cantidad: it.cantidad + 1 } : it,
        );
      }
      const producto = productos.find((p) => p.id === productoId);
      if (!producto) return prev;
      return [...prev, { producto, cantidad: 1 }];
    });
  }

  function cambiarCantidad(productoId: number, delta: number) {
    setCarrito((prev) =>
      prev
        .map((it) =>
          it.producto.id === productoId ? { ...it, cantidad: it.cantidad + delta } : it,
        )
        .filter((it) => it.cantidad > 0),
    );
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  function repetirUltimoPedido() {
    const ultimo = pedidos[0];
    if (!ultimo) return;
    setCarrito(ultimo.items.map((it) => ({ ...it })));
  }

  async function confirmarPedido(metodoPago: MetodoPago, entrega: Entrega): Promise<Pedido | null> {
    if (carrito.length === 0 || !usuario) return null;
    const total = carrito.reduce((acc, it) => acc + it.producto.precio * it.cantidad, 0);
    const numero = `P-${1000 + pedidos.length + 1}`;
    const fecha = new Date().toLocaleDateString('es-AR');
    await addDoc(collection(db, 'pedidos'), {
      uid: usuario.uid,
      numero,
      fecha,
      items: carrito,
      total,
      metodoPago,
      entrega,
      estado: 'Pendiente',
      creadoEn: Date.now(),
    });
    const nuevoPedido: Pedido = { id: numero, fecha, items: carrito, total, metodoPago, entrega, estado: 'Pendiente' };
    setCarrito([]);
    return nuevoPedido;
  }

  const totalCarrito = useMemo(
    () => carrito.reduce((acc, it) => acc + it.producto.precio * it.cantidad, 0),
    [carrito],
  );
  const cantidadCarrito = useMemo(
    () => carrito.reduce((acc, it) => acc + it.cantidad, 0),
    [carrito],
  );

  const value: StoreContextValue = {
    usuario,
    cargandoSesion,
    registrarse,
    ingresar,
    logout,
    actualizarFoto,
    actualizarEmail,
    notificacionesActivas,
    setNotificacionesActivas,
    productos,
    carrito,
    agregarAlCarrito,
    cambiarCantidad,
    vaciarCarrito,
    totalCarrito,
    cantidadCarrito,
    pedidos,
    ultimoPedido: pedidos[0],
    repetirUltimoPedido,
    confirmarPedido,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore debe usarse dentro de <StoreProvider>');
  return ctx;
}
