import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useStore } from '@/context/store-context';

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
  const { esAdmin, productos, actualizarProducto } = useStore();

  if (!esAdmin) {
    return (
      <View style={styles.sinAcceso}>
        <Text style={styles.sinAccesoTexto}>No tenés acceso a esta pantalla.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
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
});
