import { useState } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ProductCard } from '@/components/ProductCard';
import { StockBadge } from '@/components/StockBadge';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useStore } from '@/context/store-context';
import type { Producto } from '@/data/productos';

export default function CatalogoScreen() {
  const { productos, agregarAlCarrito } = useStore();
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
  const [agregado, setAgregado] = useState(false);

  function abrir(producto: Producto) {
    setAgregado(false);
    setSeleccionado(producto);
  }

  function agregar() {
    if (!seleccionado) return;
    agregarAlCarrito(seleccionado.id);
    setAgregado(true);
    setTimeout(() => setSeleccionado(null), 700);
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={productos}
        keyExtractor={(p) => String(p.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ProductCard producto={item} onPress={() => abrir(item)} />}
      />

      <Modal
        visible={!!seleccionado}
        animationType="slide"
        transparent
        onRequestClose={() => setSeleccionado(null)}>
        <View style={styles.overlay}>
          {seleccionado && (
            <View style={styles.popup}>
              <Image source={seleccionado.img} style={styles.popupImg} />
              <View style={styles.popupBody}>
                <Text style={styles.popupNombre}>{seleccionado.nombre}</Text>
                <Text style={styles.popupDesc}>{seleccionado.desc}</Text>
                <View style={styles.popupRegalo}>
                  <Text style={styles.popupRegaloText}>
                    🎁 Esta yerba incluye un regalo sorpresa sin costo
                  </Text>
                </View>
                <StockBadge stock={seleccionado.stock} />
                <Text style={styles.popupPrecio}>
                  ${seleccionado.precio.toLocaleString('es-AR')}
                </Text>
                <PrimaryButton
                  title={
                    agregado ? '✓ ¡Agregado!' : seleccionado.stock === 0 ? 'Sin stock' : '🛒 Agregar al carrito'
                  }
                  disabled={seleccionado.stock === 0}
                  onPress={agregar}
                />
                <Pressable style={styles.cerrar} onPress={() => setSeleccionado(null)}>
                  <Text style={styles.cerrarText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  list: { padding: Spacing.md, gap: Spacing.md },
  row: { gap: Spacing.md, marginBottom: Spacing.md },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20,28,16,0.7)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  popup: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden' },
  popupImg: { width: '100%', height: 200 },
  popupBody: { padding: Spacing.lg },
  popupNombre: { fontSize: 20, fontWeight: '700', color: Colors.moss, marginBottom: 6 },
  popupDesc: { fontSize: 13, color: '#666', marginBottom: Spacing.sm, lineHeight: 19 },
  popupRegalo: {
    backgroundColor: '#fdf6e3',
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
    borderRadius: 6,
    padding: 10,
    marginBottom: Spacing.sm,
  },
  popupRegaloText: { fontSize: 12, color: '#7a5c1e', fontWeight: '600' },
  popupPrecio: { fontSize: 24, fontWeight: '700', color: Colors.cypress, marginVertical: Spacing.sm },
  cerrar: {
    backgroundColor: Colors.aloe,
    borderRadius: Radius.sm,
    paddingVertical: 11,
    alignItems: 'center',
  },
  cerrarText: { color: Colors.moss, fontWeight: '600', fontSize: 13 },
});
