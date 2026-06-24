import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useStore, type EstadoPedido, type PedidoAdmin } from '@/context/store-context';

const SIGUIENTE_ESTADO: Record<EstadoPedido, EstadoPedido | null> = {
  Pendiente: 'Confirmado',
  Confirmado: 'En preparación',
  'En preparación': 'Enviado',
  Enviado: 'Entregado',
  Entregado: null,
};

function FilaPedido({
  pedido,
  onAvanzar,
}: {
  pedido: PedidoAdmin;
  onAvanzar: (docId: string, estado: EstadoPedido) => Promise<void>;
}) {
  const [avanzando, setAvanzando] = useState(false);
  const siguiente = SIGUIENTE_ESTADO[pedido.estado];

  async function handleAvanzar() {
    if (!siguiente) return;
    setAvanzando(true);
    await onAvanzar(pedido.docId, siguiente);
    setAvanzando(false);
  }

  return (
    <View style={styles.pedido}>
      <View style={styles.pedidoHeader}>
        <Text style={styles.pedidoId}>{pedido.id}</Text>
        <Text style={styles.pedidoEstado}>{pedido.estado}</Text>
      </View>
      <Text style={styles.pedidoCliente}>{pedido.clienteNombre || 'Cliente'}</Text>
      <Text style={styles.pedidoDato}>📱 {pedido.clienteTelefono}</Text>
      <Text style={styles.pedidoDato}>✉️ {pedido.clienteEmail}</Text>
      <Text style={styles.pedidoDato}>{pedido.fecha} · {pedido.metodoPago} · {pedido.entrega}</Text>
      {pedido.items.map((it) => (
        <Text key={it.producto.id} style={styles.pedidoItem}>
          {it.cantidad}x {it.producto.nombre}
        </Text>
      ))}
      <Text style={styles.pedidoTotal}>Total: ${pedido.total.toLocaleString('es-AR')}</Text>
      {siguiente && (
        <PrimaryButton
          title={avanzando ? 'Actualizando...' : `Marcar como "${siguiente}"`}
          onPress={handleAvanzar}
          disabled={avanzando}
        />
      )}
    </View>
  );
}

function FilaProducto({
  nombre,
  precioInicial,
  stockInicial,
  onGuardar,
}: {
  nombre: string;
  precioInicial: number;
  stockInicial: number;
  onGuardar: (precio: number, stock: number) => Promise<void>;
}) {
  const [precio, setPrecio] = useState(String(precioInicial));
  const [stock, setStock] = useState(String(stockInicial));
  const [guardando, setGuardando] = useState(false);

  async function handleGuardar() {
    setGuardando(true);
    await onGuardar(Number(precio) || 0, Number(stock) || 0);
    setGuardando(false);
  }

  return (
    <View style={styles.fila}>
      <Text style={styles.nombre}>{nombre}</Text>
      <View style={styles.campos}>
        <View style={styles.campo}>
          <Text style={styles.label}>Precio</Text>
          <TextInput
            style={styles.input}
            value={precio}
            onChangeText={setPrecio}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.campo}>
          <Text style={styles.label}>Stock</Text>
          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
          />
        </View>
      </View>
      <PrimaryButton
        title={guardando ? 'Guardando...' : 'Guardar'}
        onPress={handleGuardar}
        disabled={guardando}
      />
    </View>
  );
}

export default function AdminScreen() {
  const { esAdmin, productos, actualizarProducto, pedidosTodos, actualizarEstadoPedido } = useStore();

  if (!esAdmin) {
    return (
      <View style={styles.sinAcceso}>
        <Text style={styles.sinAccesoTexto}>No tenés acceso a esta pantalla.</Text>
      </View>
    );
  }

  const pendientes = pedidosTodos.filter((p) => p.estado !== 'Entregado');
  const entregados = pedidosTodos.filter((p) => p.estado === 'Entregado');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>
        Pedidos pendientes {pendientes.length > 0 ? `(${pendientes.length})` : ''}
      </Text>
      {pendientes.length === 0 ? (
        <Text style={styles.subtitulo}>No tenés pedidos pendientes por ahora.</Text>
      ) : (
        pendientes.map((p) => (
          <FilaPedido key={p.docId} pedido={p} onAvanzar={actualizarEstadoPedido} />
        ))
      )}

      {entregados.length > 0 && (
        <>
          <Text style={styles.titulo}>Pedidos entregados</Text>
          {entregados.map((p) => (
            <FilaPedido key={p.docId} pedido={p} onAvanzar={actualizarEstadoPedido} />
          ))}
        </>
      )}

      <Text style={styles.titulo}>Editar precios y stock</Text>
      <Text style={styles.subtitulo}>
        Los cambios se guardan al instante y se ven en la app de todos los clientes.
      </Text>
      {productos.map((p) => (
        <FilaProducto
          key={p.id}
          nombre={p.nombre}
          precioInicial={p.precio}
          stockInicial={p.stock}
          onGuardar={(precio, stock) => actualizarProducto(p.id, { precio, stock })}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.lg, gap: Spacing.md },
  titulo: { fontSize: 20, fontWeight: '700', color: Colors.moss },
  subtitulo: { fontSize: 13, color: Colors.olive, marginBottom: Spacing.sm },
  fila: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(44,52,36,0.07)',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  nombre: { fontSize: 14, fontWeight: '700', color: Colors.moss },
  campos: { flexDirection: 'row', gap: Spacing.md },
  campo: { flex: 1 },
  label: { fontSize: 12, color: Colors.olive, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: Colors.aloe,
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.moss,
  },
  sinAcceso: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cream },
  sinAccesoTexto: { fontSize: 14, color: Colors.olive },
  pedido: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(44,52,36,0.07)',
    padding: Spacing.lg,
    gap: 4,
  },
  pedidoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  pedidoId: { fontSize: 15, fontWeight: '700', color: Colors.moss },
  pedidoEstado: { fontSize: 13, fontWeight: '700', color: Colors.cypress },
  pedidoCliente: { fontSize: 14, fontWeight: '600', color: Colors.moss },
  pedidoDato: { fontSize: 12, color: Colors.olive },
  pedidoItem: { fontSize: 13, color: Colors.moss },
  pedidoTotal: { fontSize: 14, fontWeight: '700', color: Colors.cypress, marginTop: 4, marginBottom: 6 },
});
