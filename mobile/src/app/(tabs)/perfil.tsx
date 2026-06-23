import { useRouter } from 'expo-router';
import { Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useStore } from '@/context/store-context';

export default function PerfilScreen() {
  const router = useRouter();
  const { usuario, logout } = useStore();

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Image source={require('@/assets/productos/logo.png')} style={styles.logo} />
      <Text style={styles.nombre}>{usuario?.nombre}</Text>
      <Text style={styles.telefono}>{usuario?.telefono}</Text>

      <View style={styles.redes}>
        <Text style={styles.redItem} onPress={() => Linking.openURL('https://www.instagram.com/unamontanita')}>
          📷 Seguinos en Instagram
        </Text>
        <Text style={styles.redItem} onPress={() => Linking.openURL('https://www.tiktok.com/@unamontaita1')}>
          🎵 Seguinos en TikTok
        </Text>
        <Text style={styles.redItem} onPress={() => Linking.openURL('https://wa.me/543772634185')}>
          💬 Escribinos por WhatsApp
        </Text>
      </View>

      <PrimaryButton title="Cerrar sesión" variant="outline" onPress={handleLogout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.lg, alignItems: 'center', gap: Spacing.sm },
  logo: { width: 84, height: 84, borderRadius: 42, marginBottom: Spacing.sm },
  nombre: { fontSize: 20, fontWeight: '700', color: Colors.moss },
  telefono: { fontSize: 13, color: Colors.olive, marginBottom: Spacing.lg },
  redes: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(44,52,36,0.07)',
    marginBottom: Spacing.lg,
  },
  redItem: {
    fontSize: 14,
    color: Colors.moss,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.aloe,
  },
});
