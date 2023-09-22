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
export default function HeaderBackNavTitle({ title }) {
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: colors.COLOR_LIGHT_GRAY,
      paddingVertical: 8,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.GREY_COLOR
    }}>
      <TouchableOpacity
        style={{
          flex: 0.3,
          justifyContent: 'center',
          paddingHorizontal: 10
        }}
      >
      </TouchableOpacity>
      <View style={{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5
      }}
      >
        <Text style={{ fontSize: fontsProps.lg }}>{title}</Text>
      </View>
      <View style={{
        flex: 0.3,
      }}
      >
      </View>
    </View>
  )
}
const styles = StyleSheet.create({

});
