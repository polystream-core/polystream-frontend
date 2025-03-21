import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Tabs, useSegments} from 'expo-router';
import {colors} from "@/src/constants/Colors";
import {Image, StyleSheet} from 'react-native';
import {tabsIcons} from "@/src/constants/Images";

export default function TabLayout() {
  const styles = StyleSheet.create({
    tabsIcons: {
      height: 26,
      width: 26,
      resizeMode: "contain"
    }
  });

  const segment = useSegments();
  // get the current page from the segment
  const page = segment[segment.length - 1]
  // create an array of list pages you want to hide the tab bar in
  const pagesToHide = ['strategy-details', 'polystream-vault']

  return (
    <Tabs
      initialRouteName="portfolio"
      screenOptions={{
        tabBarActiveTintColor: colors.red.primary,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.beige.color03,
          borderTopWidth: 0,
          elevation: 0,
          paddingHorizontal: 20,
          paddingVertical: 200,
          display: pagesToHide.includes(page) ? 'none' : 'flex'
        }
      }}
    >
      <Tabs.Screen
        name="market"
        options={{
          title: 'Market',
          tabBarIcon: ({focused}) => <Image source={focused ? tabsIcons.market_active : tabsIcons.market_inactive} style = {styles.tabsIcons}/>,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({focused}) => <Image source={focused ? tabsIcons.portfolio_active : tabsIcons.portfolio_inactive} style = {styles.tabsIcons}/>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({focused}) => <Image source={focused ? tabsIcons.profile_active : tabsIcons.profile_inactive} style = {styles.tabsIcons}/>,
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


