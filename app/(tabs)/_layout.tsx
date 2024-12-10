import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#000000',
    }} >
      <Tabs.Screen name="index" options={{
        title: 'Aller', headerShown: false, tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'school' : 'school-outline'} color={color} size={24} />
        ),
      }} />
      <Tabs.Screen name="retour" options={{
        title: 'Retour', headerShown: false, tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        ),
      }} />
    </Tabs>
  );
}