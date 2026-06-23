import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <View style={[styles.badge, styles.agotado]}>
        <Text style={[styles.text, styles.textAgotado]}>Sin stock</Text>
      </View>
    );
  }
  if (stock <= 3) {
    return (
      <View style={styles.badge}>
        <Text style={styles.text}>⚠ Últimas {stock} unidades</Text>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef9e7',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginBottom: Spacing.xs,
  },
  agotado: { backgroundColor: '#fdecea' },
  text: { fontSize: 10, fontWeight: '700', color: '#9a6f1a' },
  textAgotado: { color: '#922b21' },
});
