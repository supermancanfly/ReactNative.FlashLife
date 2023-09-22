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
export default class MicrosoftLoginWebView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            learningurl: 'https://instaccess.co.za/instaccess_backend_dev/index.php/v2/azure/login?url=https://instaccess.co.za/dev/' ,
            // learningurl: ApplicationDataManager.getInstance().getLearningUrl(),
            // learningurl: 'https://instaccess.co.za/instaccess_backend_dev/index.php/v2/azure/login?url=https://instaccess.co.za/dev/' ,
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
            isConnected: true,
            footerOptions: this.props.route.params.footerOptions,
            firebaseChatUserData: this.props.route.params.firebaseChatUserData,
            enable_flash_club: this.props.route.params.enable_flash_club,
            featureData: this.props.route.params.featureData,
            navigationOrders: this.props.route.params.navigationOrders,
            userData: this.props.route.params.userData,
        }
    }
    componentDidMount() {
        // // console.log("loaderror" + this.state.loaderror + "userData-------------------componentDidMount()" + JSON.stringify(this.state.userData))
        // this.getWhiteLabelSettings();
        // NetInfo.addEventListener(this.handleConnectivityChange);
    }
    handleConnectivityChange = isConnected => {
        // console.log("Internet status connect or fail" + JSON.stringify(isConnected));
        // this.setState({ isConnected: isConnected.isConnected });
    };
    componentWillUnmount() {
        // this._unsubscribe();
        // console.log("componentWillUnmount----")
    }
    getWhiteLabelSettings = async () => {
        // console.log("getWhiteLabelSettings1---");
        // console.log("this.state.learningurl"+this.state.learningurl);
        // console.log(" this.state.userData[0]"+ JSON.stringify(this.state.userData[0]))
        // // let params = "?company_id=" + ConstantValues.COMPANY_ID_STR
        // let params = "?company_id=" +  this.state.userData[0].employee_company_id
        
        // ApiGetWhiteLabelSettings(params).then(responseJson => {
        //     console.log("getWhiteLabelSettings" + JSON.stringify(responseJson))
        //     if (responseJson.length > 0) {

        //         this.setWhiteLables(responseJson)
        //         // this.setState({
        //         //     learning: responseJson[0].learning
        //         // })
        //     }
        //     console.log("this.state.learningurl"+this.state.learningurl);
        // }).catch((err) => {
        //     this.setState({ isLoading: false })
        // })

    }
    setWhiteLables = async (responseJson) => {
        // console.log("this.state.whitelabelsettings0" + JSON.stringify(responseJson))
        // // ApplicationDataManager.getInstance().setAppLogo(responseJson[0].login_logo);
        // // ApplicationDataManager.getInstance().setActionButtonBackground(responseJson[0].action_button_background_color);
        // // ApplicationDataManager.getInstance().setFooterActiveTabcolor(responseJson[0].footer_background_color);
        // // ApplicationDataManager.getInstance().setToggleOfColor(responseJson[0].toggle_off_color);
        // // ApplicationDataManager.getInstance().setToggleOnColor(responseJson[0].toggle_on_color);
        // // ApplicationDataManager.getInstance().setTabActiveColor(responseJson[0].tab_background_color);
        // // ApplicationDataManager.getInstance().setHeaderTextColor(responseJson[0].header_text_color);
        // // ApplicationDataManager.getInstance().setActionButtonTextColor(responseJson[0].action_button_text_color);
        // // ApplicationDataManager.getInstance().setHeaderBgcolor(responseJson[0].header_background_color);
        // ApplicationDataManager.getInstance().setLearningUrl(responseJson[0].learning)
        

        // await this.setState({
        //     learningurl:responseJson[0].learning,
        //     whitelabelsettings: responseJson
        // })
        // console.log("this.state.whitelabelsettings---1" + JSON.stringify(this.state.whitelabelsettings))
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

    _onLoad(webViewState) {

    //   if(webViewState.canGoBack==true){
        // if(webViewState.target==663){
            if(webViewState.title=="Instaccess - Digital Access"){
    //    this.props.navigation.navigate('Splash');
    this.props.navigation.navigate('Main', { firebaseChatUserData: this.state.firebaseChatUserData,
         navigationOrders: this.state.navigationOrders, footerOptions: this.state.footerOptions,
          featureData: this.state.featureData, 
          userData: this.state.userData,
           enable_flash_club: this.state.enable_flash_club, show_loyalty_cards: this.props.route.params.show_loyalty_cards })
      }
        // let url = webViewState.url.toString();
        // let isResponseValid = url.includes('backFromGateway');
        // if(isResponseValid){
        //   if(this.props.checkedPaymentStatus != 'checked' ){
        //     setTimeout(() => {
        //       this.props.dispatch(setPaymentStatus('checked'));
            
        //       let splitedURL = url.split("/");
        //       paymentFactorId = splitedURL[splitedURL.length -2];
        //       if(splitedURL[splitedURL.length - 1] === '0'){
        //         paymentAccepted = true;
        //         this.props.dispatch(setGatewayResponse('done', paymentFactorId));
        //       }
        //       else {
        //         paymentAccepted = false;
        //         this.props.dispatch(setGatewayResponse('rejected', paymentFactorId));
        //       }
    
              
        //       this.props.navigation.navigate('BackFromGateway', { title: '' })
        //     }, 1000);
        //   }
        // }
      }
    render() {
        return (
            <View style={styles.container}>
               
    <WebView
 
    onError={() =>
        this.setState({ loaderror: "connection failed please try again!" })
        
    }
    onNavigationStateChange={this._onLoad.bind(this)}
    onLoadStart={() => this.setState({ isLoading: true })}
    onLoadEnd={() => this.setState({ isLoading: false })}
    onLoad={() => this.setState({ isLoading: false })}
    scalesPageToFit={false}
    style={{ height: dimensionsProps.fullHeight, resizeMode: 'cover', flex: 1 }}
    injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
    source={{ uri: this.state.learningurl }}
/>    
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