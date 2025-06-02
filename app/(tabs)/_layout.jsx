import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs } from "expo-router";
import Notifications from "../../components/notifications";
import SearchBar from "../../components/search-bar";
import { colors } from "../../constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerLeft: () => <DrawerToggleButton />,
        headerTitle: () => <SearchBar />,
        headerRight: () => <Notifications />,
        headerStyle: { backgroundColor: colors.gainsboro},
        contentStyle: { backgroundColor: colors.gainsboro },
        tabBarActiveTintColor: colors.gainsboro,
        tabBarInactiveTintColor: colors.steel,
        tabBarStyle: { backgroundColor: colors.navy },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Casos",
          tabBarIcon: ({ color }) => (
            <AntDesign name="folder1" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="evidencias"
        options={{
          title: "Evidências",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="fingerprint" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="laudos"
        options={{
          title: "Laudos",
          tabBarIcon: ({ color }) => (
            <AntDesign name="filetext1" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
