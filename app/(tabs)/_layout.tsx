import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function TabLayout() {
  const { theme, colors } = useAppTheme();

  return (
    <Tabs
      key={theme}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.card,
        },
      }}
    >
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favoriler',
          tabBarIcon: ({ color }) => <Feather name="heart" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Keşfet',
          tabBarIcon: ({ color }) => <Feather name="search" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Randevularım',
          tabBarIcon: ({ color }) => <Feather name="calendar" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}