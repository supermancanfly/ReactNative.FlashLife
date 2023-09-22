import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    FlatList
} from 'react-native';
import Moment from 'moment';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import DropdownButton from '../../utils/DropdownButton';
import DropDownFloatingList from '../../utils/DropDownFloatingList';

export default function ImagebgFloatingTextCard({ cardstyle,item, header_background_color,list,onPressHeader,headervisible }) {

    return (
        <ImageBackground style={cardstyle}
        source={Constantimages.image_lady_fall_card}
        >
              <View style={{position: 'absolute',
               top: 0, left: 0, 
               right: 0, bottom: 0,
               flexDirection:'row',
               borderRadius:12
            
                }}>

                   <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end',paddingBottom:16,paddingHorizontal:16}}>
                    <Text style={{color:colors.COLOR_WHITE,fontWeight:'700',fontSize:16,lineHeight:20}}>{item.title}</Text>
                    </View>

                    <View style={{flex:1,justifyContent:'center',alignItems:'center',paddingBottom:16}}>
                    <Image
                        source={item.subtitleIcon}
                        style={{
                           
                            resizeMode: 'contain',
                            width: 25,
                           
                            alignSelf:'flex-end',
                            tintColor:colors.COLOR_WHITE,
                            height: 25

                        }}
                    >
                    </Image>
                    <View style={{flexDirection:'row',bottom:16,right:16,position:'absolute'}}>
                    <Text style={{color:colors.COLOR_WHITE,fontSize:12,lineHeight:18}}>Flash Club</Text>
                    <Image
                        source={item.icon}
                        style={{
                          
                            resizeMode: 'contain',
                            width: 20,
                           marginLeft:7,
                            height: 20

                        }}
                    >

                    </Image> 
                    </View>
                    </View>
                 

   </View>
          
        </ImageBackground>

    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: colors.COLOR_LIGHT_GRAY,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
