
import React, { Component } from 'react'
import {
    View,
    Image,

    StyleSheet, TouchableOpacity, Text
} from 'react-native'

import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps } from '../utils/StyleComponents';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import NetInfo from "@react-native-community/netinfo";
import InternetConnectionCustom from "../utils/InternetConnectionCustom";
import ProgressDialog from '../components/dialogs/ProgressDialog';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import { WebView } from 'react-native-webview';
import { ScrollView } from 'react-native-gesture-handler';
export default class InlineWebView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            employeenumber: "",
            isLoading: false,
            employeeData: [],
            formsData: [],
            usertype: "",
            userData: this.props.userData,
            formDetails: this.props.formDetails,
            isDateTimePickerVisible: false,
            selectedDateRow: [],
            isDropDownVisible: false,
            dropDownList: [],
            dropDownDetails: [],
            photo: null,
            profileimageBlob: null,
            isSignatureCapture: false,
            selectedSignatute: [],
            selectedImageData: [],
            singleFile: null,
            whitelabelsettings: [],
            loaderror: "",
            isConnected: true
        }

    }

    componentDidMount() {
        // console.log("loaderror"+this.state.loaderror+"userData-------------------componentDidMount()" + JSON.stringify(this.state.userData))
        // this.getWhiteLabelSettings();
        NetInfo.addEventListener(this.handleConnectivityChange);


    }

    handleConnectivityChange = isConnected => {
        this.setState({ isConnected: isConnected.isConnected });
    };

    renderProgressDialogLoader() {
        if (this.state.isLoading) {
            return (
                <ProgressDialog
                    visible={this.state.isLoading}
                    title={ConstantValues.LOADING_STR}
                    background={this.state.header_background_color}
                />
            )
        }
    }


    render() {
        return (
            <View style={styles.container}>
                {/* <View style={{
                    flexDirection: 'row',
                    backgroundColor: this.state.header_background_color != "" ?
                        this.state.header_background_color : colors.COLOR_THEME,
                    paddingVertical: 8,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            paddingHorizontal: 5
                        }}
                        onPress={this.props.onBackFormQuestion}
                    >
                        <Image source={Constantimages.back_icon}
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: this.state.header_text_color != "" ? this.state.header_text_color : colors.COLOR_WHITE,
                            }}
                        >
                        </Image>
                    </TouchableOpacity>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: fontsProps.lg,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: this.state.header_text_color != "" ? this.state.header_text_color : colors.COLOR_WHITE,
                        }}>{this.props.formDetails.link_name}</Text>
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
                </View> */}

                {this.state.isConnected ?
                    <WebView
                        //   useWebKit={true}
                        // startInLoadingState={true}
                        onError={() =>
                            this.setState({ loaderror: "connection failed please try again!" })
                            // alert( "3 connection failed please try again!")
                        }
                        onLoadStart={() => this.setState({ isLoading: true })}
                        onLoadEnd={() => this.setState({ isLoading: false })}

                        scalesPageToFit={false}
                        style={{
                            height: dimensionsProps.fullHeight,
                            resizeMode: 'cover',
                            flex: 1
                        }}
                        injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                        // scalesPageToFit={false}
                        source={{ uri: this.props.formDetails.link_url }}

                    />

                    :

                    <InternetConnectionCustom />
                }

                {this.renderProgressDialogLoader()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginBottom:10
        marginBottom: '15%'
    }
})
