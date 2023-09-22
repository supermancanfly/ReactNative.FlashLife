import React from 'react';
import {Text, TouchableOpacity,Image} from "react-native";
import { colors } from '../../utils/StyleComponents';
import Constantimages from '../../utils/ConstantImages';
function OutlineFlashTextImageButton ({buttonPress, title, style, 
    buttonPressTypeOne,
    titleStyle,
    buttonimage,
    imagetintcolor
}) {

    return (
        <TouchableOpacity style={[style]} onPress={buttonPressTypeOne}>
            <Text style={[titleStyle]}>{title}</Text>
            <Image source={buttonimage}
                            style={{
                                width: 25,
                                height: 25,

                                tintColor: imagetintcolor
                            }}
                        >
                        </Image>
          
        </TouchableOpacity>

    );
}

export default OutlineFlashTextImageButton;