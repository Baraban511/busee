import { Text, View } from "react-native";
import { Link } from "expo-router";
export default function NotFoundScreen() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Nothing to see here</Text>
            <Link href="/">Go back in safe place</Link>
        </View>
    );
}
