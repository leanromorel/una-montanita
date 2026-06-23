import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { productos, type Producto } from '@/data/productos';

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

export type Usuario = { nombre: string; telefono: string };

type StoreContextValue = {
  usuario: Usuario | null;
  login: (nombre: string, telefono: string) => void;
  logout: () => void;

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
  confirmarPedido: (metodoPago: MetodoPago, entrega: Entrega) => Pedido | null;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function pedidoSeed(): Pedido {
  const items: CartItem[] = [
    { producto: productos[0], cantidad: 2 },
    { producto: productos[3], cantidad: 1 },
  ];
  const total = items.reduce((acc, it) => acc + it.producto.precio * it.cantidad, 0);
  return {
    id: 'P-1001',
    fecha: '12/06/2026',
    items,
    total,
    metodoPago: 'Transferencia',
    entrega: 'Envío a domicilio',
    estado: 'Entregado',
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([pedidoSeed()]);

  function login(nombre: string, telefono: string) {
    setUsuario({ nombre, telefono });
  }

  function logout() {
    setUsuario(null);
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

  function confirmarPedido(metodoPago: MetodoPago, entrega: Entrega): Pedido | null {
    if (carrito.length === 0) return null;
    const total = carrito.reduce((acc, it) => acc + it.producto.precio * it.cantidad, 0);
    const nuevoPedido: Pedido = {
      id: `P-${1000 + pedidos.length + 1}`,
      fecha: new Date().toLocaleDateString('es-AR'),
      items: carrito,
      total,
      metodoPago,
      entrega,
      estado: 'Pendiente',
    };
    setPedidos((prev) => [nuevoPedido, ...prev]);
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
    login,
    logout,
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
