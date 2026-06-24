import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { StoreProvider, useStore } from '@/context/store-context';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { usuario, cargandoSesion } = useStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (cargandoSesion) return;
    const enLogin = segments[0] === 'login';
    if (!usuario && !enLogin) {
      router.replace('/login');
    } else if (usuario && enLogin) {
      router.replace('/');
    }
  }, [cargandoSesion, usuario, segments, router]);

  if (cargandoSesion) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.moss, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.white} size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <StoreProvider>
      <AuthGate>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="carrito"
            options={{
              presentation: 'modal',
              title: 'Tu carrito',
              headerStyle: { backgroundColor: Colors.moss },
              headerTintColor: Colors.white,
            }}
          />
        </Stack>
      </AuthGate>
    </StoreProvider>
  );
}
