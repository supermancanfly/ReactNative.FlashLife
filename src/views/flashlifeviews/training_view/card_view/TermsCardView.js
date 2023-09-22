import React from "react";
import { Platform, Text, View } from "react-native";
import { fontsProps } from "../../../../utils/StyleComponents";

const TermsCardView = ({ item }) => {

    return (
        <View style={{ marginVertical: 5 }}>
            <Text style={{
                fontSize: fontsProps.md,
                marginHorizontal: 5,
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
            }}>{item.title}</Text>
            <Text style={{
                fontSize: fontsProps.sm,
                marginHorizontal: 5,
                fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
            }}>{item.description}</Text>
        </View>
    )

}
export default TermsCardView;