import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';
import { useStore } from '@/context/store-context';
import type { EstadoPedido, Pedido } from '@/context/store-context';

const COLOR_ESTADO: Record<EstadoPedido, string> = {
  Pendiente: '#9a6f1a',
  Confirmado: Colors.cypress,
  'En preparación': Colors.gold,
  Enviado: Colors.cypress,
  Entregado: Colors.success,
};

function PedidoCard({ pedido }: { pedido: Pedido }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.id}>{pedido.id}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: COLOR_ESTADO[pedido.estado] }]}>
          <Text style={styles.estadoText}>{pedido.estado}</Text>
        </View>
      </View>
      <Text style={styles.fecha}>{pedido.fecha}</Text>
      {pedido.items.map((it) => (
        <Text key={it.producto.id} style={styles.item}>
          • {it.producto.nombre} x{it.cantidad}
        </Text>
      ))}
      <View style={styles.footerRow}>
        <Text style={styles.metodo}>
          {pedido.metodoPago} · {pedido.entrega}
        </Text>
        <Text style={styles.total}>${pedido.total.toLocaleString('es-AR')}</Text>
      </View>
    </View>
  );
}

export default function PedidosScreen() {
  const { pedidos } = useStore();

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={pedidos}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <PedidoCard pedido={item} />}
      ListEmptyComponent={
        <Text style={styles.vacio}>Todavía no hiciste ningún pedido por la app.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.lg, gap: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(44,52,36,0.07)',
    marginBottom: Spacing.md,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontWeight: '700', color: Colors.moss },
  estadoBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  estadoText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  fecha: { fontSize: 12, color: Colors.cedar, marginBottom: Spacing.sm },
  item: { fontSize: 13, color: Colors.cypress, marginBottom: 2 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  metodo: { fontSize: 11, color: Colors.olive },
  total: { fontSize: 17, fontWeight: '700', color: Colors.cypress },
  vacio: { textAlign: 'center', color: Colors.cedar, marginTop: 40 },
});
