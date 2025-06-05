import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router } from "expo-router";
import Drawer from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";

export default function RootLayout() {
  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView>
        <DrawerItem
          label="Início"
          onPress={() => router.push("/dashboard")}
        />
        <DrawerItem
          label="Casos"
          onPress={() => router.push("/casos")}
        />
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
          headerTintColor: colors.midnightNavy,
        }}
      >
        <Drawer.Screen name="login" options={{ headerShown: false }} />
        <Drawer.Screen name="dashboard" options={{headerTitle: "Início"}}/>
        <Drawer.Screen name="casos/index" options={{headerTitle: "Casos"}}/>
        <Drawer.Screen name="casos/[id]" options={{headerTitle: "Detalhes do Caso"}}/>
      </Drawer>
    </>
  );
}
