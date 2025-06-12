import { Stack } from 'expo-router';
import { AuthProvider } from '../components/auth/auth-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="dashboard" />
        {/* Remova estas linhas - as rotas são automáticas */}
        {/* <Stack.Screen name="casos" /> */}
        {/* <Stack.Screen name="evidencias" /> */}
      </Stack>
    </AuthProvider>
  );
}