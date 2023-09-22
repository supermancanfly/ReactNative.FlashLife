import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  ImageBackground,
  PixelRatio,
  ScrollView,
  Pressable,
  Dimensions
} from 'react-native';
// import FastImage from 'react-native-fast-image'
import { colors, dimensionsProps } from '../../utils/StyleComponents';
import { SvgUri, SvgXml } from 'react-native-svg';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import LandingCloseButton from '../../assets/svg/landing_close_circle.svg';
const LandingDialog = ({ visible, data, onControlDialogVisible }) => {
  // console.log("DATA:", JSON.stringify(data));
  const [imageHeightReq, setImageHeight] = useState(dimensionsProps.fullHeight * 0.5);
  let imageWidth = null;
  let imageHeight = dimensionsProps.fullWidth * 0.8;

  if (data != null && data.landing_image != null) {
    Image.getSize(data.landing_image, (width, height) => {
      const screenWidth = Dimensions.get('window').width;
      const scaleFactor = width / screenWidth;
      const requiredHeight = height / scaleFactor;
      imageWidth = screenWidth;
      imageHeight = requiredHeight;
      // console.log("Image_Height", height);
      // console.log("Required_height", requiredHeight);
      setImageHeight(requiredHeight);
    });

  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={"slide"}
      onRequestClose={() => { onControlDialogVisible }}>

      {/* <TouchableWithoutFeedback
        onPress={onControlDialogVisible}> */}

      <View style={{ flex: 1 }}>
        <Pressable style={{ flex: 1 }} onPress={onControlDialogVisible}>
          <View style={{ flex: 1, backgroundColor: '#27272778', }}>
          </View>
        </Pressable>


        <View style={{
          backgroundColor: '#F9F9F9',//colors.COLOR_WHITE,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          padding: 10,
          // marginHorizontal: 5.0,
          // marginVertical: 5.0
        }}>

          <View style={{
            flexDirection: "row",
            marginBottom: 5.0,
            height: 20,
            justifyContent: "flex-end",
            alignItems: 'center'
          }}>
            <View style={{
              backgroundColor: '#D8D8D8',
              marginHorizontal: dimensionsProps.fullWidth * 0.30,
              height: 4,
              width: 100.0,
              marginBottom: 10.0
            }}></View>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={onControlDialogVisible}>
              <SvgXml
                height="30"
                xml={LandingCloseButton}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={{
            backgroundColor:
              '#F9F9F9',

          }}>
            {data.landing_image &&
              <Image style={{
                borderRadius: 10,
                // padding: 18,
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.3,
                overflow: 'hidden',
                width: imageWidth,
                // height: imageHeight,
                // resizeMode: 'cover',
                // alignSelf: 'auto',
                // aspectRatio: 1.5,
                height: imageHeightReq,
              }}
                source={{ uri: data.landing_image, cache: "force-cache" }}
                resizeMode={'contain'}
              >
              </Image>
            }
            <View style={{
              backgroundColor: '#FFFFFF',
              elevation: 2,
              padding: 10,
              marginTop: 10,
              marginHorizontal: 2,
              borderRadius: 5
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 5,
                // paddingLeft: 6,
              }}>
                <View pointerEvents="none">
                  <SvgXml width="20"
                    height="20"
                    xml={data.icon} />
                </View>
                <Text style={{
                  paddingLeft: 6,
                  color: data.maincolor,
                  fontWeight: '700',
                  fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                    "Radomir Tinkov - Gilroy-Medium"
                }}>
                  {data.headertitle}
                </Text>
              </View>
              <View>
                <Text style={{
                  color: colors.COLOR_BLACK,
                  fontWeight: 'bold',
                  fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                    "Radomir Tinkov - Gilroy-Medium"
                }}>
                  {data.landing_header}
                </Text>
                <Text style={{
                  color: colors.GREY_COLOR,
                  fontWeight: '400',
                  fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                    "Radomir Tinkov - Gilroy-Medium"
                }}>
                  {data.landing_text}
                </Text>
              </View>

            </View>
            <TouchableOpacity
              onPress={onControlDialogVisible}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.COLOR_BLACK,
                borderRadius: 5,
                elevation: 5,
                width: null,
                height: 50,
                alignSelf: 'center',
                marginTop: 20,
                marginBottom: 20.0
              }}>

              <View style={{ flex: 2, flexDirection: "row", justifyContent: "center", alignItems: "center", }}>
                <Text
                  style={{
                    flex: 2,
                    fontSize: 16,
                    color: colors.COLOR_WHITE,
                    textAlign: 'center',
                    marginLeft: dimensionsProps.fullWidth * 0.10,
                    fontWeight: "bold",
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                      "Radomir Tinkov - Gilroy-Medium"

                  }}>
                  Got it!
                </Text>
                <View style={{ flexDirection: "row", marginHorizontal: 15 }}>
                  <Image
                    source={Constantimages.forword_double_arrow}
                    style={{
                      height: 20, width: 20,
                      resizeMode: 'contain',
                      tintColor: ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"
                    }}
                  />
                </View>
              </View>

            </TouchableOpacity>
          </ScrollView>

        </View>

      </View>
      {/* </TouchableWithoutFeedback> */}

    </Modal >)
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
export default LandingDialog;