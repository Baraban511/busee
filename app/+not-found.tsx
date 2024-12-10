import React from "react";
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
            <Text>Rien à voir ici</Text>
            <Link href={{pathname:"./"}}>Retourner à l'arrêt</Link>
        </View>
    );
}
