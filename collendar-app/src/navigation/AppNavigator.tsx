import React from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../components/Components";
import { useApp } from "../contexts/AppContext";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import CreateCalendarScreen from "../screens/CreateCalendarScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EditEventScreen from "../screens/EditEventScreen";
import ShareScreen from "../screens/ShareScreen";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: COLORS.backgroundLight },
  headerTintColor: COLORS.text,
  headerTitleStyle: { fontWeight: "600" as const },
  contentStyle: { backgroundColor: COLORS.background },
};

const AppNavigator: React.FC = () => {
  const { isAuthenticated, logout } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                title: "Collendar",
                headerLeft: () => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Share")}
                    style={{ marginRight: 16 }}
                  >
                    <Ionicons
                      name="share-social-outline"
                      size={24}
                      color={COLORS.text}
                    />
                  </TouchableOpacity>
                ),
                headerRight: () => (
                  <TouchableOpacity onPress={logout}>
                    <Ionicons
                      name="log-out-outline"
                      size={24}
                      color={COLORS.text}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="CreateCalendar"
              component={CreateCalendarScreen}
              options={{ title: "Novo Calendário", presentation: "modal" }}
            />
            <Stack.Screen
              name="CreateEvent"
              component={CreateEventScreen}
              options={{ title: "Novo Evento", presentation: "modal" }}
            />
            <Stack.Screen
              name="EditEvent"
              component={EditEventScreen}
              options={{ title: "Editar Evento", presentation: "modal" }}
            />
            <Stack.Screen
              name="Share"
              component={ShareScreen}
              options={{ title: "Compartilhar", presentation: "modal" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
