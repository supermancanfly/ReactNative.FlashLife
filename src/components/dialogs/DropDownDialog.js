import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  Platform,

} from 'react-native';
import { colors, dimensionsProps, paddingProps, fontsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import { SvgUri, SvgXml } from 'react-native-svg';
import LandingCloseButton from '../../assets/svg/landing_close_circle.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
var applicationDataManager = ApplicationDataManager.getInstance();
const DropDownDialog = ({ visible,
  title,
  background,
  onDropModalVisible,
  onSelectDropDownValue,
  dropdownvalues,
  isFromFlashLeaderShipView = false }) => {
  const [dropdownvaluesList, setDropdownValuesList] = useState([]);
  useEffect(() => {
    setDropdownValuesList([...dropdownvalues])
    console.log("Drop", dropdownvalues);
  }, [])
  const itemSelected = (item) => {
    if (item.isSelected) {
      item.isSelected = !item.isSelected;
    } else {
      item.isSelected = true;
    }
    setDropdownValuesList([...dropdownvaluesList])
  }
  return <Modal
    visible={visible}
    transparent={true}
    animationType={'slide'}
    onRequestClose={() => {

    }}
  >
    <TouchableWithoutFeedback
      onPress={onDropModalVisible}>
      <View
        transparent={true}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View style={{
          width: dimensionsProps.fullWidth - 35,
          height: (isFromFlashLeaderShipView) ?
            dimensionsProps.fullHeight - 70 :
            dimensionsProps.fullHeight - 90,
          backgroundColor: colors.COLOR_WHITE,
          elevation: 10,
          borderRadius: 5
        }}>
          <View style={{
            padding: paddingProps.sm,
            height: (isFromFlashLeaderShipView) ?
              dimensionsProps.fullHeight - 70 :
              dimensionsProps.fullHeight,
          }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <Text style={{
                padding: 5,
                color: background != "" ? background : colors.COLOR_THEME,
                fontSize: fontsProps.lg,
                fontFamily: Platform.OS === 'ios' ?
                  "Gilroy-Bold" :
                  "Radomir Tinkov - Gilroy-Regular",
              }}>
                {title}
              </Text>
              <TouchableOpacity
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  padding: 5,
                }}
                onPress={onDropModalVisible}>
                <SvgXml
                  height="30"
                  xml={LandingCloseButton}
                />
              </TouchableOpacity>
            </View>
            <View style={{
              borderBottomWidth: 0.5,
              borderColor: colors.COLOR_BLACK, marginRight: 5
            }}>
            </View>
            <ScrollView
              style={{}}
            >
              {
                dropdownvaluesList.map((item, index) => (
                  <TouchableWithoutFeedback
                    style={{
                      backgroundColor: colors.COLOR_WHITE
                    }}
                    key={index}
                    onPress={() => {
                      if (isFromFlashLeaderShipView) {
                        itemSelected(item);
                      } else {
                        onSelectDropDownValue(item);
                      }
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row"
                      }}
                    >
                      <Text
                        style={{
                          paddingVertical: 10,
                          fontSize: fontsProps.lg,
                          fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" : "Radomir Tinkov - Gilroy-Regular",
                        }}
                      >
                        {item.name}
                      </Text>
                      {item.isSelected && (
                        <Ionicons
                          name='checkmark-sharp'
                          size={20}
                          color={colors.COLOR_THEME}
                          style={{ marginHorizontal: 10 }}
                        />
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                ))
              }


            </ScrollView>
            {isFromFlashLeaderShipView && <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <TouchableOpacity style={styles.button_style} onPress={onDropModalVisible} >
                <Text style={{
                  color: colors.COLOR_WHITE,
                  fontFamily: Platform.OS === 'ios' ?
                    "Gilroy-SemiBold" :
                    "Radomir Tinkov - Gilroy-SemiBold",
                }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button_style} onPress={() => {
                let filterArray = dropdownvaluesList.filter((item) => item.isSelected);
                onSelectDropDownValue(filterArray)

              }}>
                <Text style={{
                  color: colors.COLOR_WHITE,
                  fontFamily: Platform.OS === 'ios' ?
                    "Gilroy-SemiBold" :
                    "Radomir Tinkov - Gilroy-SemiBold",
                }}>Submit</Text>
              </TouchableOpacity>
            </View>}

          </View>

        </View>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    color: colors.COLOR_BLACK,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    padding: 35,
    width: dimensionsProps.fullWidth - 35,
    borderRadius: 10,
    backgroundColor: colors.COLOR_WHITE,
    elevation: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    paddingHorizontal: 5,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  loadingContent: {
    flex: 3,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  button_style: {
    backgroundColor: colors.COLOR_BLACK,
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 2
  }
})
export default DropDownDialog;