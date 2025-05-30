import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ 
                title: "Casos",
                tabBarIcon: ({color}) => <AntDesign name="folder1" size={24} color={color} />
             }} />
            <Tabs.Screen name="laudos" options={{ 
                title: "Casos",
                tabBarIcon: ({color}) => <AntDesign name="filetext1" size={24} color={color} />
             }} />
            <Tabs.Screen name="evidencias" options={{ 
                title: "Casos",
                tabBarIcon: ({color}) => <MaterialIcons name="fingerprint" size={24} color={color} />
             }} />
        </Tabs>
    )
}