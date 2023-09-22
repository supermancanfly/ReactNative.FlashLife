import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList
} from 'react-native';
import { WebView } from 'react-native-webview';
import InlineWebView from './InlineWebView';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import InternetConnectionCustom from "../utils/InternetConnectionCustom";
import ApplicationDataManager from '../utils/ApplicationDataManager';
import NetInfo from "@react-native-community/netinfo";
import MainView from './MainView';
import {
    ApiGetWebLinks,
    ApiGetWhiteLabelSettings
} from '../network/Services';
import { apiErrorHandler } from '../utils/CommonMethods';
export default class LearningView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            // learningurl: ApplicationDataManager.getInstance().getLearningUrl(),
            learningurl: "",
            employeenumber: "",
            isLoading: false,
            formsData: [],
            usertype: "",
            userData: this.props.userData,
            homeLocationData: this.props.homeLocationData,
            isWebLinksView: true,
            isWebInlineView: false,
            formDetails: [],
            whitelabelsettings: [],
            loaderror: "",
            isConnected: true
        }
    }
    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInLearningView(ConstantValues.MORE_STR);
    }
    componentDidMount() {
        // console.log("loaderror" + this.state.loaderror + "userData-------------------componentDidMount()" + JSON.stringify(this.state.userData))
        this.getWhiteLabelSettings();
        NetInfo.addEventListener(this.handleConnectivityChange);
    }
    handleConnectivityChange = isConnected => {
        this.setState({ isConnected: isConnected.isConnected });
    };
    componentWillUnmount() {
        // this._unsubscribe();
        // console.log("componentWillUnmount----")
    }
    getWhiteLabelSettings = async () => {
        // console.log("getWhiteLabelSettings1---");

        // console.log("this.state.learningurl"+this.state.learningurl);
        // console.log(" this.state.userData[0]"+ JSON.stringify(this.state.userData[0]))
        // let params = "?company_id=" + ConstantValues.COMPANY_ID_STR
        let params = "?company_id=" + this.state.userData[0].employee_company_id

        ApiGetWhiteLabelSettings(params).then(responseJson => {
            // console.log("getWhiteLabelSettings" + JSON.stringify(responseJson))
            if (responseJson.length > 0) {

                this.setWhiteLables(responseJson)
                // this.setState({
                //     learning: responseJson[0].learning
                // })
            }
        }).catch((error) => {
            this.setState({ isLoading: false })
            //Hello, I fixed api error handler
        })

    }
    setWhiteLables = async (responseJson) => {
        // ApplicationDataManager.getInstance().setAppLogo(responseJson[0].login_logo);
        // ApplicationDataManager.getInstance().setActionButtonBackground(responseJson[0].action_button_background_color);
        // ApplicationDataManager.getInstance().setFooterActiveTabcolor(responseJson[0].footer_background_color);
        // ApplicationDataManager.getInstance().setToggleOfColor(responseJson[0].toggle_off_color);
        // ApplicationDataManager.getInstance().setToggleOnColor(responseJson[0].toggle_on_color);
        // ApplicationDataManager.getInstance().setTabActiveColor(responseJson[0].tab_background_color);
        // ApplicationDataManager.getInstance().setHeaderTextColor(responseJson[0].header_text_color);
        // ApplicationDataManager.getInstance().setActionButtonTextColor(responseJson[0].action_button_text_color);
        // ApplicationDataManager.getInstance().setHeaderBgcolor(responseJson[0].header_background_color);
        ApplicationDataManager.getInstance().setLearningUrl(responseJson[0].learning)


        await this.setState({
            learningurl: responseJson[0].learning,
            whitelabelsettings: responseJson
        })
    }
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
                {this.state.isConnected && this.state.learning != "" ?
                    <WebView
                        //   useWebKit={true}
                        // startInLoadingState={true}
                        // renderLoading={this.renderProgressDialogLoader()}
                        onError={() =>
                            this.setState({ loaderror: "connection failed please try again!" })
                            // alert( "3 connection failed please try again!")
                        }
                        onLoadStart={() => this.setState({ isLoading: true })}
                        onLoadEnd={() => this.setState({ isLoading: false })}
                        onLoad={() => this.setState({ isLoading: false })}
                        //   style={{backgroundColor: 'transparent', paddingBottom: 0, padding: 0}}
                        //   scalesPageToFit={false}
                        // style={{
                        //     height: dimensionsProps.fullHeight,
                        //     width: dimensionsProps.fullWidth,
                        // }}
                        scalesPageToFit={false}
                        style={{ height: dimensionsProps.fullHeight, resizeMode: 'cover', flex: 1 }}
                        injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                        // scalesPageToFit={false}
                        // source={{ uri: this.props.formDetails.link_url }}
                        // source={{ uri: "https://flash.beezer.com/" }}
                        source={{
                            uri: "https://flash.vuca.co.za/"
                            // this.state.learningurl 
                        }}
                    />
                    :
                    <InternetConnectionCustom />
                }
                {this.renderProgressDialogLoader()}
            </View>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginBottom: 70,
    },
})