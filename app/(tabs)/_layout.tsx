import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { colors } from "@/src/constants/Colors";
import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <Tabs 
      initialRouteName="portfolio"
      screenOptions={{ 
        tabBarActiveTintColor: colors.red.primary,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.beige.color03,
          borderTopWidth: 0,
          elevation: 0,
          paddingVertical: 30
        }
      }}
    >
      <Tabs.Screen
        name="market"
        options={{
          title: 'Market',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="line-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="money" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Index',
          href: null
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});
