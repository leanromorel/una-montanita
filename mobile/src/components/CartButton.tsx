import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useStore } from '@/context/store-context';

export function CartButton() {
  const router = useRouter();
  const { cantidadCarrito } = useStore();

  return (
    <Pressable style={styles.button} onPress={() => router.push('/carrito')}>
      <Text style={styles.icon}>🛒</Text>
      {cantidadCarrito > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cantidadCarrito}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { marginRight: 14, padding: 4 },
  icon: { fontSize: 22 },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: Colors.danger,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
});
