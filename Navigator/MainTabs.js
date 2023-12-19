import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home";
import ProfileScreen from "../screens/profile";
import DocumentsScreen from "../screens/documents";
import ChatScreen from "../screens/ChatScreen";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
const Tab = createBottomTabNavigator();

function MainTabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.secondary,
        tabBarStyle: {
          backgroundColor: "white",
          //borderTopColor: "grey", // Set the background color to black
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color, size }) => {
            // Reduce the size of the icons
            const iconSize = size * 0.8; // Adjust the factor to make icons smaller
            // Return the icon component
            return (
              <Ionicons
                name="home"
                color={color}
                size={focused ? size : iconSize}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Profil",
          tabBarIcon: ({ focused, color, size }) => {
            // Reduce the size of the icons
            const iconSize = size * 0.8; // Adjust the factor to make icons smaller
            // Return the icon component
            return (
              <Ionicons
                name="person"
                color={color}
                size={focused ? size : iconSize}
                focused
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="documents"
        component={DocumentsScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Verlauf",
          tabBarIcon: ({ focused, color, size }) => {
            // Reduce the size of the icons
            const iconSize = size * 0.8; // Adjust the factor to make icons smaller
            // Return the icon component
            return (
              <Ionicons
                name="time"
                color={color}
                size={focused ? size : iconSize}
                focused
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Chat",
          tabBarIcon: ({ focused, color, size }) => {
            // Reduce the size of the icons
            const iconSize = size * 0.8; // Adjust the factor to make icons smaller
            // Return the icon component
            return (
              <Ionicons
                name="chatbubbles"
                color={color}
                size={focused ? size : iconSize}
                focused
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
export default MainTabs;
