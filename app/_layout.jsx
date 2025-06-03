import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Drawer from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";

export default function RootLayout() {
  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView>
        <DrawerItem label="Exemplo" />
      </DrawerContentScrollView>
    );
  };
  return (
    <>
      <StatusBar style="dark" />
      <Drawer
        drawerContent={() => <CustomDrawerContent />}
        screenOptions={{
          headerStyle: { backgroundColor: colors.gainsboro },
          headerTintColor: colors.navy,
        }}
      >
        <Drawer.Screen name="login" options={{ headerShown: false }} />
        <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      </Drawer>
    </>
  );
}
