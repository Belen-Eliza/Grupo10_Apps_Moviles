import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        maxWidth: "60%",
        flexWrap: "wrap"
      }}
    >
      <Text >Tab de inicio: resumen de info más reciente, total de gastos del mes, etc</Text>
    </View>
  );
}
