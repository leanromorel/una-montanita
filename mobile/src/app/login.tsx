import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useStore } from '@/context/store-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useStore();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  function handleIngresar() {
    if (!nombre.trim() || !telefono.trim()) return;
    login(nombre.trim(), telefono.trim());
    router.replace('/');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container}>
        <Image source={require('@/assets/productos/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Una Montañita</Text>
        <Text style={styles.subtitle}>"El sabor que nace de la montaña"</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Tu nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Lucas García"
            placeholderTextColor={Colors.cedar}
            value={nombre}
            onChangeText={setNombre}
          />
          <Text style={styles.label}>Tu WhatsApp</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 3772 123456"
            placeholderTextColor={Colors.cedar}
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />
          <PrimaryButton title="Ingresar" onPress={handleIngresar} />
          <Text style={styles.nota}>
            Registrate una sola vez. Vas a poder ver tus pedidos y repetir tu última compra sin
            escribirnos.
          </Text>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.moss },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 70 },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
  },
  title: { color: Colors.white, fontSize: 28, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: Colors.aloe, fontStyle: 'italic', marginBottom: Spacing.xl },
  form: {
    width: '100%',
    backgroundColor: Colors.cream,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  label: { fontSize: 12, color: Colors.olive, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.aloe,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: Spacing.md,
    color: Colors.moss,
    fontSize: 14,
  },
  nota: { fontSize: 11, color: Colors.cedar, textAlign: 'center', marginTop: Spacing.sm },
});
