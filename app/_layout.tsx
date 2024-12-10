import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
    <StatusBar style="dark" /> 
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: 'Page introuvable' }} />
    </Stack>
    </>
  );
}
