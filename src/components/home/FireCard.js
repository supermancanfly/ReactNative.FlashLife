import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import { colors } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import RowTwoCardType from '../home/RowTwoCardType';
import ThreeRowCardType from '../home/ThreeRowCardType';
import ThreeRowImageCardType from '../home/ThreeRowImageCardType';
export default function FireCard({ item, index, cardstyle, header_background_color, onPress,landingData }) {
    // console.log("title   card_sub_text" + item.card_sub_text+"----------"+item.headertitle)
    // 2 5 6
    // console.log("FireCard:item.card_type"+item.card_type);
    if (item.card_type == 2) {
        //2 Row
        return (
            <RowTwoCardType item={item} index={index}  cardstyle={cardstyle} onPress={onPress} />
          );
    }
    else if (item.card_type == 5) {
        //3 Row
        return (
            <ThreeRowCardType item={item} index={index}  cardstyle={cardstyle} onPress={onPress} />
          );
    }
    else{
        //3 Row Image
        return (
            <ThreeRowImageCardType item={item} cardstyle={cardstyle} onPress={onPress}/>            
        )
    }
  
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: colors.COLOR_LIGHT_GRAY,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        resizeMode: 'contain',
        width: 20,
        height: 20
    },
    imageContainer: {
        height: 30,
        width: 30,
        borderRadius: 30 / 2,
        resizeMode: 'contain',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        tintColor: colors.GREY_COLOR

    },
    closeIcon: {
        height: 30 / 2,
        resizeMode: 'contain',
        alignSelf: 'center',
        tintColor: colors.GREY_COLOR
    }
});
