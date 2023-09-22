
import React from 'react';
import { Text, TouchableOpacity, View, Image } from "react-native";
import { colors } from '../../utils/StyleComponents';
import Constantimages from '../../utils/ConstantImages';
export default function ButtonImageBorderTitle({
     buttonPress, title,
     style,
    titleStyle,
    imagecolor,
    imagesrc,
    imagestyle
}) {
    return (
        <TouchableOpacity style={[style]} onPress={buttonPress}>
            <View style={{ flex: 0.3 }}>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[titleStyle]}>{title}</Text>
            </View>
            <View style={{ flex: 0.3, alignItems: 'flex-end', marginRight: 10 }}>
                <Image
                    source={
                        imagesrc
                    }
                    style={
                        imagestyle
                }
                />
            </View>
        </TouchableOpacity>
    );
}
