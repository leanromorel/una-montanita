import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useStore, type Entrega, type MetodoPago, type Pedido } from '@/context/store-context';

const METODOS: MetodoPago[] = ['Mercado Pago', 'Transferencia'];
const ENTREGAS: Entrega[] = ['Envío a domicilio', 'Retiro en local'];

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      {label === 'Mercado Pago' && (
        <FontAwesome5
          name="money-check-alt"
          size={14}
          color={selected ? Colors.white : '#009EE3'}
          style={styles.chipIcon}
        />
      )}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export default function CarritoScreen() {
  const router = useRouter();
  const { carrito, cambiarCantidad, totalCarrito, confirmarPedido } = useStore();
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);
  const [entrega, setEntrega] = useState<Entrega | null>(null);
  const [confirmado, setConfirmado] = useState<Pedido | null>(null);

  async function handleConfirmar() {
    if (!metodoPago || !entrega) return;
    const pedido = await confirmarPedido(metodoPago, entrega);
    if (pedido) setConfirmado(pedido);
  }

  if (confirmado) {
    return (
      <View style={styles.graciasScreen}>
        <Text style={styles.graciasIcon}>🎉</Text>
        <Text style={styles.graciasTitle}>¡Gracias por tu pedido!</Text>
        <Text style={styles.graciasTexto}>
          Tu pedido {confirmado.id} quedó registrado con estado "Pendiente".{' '}
          {confirmado.metodoPago === 'Mercado Pago'
            ? 'Pronto vas a poder pagarlo desde Mercado Pago directamente en la app.'
            : 'Te vamos a pasar los datos para la transferencia.'}
        </Text>
        <PrimaryButton title="Volver a la tienda" onPress={() => router.replace('/')} />
      </View>
    );
  }

  if (carrito.length === 0) {
    return (
      <View style={styles.vacioScreen}>
        <Text style={styles.vacioTexto}>Tu carrito está vacío 🛒</Text>
        <PrimaryButton title="Ver catálogo" onPress={() => router.replace('/catalogo')} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {carrito.map((it) => (
        <View key={it.producto.id} style={styles.item}>
          <Text style={styles.itemNombre}>{it.producto.nombre}</Text>
          <View style={styles.qtyControls}>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => cambiarCantidad(it.producto.id, -1)}>
              <Text style={styles.qtyBtnText}>−</Text>
            </Pressable>
            <Text style={styles.qtyValue}>{it.cantidad}</Text>
            <Pressable style={styles.qtyBtn} onPress={() => cambiarCantidad(it.producto.id, 1)}>
              <Text style={styles.qtyBtnText}>+</Text>
            </Pressable>
          </View>
          <Text style={styles.itemPrecio}>
            ${(it.producto.precio * it.cantidad).toLocaleString('es-AR')}
          </Text>
        </View>
      ))}

      <Text style={styles.total}>Total: ${totalCarrito.toLocaleString('es-AR')}</Text>

      <Text style={styles.seccion}>¿Cómo querés pagar?</Text>
      <View style={styles.chipsRow}>
        {METODOS.map((m) => (
          <Chip key={m} label={m} selected={metodoPago === m} onPress={() => setMetodoPago(m)} />
        ))}
      </View>

      <Text style={styles.seccion}>¿Cómo lo recibís?</Text>
      <View style={styles.chipsRow}>
        {ENTREGAS.map((e) => (
          <Chip key={e} label={e} selected={entrega === e} onPress={() => setEntrega(e)} />
        ))}
      </View>

      <PrimaryButton
        title="Confirmar pedido"
        disabled={!metodoPago || !entrega}
        onPress={handleConfirmar}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.lg },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.aloe,
  },
  itemNombre: { flex: 1, color: Colors.moss, fontWeight: '600', fontSize: 13 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 8 },
  qtyBtn: {
    backgroundColor: Colors.aloe,
    borderRadius: 6,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: Colors.moss },
  qtyValue: { fontSize: 14, fontWeight: '600', color: Colors.moss, minWidth: 18, textAlign: 'center' },
  itemPrecio: { color: Colors.cypress, fontWeight: '700', fontSize: 15, minWidth: 80, textAlign: 'right' },
  total: {
    textAlign: 'right',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.cypress,
    marginVertical: Spacing.md,
  },
  seccion: { fontSize: 13, fontWeight: '700', color: Colors.moss, marginBottom: Spacing.sm },
  chipsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg, flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.cypress,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipIcon: { marginRight: 6 },
  chipSelected: { backgroundColor: Colors.cypress },
  chipText: { color: Colors.cypress, fontSize: 12, fontWeight: '600' },
  chipTextSelected: { color: Colors.white },
  vacioScreen: { flex: 1, backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg, padding: Spacing.lg },
  vacioTexto: { fontSize: 16, color: Colors.cedar },
  graciasScreen: { flex: 1, backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  graciasIcon: { fontSize: 56 },
  graciasTitle: { fontSize: 22, fontWeight: '700', color: Colors.moss },
  graciasTexto: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: Spacing.md },
});
