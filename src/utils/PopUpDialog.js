import React, { Component } from "react";
import { Text, TouchableOpacity, View, Modal, StyleSheet, TouchableWithoutFeedback, Image } from "react-native";
import PropTypes from 'prop-types';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../utils/StyleComponents';
import { ConstantValues } from '../utils/ConstantValues'
export default function PopUpDialog({
  sendResponseButton,
  positiveButton,
  maintitle,
  title,
  subtitle,
  message,
  visible,
  imagesource,
  iconbackgroundcolor,
  checkwebapp
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
    >
      <TouchableWithoutFeedback
      >
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', }}>
          <View
            style={{
              backgroundColor: colors.COLOR_WHITE,
              justifyContent: 'center',
              marginHorizontal: paddingProps.xxl,
              borderRadius: 10,
              width: dimensionsProps.fullWidth - 70
            }}>

            <View style={{
              width: 65,
              height: 65,
              borderRadius: 65 / 2,
              backgroundColor: iconbackgroundcolor,
              alignSelf: 'center',
              bottom: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: colors.COLOR_WHITE
            }}>
              <Image source={
                imagesource
              }
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: 'center',
                  tintColor: colors.COLOR_WHITE,
                }} >
              </Image>
            </View>
            {subtitle == ConstantValues.NEW_MESSAGE_STR ?
              <Text style={{
                fontSize: fontsProps.lg,
                color: colors.COLOR_BLACK,
                textAlign: 'center',
                fontWeight: 'bold',
                bottom: 20
              }}>{subtitle}</Text>
              :
              <Text style={{
                fontSize: fontsProps.lg,
                color: colors.COLOR_BLACK,
                textAlign: 'center',
                fontWeight: 'bold',
                bottom: 20
              }}>{maintitle}</Text>
            }

            {title != "" &&
              <View style={{ bottom: 10 }}>
                <Text
                  style={{
                    fontSize: fontsProps.sm,
                    color: colors.GREY_COLOR,
                    textAlign: 'center',
                    // paddingHorizontal: 10,
                    // paddingTop: 10,
                  }}>{title}</Text>
                <Text
                  style={{
                    fontSize: fontsProps.sm,
                    color: colors.GREY_COLOR,
                    textAlign: 'center',
                    // paddingHorizontal: 10,
                    // paddingBottom: 10,
                  }}>{maintitle == ConstantValues.VISITOR_ARRAIVAL_STR ? null : subtitle} </Text>
              </View>
            }
            {((message == ConstantValues.SEND_RESPONSE_STR &&
              checkwebapp != "webApp") &&
              subtitle != ConstantValues.NEW_MESSAGE_STR &&
              maintitle != "Content Feed") ?
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: colors.COLOR_BLACK,
                  backgroundColor: iconbackgroundcolor,
                  borderRadius: 30,
                  // marginVertical: 10,
                  paddingVertical: paddingProps.tosm,
                  paddingHorizontal: paddingProps.lg,
                  alignSelf: 'center',
                  // bottom: 20
                  marginVertical: 10
                }}
                onPress={sendResponseButton}
                activeOpacity={0.7}
              >
                <Text style={{
                  color: colors.COLOR_WHITE,
                  textAlign: 'center',
                  fontSize: fontsProps.md,
                }}>{ConstantValues.SEND_RESPONSE_STR} </Text>
              </TouchableOpacity>
              :
              null
            }
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.COLOR_BLACK,
                // backgroundColor: maintitle == ConstantValues.VISITOR_ARRAIVAL_STR || ConstantValues.LUNCH_ORDRES_STR ? colors.COLOR_DARK_RED : iconbackgroundcolor,
                borderRadius: 30,
                // marginVertical: 10,
                bottom: 10,
                paddingVertical: paddingProps.tosm,
                paddingHorizontal: paddingProps.lg,
                alignSelf: 'center',
                marginVertical: 10
              }}
              onPress={positiveButton}
              activeOpacity={0.7}>
              <Text style={{
                color: colors.COLOR_WHITE,
                textAlign: 'center',
                fontSize: fontsProps.md,
              }}>{title != "" ? ConstantValues.CLOSE_STR : ConstantValues.OK_ALERT_STR} </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
PopUpDialog.propTypes = {
  positiveButton: PropTypes.func.isRequired,
  maintitle: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  message: PropTypes.string,
  visible: PropTypes.any,
  imagesource: PropTypes.number,
  iconbackgroundcolor: PropTypes.string,
}
const styles = StyleSheet.create({
  Alert_Main_View: {
    backgroundColor: colors.COLOR_WHITE,
    marginHorizontal: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 7,
  },
});