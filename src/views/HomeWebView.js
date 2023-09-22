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
import HeaderBackTitleProfile from '../components/shared/HeaderBackTitleProfile';
import MainView from './MainView';
import {
    ApiGetWebLinks,
    ApiGetWhiteLabelSettings
} from '../network/Services';
export default class HomeWebView extends React.Component {
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
            weblinkurl: this.props.weblinkurl.includes("https://") ? this.props.weblinkurl : "https://" + this.props.weblinkurl,
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
    componentDidMount() {
        // console.log("loaderror" + this.state.loaderror + "userData-------------------componentDidMount()" + JSON.stringify(this.state.userData))

        NetInfo.addEventListener(this.handleConnectivityChange);
    }
    handleConnectivityChange = isConnected => {
        this.setState({ isConnected: isConnected.isConnected });
    };
    componentWillUnmount() {
        // this._unsubscribe();
        // console.log("componentWillUnmount----")
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
                <HeaderBackTitleProfile
                    title={ConstantValues.WEB_LINKS_STR}
                    backcolor={"colors.GREY_COLOR"}
                    headerstyle={{
                        flexDirection: 'row',
                        backgroundColor: colors.COLOR_THEME,
                        paddingVertical: 8,
                        paddingHorizontal: 10
                    }}
                    headerlogo={Constantimages.flash_back_icon}
                    profilename={this.props.profilename}
                    buttonPress={this.props.onNavigateBack}
                    source={Constantimages.back_icon}
                />
                {this.state.isConnected && this.state.weblinkurl != "" ?
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
                        source={{ uri: this.state.weblinkurl }}
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
        marginBottom: '15%',
    },
})