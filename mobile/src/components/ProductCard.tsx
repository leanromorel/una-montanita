import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { StockBadge } from '@/components/StockBadge';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { Producto } from '@/data/productos';

export function ProductCard({ producto, onPress }: { producto: Producto; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.regaloTag}>
        <Text style={styles.regaloTagText}>🎁 Regalo</Text>
      </View>
      <Image source={producto.img} style={styles.img} />
      <View style={styles.info}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        <Text style={styles.precio}>${producto.precio.toLocaleString('es-AR')}</Text>
        <StockBadge stock={producto.stock} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(44,52,36,0.07)',
  },
  regaloTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.gold,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
  },
  regaloTagText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
  img: { width: '100%', height: 140, backgroundColor: Colors.aloe },
  info: { padding: Spacing.sm },
  nombre: { fontSize: 13, fontWeight: '600', color: Colors.moss, marginBottom: 4 },
  precio: { fontSize: 18, fontWeight: '700', color: Colors.cypress, marginBottom: 4 },
});
