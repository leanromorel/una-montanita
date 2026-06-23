import { Redirect, Tabs } from 'expo-router';
import { Text } from 'react-native';

import { CartButton } from '@/components/CartButton';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/store-context';

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const { usuario } = useStore();

  if (!usuario) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.moss },
        headerTintColor: Colors.white,
        headerRight: () => <CartButton />,
        tabBarActiveTintColor: Colors.cypress,
        tabBarInactiveTintColor: Colors.cedar,
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Inicio', tabBarIcon: () => <TabIcon emoji="🏔️" /> }}
      />
      <Tabs.Screen
        name="catalogo"
        options={{ title: 'Catálogo', tabBarIcon: () => <TabIcon emoji="🌿" /> }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{ title: 'Mis pedidos', tabBarIcon: () => <TabIcon emoji="📦" /> }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: 'Perfil', tabBarIcon: () => <TabIcon emoji="👤" /> }}
      />
    </Tabs>
  );
}
