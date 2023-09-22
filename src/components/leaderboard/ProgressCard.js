import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ActivityIndicator
} from 'react-native';
import Moment from 'moment';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import DefaultAvatar from '../../assets/svg/DefaultAvatar.svg';
import { SvgXml } from 'react-native-svg';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
export default function ProgressCard({ circleimage,
    circlepercentage,
    header_background_color

}) {
    return (
        <AnimatedCircularProgress
            size={60}
            width={4}
            fill={circlepercentage}
            tintColor={header_background_color}
            backgroundColor={colors.COLOR_WHITE}
            padding={5}
            // paddingHorizontal={12}
            // marginHorizontal={12}
        >
            {
                (fill) => 
                circleimage != "" ?
                                (
                                    <Image
                                        source={

                                            {
                                                uri: circleimage
                                            }


                                        }

                                        style={{
                                            height: 40,
                                            width: 40,
                                            borderRadius: 40/2 ,

                                        }}
                                    >
                                    </Image>)
                                :
                                (
                                <View pointerEvents="none">
                                <SvgXml width="40"
                                    height="40"
                                    xml={DefaultAvatar} />
                               </View>
                                )

              
            }
        </AnimatedCircularProgress>

    )
}
const styles = StyleSheet.create({
  
});
