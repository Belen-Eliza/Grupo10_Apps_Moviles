import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{
      headerStyle: {
        backgroundColor: '#83cefc',
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Tabs.Screen name='index' options={{title:"Home", tabBarIcon: ({focused,color})=><TabBarIcon name={focused? "home" : "home-outline"} color={color}/>}}/>
      <Tabs.Screen name="nuevo" options={{title:"Add", tabBarIcon: ({focused,color})=><TabBarIcon name={focused? "add-circle" : "add-circle-outline"} color={color}/>}}/>
      <Tabs.Screen name='historial' options={{title:"History", tabBarIcon: ({focused,color})=><TabBarIcon name={focused? "pricetag" : "pricetag-outline"} color={color}/>}}/>
      <Tabs.Screen name='estadisticas' options={{title:"Statistics", tabBarIcon: ({focused,color})=><TabBarIcon name={focused? "clipboard" : "clipboard-outline"} color={color}/>}}/>
      
    </Tabs>
  );
}
