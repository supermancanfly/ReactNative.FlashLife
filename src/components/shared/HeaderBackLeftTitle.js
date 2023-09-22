  import React from 'react';
  import {
      View,
      Text,
      StyleSheet,
      TouchableOpacity,
      Image
  } from 'react-native';
  import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
  import { ConstantValues } from '../../utils/ConstantValues';
  import Constantimages from '../../utils/ConstantImages';
  export default function HeaderBackLeftTitle({ title }) {
      return (
      <View style={{
      flexDirection: 'row',
      backgroundColor: colors.COLOR_LIGHT_GRAY,
      paddingVertical: 8,
      borderBottomWidth:0.5,
      borderBottomColor:colors.GREY_COLOR
    }}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          paddingHorizontal: 5
        }}
      >
        <Image source={Constantimages.back_icon}
          style={{
            width: 25,
            height: 25,
            tintColor: colors.COLOR_BLACK,
          }}
        >
        </Image>
      </TouchableOpacity>
        <Text style={{ fontSize: fontsProps.lg,fontWeight:'bold' }}>{title}</Text>
    </View> 
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
  