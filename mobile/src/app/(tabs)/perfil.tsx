import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useStore } from '@/context/store-context';

export default function PerfilScreen() {
  const router = useRouter();
  const { usuario, logout, actualizarFoto, notificacionesActivas, setNotificacionesActivas, esAdmin } =
    useStore();

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  async function handleElegirFoto() {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) return;

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!resultado.canceled && resultado.assets[0]) {
      actualizarFoto(resultado.assets[0].uri);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={handleElegirFoto}>
        <Image
          source={usuario?.foto ? { uri: usuario.foto } : require('@/assets/productos/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.cambiarFoto}>Cambiar foto</Text>
      </TouchableOpacity>
      <Text style={styles.nombre}>{usuario?.nombre}</Text>
      <Text style={styles.telefono}>{usuario?.telefono}</Text>
      <Text style={styles.telefono}>{usuario?.email}</Text>

      <View style={styles.notifBox}>
        <Text style={styles.notifTexto}>🔔 Avisarme de novedades y productos nuevos</Text>
        <Switch
          value={notificacionesActivas}
          onValueChange={setNotificacionesActivas}
          trackColor={{ false: Colors.aloe, true: Colors.moss }}
        />
      </View>

      <View style={styles.redes}>
        <TouchableOpacity
          style={styles.redItem}
          onPress={() => Linking.openURL('https://www.instagram.com/unamontanita')}>
          <FontAwesome5 name="instagram" size={18} color="#E1306C" style={styles.redIcon} />
          <Text style={styles.redItemTexto}>Seguinos en Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.redItem}
          onPress={() => Linking.openURL('https://www.tiktok.com/@unamontaita1')}>
          <FontAwesome5 name="tiktok" size={18} color="#000000" style={styles.redIcon} />
          <Text style={styles.redItemTexto}>Seguinos en TikTok</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.redItem, styles.redItemUltimo]}
          onPress={() => Linking.openURL('https://wa.me/543772634185')}>
          <FontAwesome5 name="whatsapp" size={18} color="#25D366" style={styles.redIcon} />
          <Text style={styles.redItemTexto}>Escribinos por WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {esAdmin && (
        <PrimaryButton
          title="⚙️ Administrar precios y stock"
          onPress={() => router.push('/admin')}
        />
      )}

      <PrimaryButton title="Cerrar sesión" variant="outline" onPress={handleLogout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.lg, alignItems: 'center', gap: Spacing.sm },
  logo: { width: 84, height: 84, borderRadius: 42, marginBottom: 4 },
  cambiarFoto: {
    fontSize: 12,
    color: Colors.olive,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    textDecorationLine: 'underline',
  },
  nombre: { fontSize: 20, fontWeight: '700', color: Colors.moss },
  telefono: { fontSize: 13, color: Colors.olive, marginBottom: Spacing.md },
  notifBox: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(44,52,36,0.07)',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  notifTexto: { fontSize: 14, color: Colors.moss, flex: 1 },
  redes: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(44,52,36,0.07)',
    marginBottom: Spacing.lg,
  },
  redItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.aloe,
  },
  redItemUltimo: { borderBottomWidth: 0 },
  redIcon: { width: 22, textAlign: 'center', marginRight: 10 },
  redItemTexto: { fontSize: 14, color: Colors.moss },
});
