import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useStore } from '@/context/store-context';

export default function LoginScreen() {
  const router = useRouter();
  const { ingresar, registrarse } = useStore();
  const [modo, setModo] = useState<'ingresar' | 'registrarse'>('registrarse');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleIngresar() {
    setError(null);
    if (!email.trim() || !password.trim()) return;
    if (modo === 'registrarse' && (!nombre.trim() || !telefono.trim())) return;

    setEnviando(true);
    const err =
      modo === 'registrarse'
        ? await registrarse(nombre.trim(), telefono.trim(), email.trim(), password)
        : await ingresar(email.trim(), password);
    setEnviando(false);

    if (err) {
      setError(err);
      return;
    }
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
          {modo === 'registrarse' && (
            <>
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
            </>
          )}
          <Text style={styles.label}>Tu email</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: lucas@gmail.com"
            placeholderTextColor={Colors.cedar}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={Colors.cedar}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <PrimaryButton
            title={enviando ? 'Un momento...' : modo === 'registrarse' ? 'Registrarme' : 'Ingresar'}
            disabled={enviando}
            onPress={handleIngresar}
          />

          <Pressable
            onPress={() => {
              setError(null);
              setModo((m) => (m === 'registrarse' ? 'ingresar' : 'registrarse'));
            }}>
            <Text style={styles.cambiarModo}>
              {modo === 'registrarse'
                ? '¿Ya tenés cuenta? Ingresar'
                : '¿Todavía no tenés cuenta? Registrarme'}
            </Text>
          </Pressable>
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
  error: { color: '#b3261e', fontSize: 12, marginBottom: Spacing.sm, textAlign: 'center' },
  cambiarModo: {
    fontSize: 12,
    color: Colors.olive,
    textAlign: 'center',
    marginTop: Spacing.md,
    textDecorationLine: 'underline',
  },
});
