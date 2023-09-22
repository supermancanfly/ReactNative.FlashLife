import React from 'react';
import {Text, TouchableOpacity} from "react-native";
import { colors } from '../../utils/StyleComponents';
function MaterialButton ({buttonPress, title, style, 
  
    titleStyle
}) {

    return (
        <TouchableOpacity style={[style]} onPress={buttonPress}>
            {/* <Text style={[{titleStyle}]}>{title}</Text> */}
            <Text style={[titleStyle]}>{title}</Text>
        </TouchableOpacity>

    );
}

export default MaterialButton;