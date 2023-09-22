import React from 'react';
import {Text, TouchableOpacity,Image} from "react-native";
import { colors } from '../../utils/StyleComponents';
import Constantimages from '../../utils/ConstantImages';
function OutlineTextImageButton ({buttonPress, title, style, 
    buttonPressTypeOne,
  
    titleStyle,buttonimage,
    imagetintcolor,
    imageStyle
}) {

    return (
        <TouchableOpacity style={[style]} onPress={buttonPressTypeOne}>
            {/* <Text style={[{titleStyle}]}>{title}</Text> */}
           
            <Text style={[titleStyle]}>{title}</Text>
            <Image source={Constantimages.arrow_right_icon}
                            style={
                                imageStyle
                        }
                        >
                        </Image>
        </TouchableOpacity>

    );
}


export default OutlineTextImageButton;