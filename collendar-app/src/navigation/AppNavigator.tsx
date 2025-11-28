import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../constants/colors";

// Telas de Autenticação
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

// Telas de Calendário
import CalendarScreen from "../screens/calendar/CalendarScreen";
import EventDetailsScreen from "../screens/calendar/EventDetailsScreen";
import CreateEventScreen from "../screens/calendar/CreateEventScreen";

// Telas de Meus Calendários
import MyCalendarsScreen from "../screens/myCalendars/MyCalendarsScreen";
import CreateCalendarScreen from "../screens/myCalendars/CreateCalendarScreen";
import CalendarDetailsScreen from "../screens/myCalendars/CalendarDetailsScreen";
import ShareCalendarScreen from "../screens/myCalendars/ShareCalendarScreen";

// Telas de Compartilhados
import SharedCalendarsScreen from "../screens/shared/SharedCalendarsScreen";

// Telas de Perfil
import ProfileScreen from "../screens/profile/ProfileScreen";

import {
  AuthStackParamList,
  CalendarStackParamList,
  MyCalendarsStackParamList,
  SharedStackParamList,
  ProfileStackParamList,
  MainTabsParamList,
} from "../types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();
const MyCalendarsStack =
  createNativeStackNavigator<MyCalendarsStackParamList>();
const SharedStack = createNativeStackNavigator<SharedStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabsParamList>();

// Stack de Autenticação
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// Stack de Calendário
function CalendarNavigator() {
  return (
    <CalendarStack.Navigator>
      <CalendarStack.Screen
        name="CalendarMain"
        component={CalendarScreen}
        options={{
          title: "Calendário",
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.card,
        }}
      />
      <CalendarStack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{
          title: "Detalhes do Evento",
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.card,
        }}
      />
      <CalendarStack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{
          title: "Criar Evento",
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.card,
        }}
      />
    </CalendarStack.Navigator>
  );
}

// Stack de Meus Calendários
function MyCalendarsNavigator() {
  return (
    <MyCalendarsStack.Navigator>
      <MyCalendarsStack.Screen
        name="MyCalendarsMain"
        component={MyCalendarsScreen}
        options={{
          title: "Meus Calendários",
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.card,
        }}
      />
      <MyCalendarsStack.Screen
        name="CreateCalendar"
        component={CreateCalendarScreen}
        options={{
          title: "Criar Calendário",
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.card,
        }}
      />
      <MyCalendarsStack.Screen
        name="CalendarDetails"
        component={CalendarDetailsScreen}
        options={{
          title: "Detalhes",
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.card,
        }}
      />
      <MyCalendarsStack.Screen
        name="ShareCalendar"
        component={ShareCalendarScreen}
        options={{
          title: "Compartilhar",
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.card,
        }}
      />
    </MyCalendarsStack.Navigator>
  );
}

// Stack de Compartilhados
function SharedNavigator() {
  return (
    <SharedStack.Navigator>
      <SharedStack.Screen
        name="SharedCalendarsMain"
        component={SharedCalendarsScreen}
        options={{
          title: "Compartilhados",
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.card,
        }}
      />
    </SharedStack.Navigator>
  );
}

// Stack de Perfil
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.card,
        }}
      />
    </ProfileStack.Navigator>
  );
}

// Bottom Tabs Principal
function MainTabsNavigator() {
  return (
    <MainTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "CalendarTab") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "MyCalendarsTab") {
            iconName = focused ? "folder" : "folder-outline";
          } else if (route.name === "SharedTab") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerShown: false,
      })}
    >
      <MainTabs.Screen
        name="CalendarTab"
        component={CalendarNavigator}
        options={{ title: "Home" }}
      />
      <MainTabs.Screen
        name="MyCalendarsTab"
        component={MyCalendarsNavigator}
        options={{ title: "Meus" }}
      />
      <MainTabs.Screen
        name="SharedTab"
        component={SharedNavigator}
        options={{ title: "Compartilhados" }}
      />
      <MainTabs.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{ title: "Perfil" }}
      />
    </MainTabs.Navigator>
  );
}

// Navegador Principal
export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  // Listener para mudanças no AsyncStorage
  useEffect(() => {
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return isLoggedIn ? <MainTabsNavigator /> : <AuthNavigator />;
}
