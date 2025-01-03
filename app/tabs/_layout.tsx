import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    
    <Tabs screenOptions={{
      headerStyle: {
        backgroundColor: '#007AFF',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Tabs.Screen name='home' options={{title:"Home",headerShown:false, tabBarIcon: ({focused,color})=><TabBarIcon name={focused? "home" : "home-outline"} color={color}/>}}/>
      <Tabs.Screen name="nuevo" options={{title:"Add", headerShown: false, tabBarIcon: ({focused,color})=><TabBarIcon name={focused? "add-circle" : "add-circle-outline"} color={color}/>}}/>
      <Tabs.Screen name='historial' options={{title:"History", headerShown: false, tabBarIcon: ({focused,color})=><TabBarIcon name={focused? "document-text" : "document-text-outline"} color={color}/>}}/>
      <Tabs.Screen name='estadisticas' options={{title:"Statistics", headerShown: false, tabBarIcon: ({focused,color})=><TabBarIcon name={focused? "bar-chart" : "bar-chart-outline"} color={color}/>}}/>
      
    </Tabs>
  );
}
