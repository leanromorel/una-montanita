import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';
import { StoreProvider } from '@/context/store-context';

export default function RootLayout() {
  return (
    <StoreProvider>
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
    </StoreProvider>
  );
}
