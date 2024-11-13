// app/tabs/_layout.tsx
import { Tabs } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons"; // Import Ionicons instead of MaterialCommunityIcons
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffffff", // Active text color
        tabBarInactiveTintColor: "#5f5f5f", // Inactive text color
        tabBarLabelStyle: {
          fontSize: 13, // Font size for tab labels
          fontWeight: "700", // Font weight for tab labels
          marginTop: 4, // Add spacing between icon and label
        },
        tabBarStyle: {
          backgroundColor: "#1e1e1e", // Dark navbar background color
          paddingTop: 10, // Top padding for navbar
          paddingBottom: Platform.OS === "ios" ? 20 : 10, // Bottom padding adjusted for iOS
          height: Platform.OS === "ios" ? 100 : 60, // Navbar height adjusted per platform
          borderTopWidth: 0, // Remove default top border
          shadowColor: "#000", // Shadow color
          shadowOffset: { width: 0, height: -2 }, // Shadow offset
          shadowOpacity: 0.1, // Shadow opacity
          shadowRadius: 10, // Shadow radius
          elevation: 10, // Elevation for Android
        },
        headerStyle: {
          backgroundColor: "#1e1e1e", // Dark header background color
          shadowColor: "transparent", // Remove header shadow
          elevation: 0, // Remove header elevation on Android
        },
        headerTintColor: "#ffffff", // Header text color
        headerTitleAlign: "center", // Center align header title
        headerTitleStyle: {
          fontFamily: "Helvetica-Bold", // Bold font for header title
          fontSize: 20, // Header title font size
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Top",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6
              name="ranking-star" // Updated Ionicon for Dashboard
              color={color}
              size={size + 2} // Slightly larger icon size
            />
          ),
          headerShown: false, // Hide header on this screen
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Market",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6
              name="chart-simple" // Updated Ionicon for Market
              color={color}
              size={size + 2}
            />
          ),
          headerShown: false, // Hide header on this screen
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "Help",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6
              name="question-circle" // Updated Ionicon for Help
              color={color}
              size={size + 2}
            />
          ),
          headerShown: false, // Hide header on this screen
        }}
      />
    </Tabs>
  );
}
