import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useStore } from '@/context/store-context';

export default function InicioScreen() {
  const router = useRouter();
  const { usuario, ultimoPedido, repetirUltimoPedido } = useStore();

  function handleRepetir() {
    repetirUltimoPedido();
    router.push('/carrito');
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.hola}>Hola,</Text>
      <Text style={styles.nombre}>{usuario?.nombre}</Text>

      {ultimoPedido && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tu último pedido</Text>
          <Text style={styles.cardFecha}>{ultimoPedido.fecha}</Text>
          {ultimoPedido.items.map((it) => (
            <Text key={it.producto.id} style={styles.itemLine}>
              • {it.producto.nombre} x{it.cantidad}
            </Text>
          ))}
          <Text style={styles.cardTotal}>
            Total: ${ultimoPedido.total.toLocaleString('es-AR')}
          </Text>
          <PrimaryButton title="🔁 Repetir pedido" onPress={handleRepetir} />
        </View>
      )}

      <View style={styles.club}>
        <Text style={styles.clubTitle}>⭐ Club Una Montañita</Text>
        <Text style={styles.clubDesc}>
          Acumulá tus compras. En tu 3ra pedido por la app, te aplicamos 5% de descuento
          automático.
        </Text>
      </View>

      <Text style={styles.regalo}>
        🎁 Con cada yerba que comprás, te mandamos un regalo incluido sin costo adicional
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.lg, gap: Spacing.md },
  hola: { fontSize: 14, color: Colors.olive, fontWeight: '600' },
  nombre: { fontSize: 26, fontWeight: '700', color: Colors.moss, marginBottom: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(44,52,36,0.07)',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.moss, marginBottom: 2 },
  cardFecha: { fontSize: 12, color: Colors.cedar, marginBottom: Spacing.sm },
  itemLine: { fontSize: 13, color: Colors.cypress, marginBottom: 2 },
  cardTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.cypress,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  club: {
    backgroundColor: Colors.moss,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  clubTitle: { color: Colors.gold, fontWeight: '700', fontSize: 15, marginBottom: 6 },
  clubDesc: { color: Colors.aloe, fontSize: 13, lineHeight: 19 },
  regalo: {
    textAlign: 'center',
    backgroundColor: '#fdf6e3',
    borderColor: Colors.gold,
    borderWidth: 1,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    fontSize: 12,
    color: '#7a5c1e',
    fontWeight: '600',
  },
});
