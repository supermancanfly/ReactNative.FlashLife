import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import AsyncStorage from '@react-native-community/async-storage';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import {
  ApiChangePassword,
  ApiGetGeoLocateAddress,
} from '../network/Services';
import { apiErrorHandler } from '../utils/CommonMethods';
export default class HomeAddressView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      emailaddress: '',
      mobilenumber: '',
      isLoading: false,
      currentpassword: '',
      newpassword: '',
      confirmpassword: '',
      userData: this.props.userData,
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      homeLocationLatitude: 0.1,
      homeLocationLongitude: 0.1,
      currentLocationLatitude: 0.0,
      currentLocationLongitude: 0.0,
      homeofficename_home: "",
      address_home: "",
      isLocationLoading: false,
      isAddressGetFromGeoLocateAddress: false,
      zipcode_home: "",
      country_home: "",
      state_home: "",
      city_home: "",
      countryList: [],
      countryDetails: [],
      statesList: [],
      statesDetails: [],
      cityList: [],
      cityListData: [],
      cityDetails: [],
      isCountryModalVisible: false,
      isStateModalVisible: false,
      isCityModalVisible: false,
    }
  }
  navigateToMore = () => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    this.props.callBackForMoreTabInHomeAddressView(ConstantValues.MORE_STR);
  }
  componentDidMount() {
    AsyncStorage.setItem('isHomeOffice', JSON.stringify("isHomeOffice"));
  }
  componentWillUnmount() {
  }
  handleZipcodeHomeChange = (newText) => this.setState({ zipcode_home: newText })
  handleCountryHomeChange = (newText) => this.setState({ country_home: newText })
  handleStateHomeNameChange = (newText) => this.setState({ state_home: newText })
  handleCityHomeNameChange = (newText) => this.setState({ city_home: newText })
  onBack = () => {
    this.props.navigation.navigate('Main', { userData: this.state.userData });
  }
  renderProgressDialogLoader() {
    if (this.state.isLoading) {
      return (
        <ProgressDialog
          visible={this.state.isLoading}
          title={ConstantValues.LOADING_STR}
        />
      )
    }
  }
  onChangePassword = () => {
    const { userData } = this.state;
    const { currentpassword, newpassword, confirmpassword } = this.state;
    var currentPassword = currentpassword;
    var newPassword = newpassword;
    var confirmPassword = confirmpassword;
    var token = this.props.userData[0
    ].token;
    if (currentpassword == '') {
      Alert.alert(
        '',
        ConstantValues.ALERT_MESSAGE_FOR_ENTER_CURRENTPASSWORD,
        [
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else if (newpassword == '') {
      Alert.alert(
        '',
        ConstantValues.ALERT_MESSAGE_FOR_ENTER_NEW_PASSWORD,
        [
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else if (newpassword.length < 5) {
      Alert.alert(
        '',
        ConstantValues.ALERT_MESSAGE_FOR_CHECKPASSWORDLENGTH,
        [
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else if (confirmPassword == '') {
      Alert.alert(
        '',
        ConstantValues.ALERT_MESSAGE_FOR_ENTERCONFIRM_PASSWORD,
        [
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else if (confirmPassword.length < 5) {
      Alert.alert(
        '',
        ConstantValues.ALERT_MESSAGE_FOR_CHECKPASSWORDLENGTH,
        [
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else if (newPassword != confirmPassword) {
      Alert.alert(
        '',
        ConstantValues.ALERT_MESSAGE_FOR_CURRENT_PASSWORD_NOT_MATCHED_WITH_NEW_PASSWORD,
        [
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else {
      ApiChangePassword(currentPassword, newPassword, confirmPassword, token).then(responseJson => {

        if (responseJson.Authorization_Token) {
          Alert.alert(
            '',
            ConstantValues.ALERT_MESSAGE_TITLE_PASSWORDCHANGE_SUCCSESS,
            [
              {
                text: ConstantValues.OK_ALERT_STR,
              }
            ],
            { cancelable: true },
          )
        }
        else {
          Alert.alert(
            '',
            ConstantValues.ALERT_PLEASE_ENTER_VALID_CURRENTPASSWORD_STR,
            [
              {
                text: ConstantValues.OK_ALERT_STR,
              }
            ],
            { cancelable: true },
          )
        }
      }).catch((error) => {
        // console.error(err);
        //Hello, I fixed api error handler
      })
    }
  }
  renderRowHomeAddressView() {
    return (
      <View style={{
        flex: 1,
      }}>
        <View style={{
          flexDirection: 'row',
          backgroundColor: colors.COLOR_THEME,
          paddingVertical: 8,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.GREY_COLOR
        }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              paddingHorizontal: 5
            }}
            onPress={this.props.onBackForms}
          >
            <Image source={Constantimages.back_icon}
              style={{
                width: 25,
                height: 25,
                tintColor: colors.COLOR_WHITE,
              }}
            >
            </Image>
          </TouchableOpacity>
          <View style={{
            flex: 1,
            justifyContent: 'center', alignItems: 'center'
          }}>
            <Text style={{
              fontSize: fontsProps.lg, fontWeight: 'bold',
              color: colors.COLOR_WHITE,
              textAlign: 'center'
            }}>{ConstantValues.HOME_OFFICE_STR}</Text>
          </View>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              paddingHorizontal: 5
            }}
          >
            <Image source={null}
              style={{
                width: 25,
                height: 25,
              }}
            >
            </Image>
          </TouchableOpacity>
        </View>
        <View style={{
          flex: 1,
        }}>
          <View style={{
            flexDirection: 'row',
            marginVertical: 10,
            alignItems: 'center',
            marginHorizontal: paddingProps.md,
          }}>
            <Image source={Constantimages.redcircle_icon} style={{
              resizeMode: 'contain',
              width: 10,
              height: 10, alignSelf: 'center'
            }}
            />
            <Text style={{ paddingHorizontal: 5, }}>{ConstantValues.HOME_OFFICE_INFORMATION}</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={{}} keyboardShouldPersistTaps="always" >
            <View style={{
              backgroundColor: colors.COLOR_WHITE,
              marginTop: 10,
              borderRadius: 5,
              marginHorizontal: paddingProps.md,
            }}>
              <TextInput
                placeholder={ConstantValues.HOME_OFFICE_NAME_STR}
                value={this.state.homeofficename_home}
                onChangeText={this.handleHomeOfficeNameChange}
                style={{
                  fontSize: 13,
                  color: colors.COLOR_BLACK,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.COLOR_BLACK,
                  height: 50
                }}
              />
              <TextInput
                ref={input => { this.textHomeAddress = input }}
                placeholder={ConstantValues.STREET_ADDRESS_STR}
                value={this.state.address_home}
                onChangeText={this.handleAddressHomeNameChange}
                style={{
                  fontSize: 13,
                  color: colors.COLOR_BLACK,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.COLOR_BLACK,
                  height: 50,
                }}
                selection={this.state.setSelection}
              />
              {!this.state.isAddressGetFromGeoLocateAddress ?
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, }}>
                    <TouchableOpacity style={styles.SectionStyle}
                      onPress={() => {
                        this.setState({
                          isCountryModalVisible: true
                        })
                      }}>
                      <TextInput
                        ref={input => { this.textHomeCountry_Address = input }}
                        placeholder={ConstantValues.COUNTRY_STR_S}
                        style={{
                          flex: 1,
                          color: colors.COLOR_BLACK,
                        }}
                        underlineColorAndroid="transparent"
                        value={this.state.country_home}
                        editable={false}
                      />
                      <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
                    </TouchableOpacity>
                  </View>
                </View>
                :
                <TextInput
                  placeholder={ConstantValues.COUNTRY_STR_S}
                  value={this.state.country_home}
                  onChangeText={this.handleCountryHomeChange}
                  style={{
                    height: 50,
                    fontSize: 13,
                    color: colors.COLOR_BLACK,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.COLOR_BLACK
                  }}
                />
              }
              {!this.state.isAddressGetFromGeoLocateAddress ?
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, }}>
                    <TouchableOpacity style={styles.SectionStyle}
                      onPress={() => {
                        this.setState({
                          isStateModalVisible: true
                        })
                      }}>
                      <TextInput
                        ref={input => { this.textEmailAddress = input }}
                        placeholder={ConstantValues.STATE_STR_S}
                        style={{
                          flex: 1
                          ,
                          color: colors.COLOR_BLACK,
                          paddingVertical: 10,
                        }}
                        underlineColorAndroid="transparent"
                        value={this.state.state_home}
                        editable={false}
                      />
                      <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
                    </TouchableOpacity>
                  </View>
                </View>
                :
                <TextInput
                  placeholder={ConstantValues.STATE_STR_S}
                  value={this.state.state_home}
                  onChangeText={this.handleStateHomeNameChange}
                  style={{
                    fontSize: 13,
                    height: 50,
                    color: colors.COLOR_BLACK,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.COLOR_BLACK
                  }}
                />
              }
              {!this.state.isAddressGetFromGeoLocateAddress ?
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, }}>
                    <TouchableOpacity style={styles.SectionStyle}
                      onPress={() => {
                        this.setState({
                          isCityModalVisible: true
                        })
                      }}>
                      <TextInput
                        ref={input => { this.textEmailAddress = input }}
                        placeholder={ConstantValues.CITY_STR_S}
                        style={{
                          flex: 1,
                          color: colors.COLOR_BLACK,
                          paddingVertical: 10,
                        }}
                        underlineColorAndroid="transparent"
                        value={this.state.city_home}
                        editable={false}
                      />
                      <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
                    </TouchableOpacity>
                  </View>
                </View>
                :
                <TextInput
                  placeholder={ConstantValues.CITY_STR_S}
                  value={this.state.city_home}
                  onChangeText={this.handleCityHomeNameChange}
                  style={{
                    fontSize: 13,
                    color: colors.COLOR_BLACK,
                    borderBottomWidth: 0.5,
                    height: 50,
                    borderBottomColor: colors.COLOR_BLACK
                  }}
                />
              }
              <TextInput
                placeholder={ConstantValues.ZIP_OR_POSTCODE_STR}
                value={this.state.zipcode_home}
                onChangeText={this.handleZipcodeHomeChange}
                style={{
                  fontSize: 13,
                  color: colors.COLOR_BLACK,
                  height: 50
                }}
              />
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginHorizontal: paddingProps.md, }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginVertical: 5,
                  backgroundColor: colors.COLOR_THEME,
                  borderRadius: 30,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 5,
                  paddingVertical: 15,
                  marginRight: 5
                }}
                onPress={this.geoLocateAddress}
              >
                <Text style={{ paddingHorizontal: 5, color: colors.COLOR_WHITE, fontSize: fontsProps.sm, fontWeight: 'bold', textAlign: 'center' }}>
                  {ConstantValues.CLICK_HERE_GET_GEO_ADDRESS}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                width: 60,
                height: 60,
                backgroundColor: colors.COLOR_THEME,
                borderRadius: 60 / 2,
                elevation: 8,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 5
              }}
                onPress={this.onCreateHomeLocation}
              >
                <Image source={Constantimages.tick_icon} style={{
                  resizeMode: 'contain',
                  width: 25,
                  height: 25,
                }}
                />
              </TouchableOpacity>
            </View>
            <MapView
              ref={map => { this.map = map }}
              style={{ height: dimensionsProps.fullHeight / 3, marginVertical: 10, }}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              followsUserLocation={true}
              maxZoomLevel={15}
              region={
                {
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                  latitudeDelta: this.state.latitudeDelta,
                  longitudeDelta: this.state.longitudeDelta
                }
              }
              initialRegion={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: this.state.latitudeDelta,
                longitudeDelta: this.state.longitudeDelta
              }}
            >
              {this.mapMarkers()}
            </MapView>
          </ScrollView>
          {this.renderProgressDialogLoader()}
        </View>
      </View>
    )
  }
  mapMarkers = () => {
    return <MapView.Marker
      image={
        Constantimages.bluecircle_icon
      }
      onPress={() => this.onMarkerPressed()}
      coordinate={{
        latitude: this.state.homeLocationLatitude,
        longitude: this.state.homeLocationLongitude
      }}
      style={{
        width: 10,
        height: 15
      }}
    >
    </MapView.Marker>
  }
  geoLocateAddress = async () => {
    this.setState({
      isLocationLoading: true,
      isAddressGetFromGeoLocateAddress: true
    })
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          currentLocationLatitude: position.coords.latitude,
          currentLocationLongitude: position.coords.longitude,
        });
        this.getAddress(position.coords.latitude, position.coords.longitude);
      },
      (error) => console.log("location getting error " + JSON.stringify(error), this.setState({ isLocationLoading: false })),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 },
    );
  }
  async getAddress(latitude, longitude) {
    await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + "AIzaSyD9X8PhstM010NqVUra7dLkqiOreGuE41s")
      .then((response) => response.json())
      .then((responseJson) => {
        let cityHome = "";
        let stateHome = "";
        let countryHome = "";
        if (responseJson.results.length > 0) {
          if (responseJson.results[0].address_components.length > 0) {
            for (let i = 0; i < responseJson.results[0].address_components.length; i++) {
              if (responseJson.results[0].address_components[i].types[0] == "administrative_area_level_2") {
                cityHome = responseJson.results[0].address_components[i].long_name;
                this.setState({
                  city_home: responseJson.results[0].address_components[i].long_name,
                })
              }
              if (responseJson.results[0].address_components[i].types[0] == "administrative_area_level_1") {
                stateHome = responseJson.results[0].address_components[i].long_name;
                this.setState({
                  state_home: responseJson.results[0].address_components[i].long_name
                })
              }
              if (responseJson.results[0].address_components[i].types[0] == "country") {
                countryHome = responseJson.results[0].address_components[i].long_name;
                this.setState({
                  country_home: responseJson.results[0].address_components[i].long_name
                })
              }
              if (responseJson.results[0].address_components[i].types[0] == "postal_code") {
                this.setState({
                  zipcode_home: responseJson.results[0].address_components[i].long_name
                })
              }
            }
          }
          let formatedAddress = responseJson.results[0].formatted_address;
          let streetaddrees = [];
          formatedAddress.split(',').map((substring) =>
            streetaddrees.push({
              name: substring
            })
          )
          if (streetaddrees.length > 2) {
            this.setState({
              address_home: streetaddrees[0].name + " , " + streetaddrees[1].name,
            })
          }
          else {
            this.setState({
              address_home: responseJson.results[0].formatted_address
            })
          }
          this.setState({
            isLocationLoading: false
          })
          if (this.state.isLocationLoading == false) {
            this.getGeoLocateAddressValuesForDropDown(countryHome, stateHome, cityHome);
          }
        }
      }).catch(error => {
        console.log("error" + error)
        this.setState({
          isLocationLoading: false
        })
      })
  }
  getGeoLocateAddressValuesForDropDown = async (countryHome, stateHome, cityHome) => {
    let params = "?city=" + cityHome + "&state=" + stateHome + "&country=" + countryHome
    let countryData = this.state.countryList;
    let countryDetails = this.state.countryDetails;
    let stateData = this.state.statesList;
    let stateDetails = this.state.statesDetails;
    let cityData = this.state.cityList;
    let cityDetails = this.state.cityDetails
    this.setState({ isLoading: true })
    ApiGetGeoLocateAddress(params).then(responseJson => {
      this.setState({ isLoading: false });
      if (responseJson) {
        countryData.push(<Picker.Item value={responseJson.country.country_name}
          label={responseJson.country.country_name} key={countryData.length + 1} />);
        stateData.push(<Picker.Item value={responseJson.state.state_name}
          label={responseJson.state.state_name} key={stateData.length + 1} />);
        cityData.push(<Picker.Item value={responseJson.city.city_name}
          label={responseJson.city.city_name} key={cityData.length + 1} />);
        countryDetails.push({
          country_name: responseJson.country.country_name,
          id: responseJson.country.id
        });
        stateDetails.push({
          state_name: responseJson.state.state_name,
          id: responseJson.state.id
        });
        cityDetails.push({
          city_name: responseJson.city.city_name,
          id: responseJson.city.id
        });
      }
      this.setState({
        countryList: countryData,
        statesList: stateData,
        cityList: cityData,
        countryDetails: countryDetails,
        statesDetails: stateDetails,
        cityDetails: cityDetails,
        citySelectedId: responseJson.city.id,
        stateSelectedId: responseJson.state.id,
        countryselectedId: responseJson.country.id,
      })
      this.setState({ isLoading: false });
    }).catch(error => {
      this.setState({ isLoading: false });
      // console.log(error);
      //Hello, I fixed api error handler
    })
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        {this.renderRowHomeAddressView()}
        {/* {this.renderProgressDialogLoader()} */}
        {/* </View> */}
        {this.state.isCountryModalVisible &&
          <Modal
            animationType="slide"
            visible={this.state.isCountryModalVisible}
            transparent={true}
            onRequestClose={() => {
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  isCountryModalVisible: false
                })
              }}
            >
              <View transparent={true}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 50
                }}>
                <View style={{
                  width: dimensionsProps.fullWidth - 35,
                  backgroundColor: colors.COLOR_WHITE,
                  elevation: 10,
                }}>
                  <Text style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    color: colors.COLOR_BLACK, fontSize: fontsProps.md, fontWeight: 'bold'
                  }}>
                    {ConstantValues.SELECT_COUNTRY_STR}
                  </Text>
                  <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
                  </View>
                  <View style={{ padding: paddingProps.sm }}>
                    <ScrollView>
                      {this.state.countryDetails.map((item, index) => (
                        <TouchableOpacity style={{
                          backgroundColor: colors.COLOR_WHITE
                        }} key={index}
                          onPress={() =>
                            this.onCountryChange(item, index)
                          }
                        >
                          <Text style={{ paddingVertical: 10, fontSize: fontsProps.md }}>{item.country_name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {this.state.isStateModalVisible &&
          <Modal
            animationType="slide"
            visible={this.state.isStateModalVisible}
            transparent={true}
            onRequestClose={() => {
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  isStateModalVisible: false
                })
              }}
            >
              <View transparent={true}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 50
                }}>
                <View style={{
                  width: dimensionsProps.fullWidth - 35,
                  backgroundColor: colors.COLOR_WHITE,
                  elevation: 10,
                }}>
                  <Text style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    color: colors.COLOR_BLACK, fontSize: fontsProps.md, fontWeight: 'bold'
                  }}>
                    {ConstantValues.SELECT_STATE_STR}
                  </Text>
                  <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginHorizontal: 5 }}>
                  </View>
                  <View style={{ padding: paddingProps.sm }}>
                    <ScrollView>
                      {this.state.statesDetails.map((item, index) => (
                        <TouchableOpacity style={{
                          backgroundColor: colors.COLOR_WHITE
                        }} key={index}
                          onPress={() =>
                            this.onStateChange(item, index)
                          }
                        >
                          <Text style={{ paddingVertical: 10, fontSize: fontsProps.md }}>{item.state_name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {this.state.isCityModalVisible &&
          <Modal
            animationType="slide"
            visible={this.state.isCityModalVisible}
            transparent={true}
            onRequestClose={() => {
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  isCityModalVisible: false
                })
              }}
            >
              <View transparent={true}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 50
                }}>
                <View style={{
                  width: dimensionsProps.fullWidth - 35,
                  backgroundColor: colors.COLOR_WHITE,
                  elevation: 10,
                }}>
                  <Text style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    color: colors.COLOR_BLACK, fontSize: fontsProps.md, fontWeight: 'bold'
                  }}>
                    {ConstantValues.SELECT_CITY_STR}
                  </Text>
                  <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginHorizontal: 5 }}>
                  </View>
                  <View style={{ padding: paddingProps.sm }}>
                    <ScrollView>
                      {this.state.cityDetails.map((item, index) => (
                        <TouchableOpacity style={{
                          backgroundColor: colors.COLOR_WHITE
                        }} key={index}
                          onPress={() =>
                            this.onCityChange(item, index)
                          }
                        >
                          <Text style={{ paddingVertical: 10, fontSize: fontsProps.md }}>{item.city_name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
      </View>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.COLOR_LIGHT_GRAY,
    borderWidth: 1,
    borderColor: colors.GREY_COLOR,
    borderRadius: 5,
    elevation: 3,
    margin: 10
  },
  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
    tintColor: colors.GREY_COLOR
  },
})
