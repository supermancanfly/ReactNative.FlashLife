import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList
} from 'react-native';
import InlineWebView from './InlineWebView';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { colors, fontsProps, dimensionsProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import HeaderBackTitleProfile from '../components/shared/HeaderBackTitleProfile';
import {
    ApiGetWebLinks,
    ApiGetWhiteLabelSettings
} from '../network/Services';
import { apiErrorHandler } from '../utils/CommonMethods';
export default class WeblinkView extends React.Component {
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
            formsData: [],
            usertype: "",
            userData: this.props.userData,
            homeLocationData: this.props.homeLocationData,
            isWebLinksView: true,
            isWebInlineView: false,
            formDetails: [],
            whitelabelsettings: [],
        }
        this.onBackFormQuestion = this.onBackFormQuestion.bind(this);
    }
    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInWebLinkView(ConstantValues.MORE_STR);
    }
    handleEmployeeNumberChange = (newText) => this.setState({ employeenumber: newText })
    componentDidMount() {
        // console.log("userData-------------------componentDidMount()" + JSON.stringify(this.state.userData))
        this.getWhiteLabelSettings();
        this.getWebLinks();
    }
    componentWillUnmount() {
        // this._unsubscribe();
        // console.log("componentWillUnmount----")
    }
    getWhiteLabelSettings = async () => {
        // console.log("getWhiteLabelSettings1---");
        let params = "?company_id=" + ConstantValues.COMPANY_ID_STR
        ApiGetWhiteLabelSettings(params).then(responseJson => {
            // console.log("getWhiteLabelSettings" + JSON.stringify(responseJson))
            if (responseJson.length > 0) {
                this.setWhiteLables(responseJson)
            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    setWhiteLables = async (responseJson) => {
        // console.log("this.state.whitelabelsettings0" + JSON.stringify(responseJson))
        ApplicationDataManager.getInstance().setAppLogo(responseJson[0].login_logo);
        ApplicationDataManager.getInstance().setActionButtonBackground(responseJson[0].action_button_background_color);
        ApplicationDataManager.getInstance().setFooterActiveTabcolor(responseJson[0].footer_background_color);
        ApplicationDataManager.getInstance().setToggleOfColor(responseJson[0].toggle_off_color);
        ApplicationDataManager.getInstance().setToggleOnColor(responseJson[0].toggle_on_color);
        ApplicationDataManager.getInstance().setTabActiveColor(responseJson[0].tab_background_color);
        ApplicationDataManager.getInstance().setHeaderTextColor(responseJson[0].header_text_color);
        ApplicationDataManager.getInstance().setActionButtonTextColor(responseJson[0].action_button_text_color);
        ApplicationDataManager.getInstance().setHeaderBgcolor(responseJson[0].header_background_color);
        await this.setState({
            whitelabelsettings: responseJson
        })
        // console.log("this.state.whitelabelsettings---1" + JSON.stringify(this.state.whitelabelsettings))
    }
    getWebLinks() {
        this.setState({
            isLoading: true,
        })
        if (this.props.islearningtitle) {
            //   
            this.setState({ isLoading: false });
            let data = [];
            data.push({
                link_name: "Flash",
                link_image: Constantimages.flash_beezer_icon,
                link_url: "https://flash.beezer.com/",
                company_id: 0
            })
            this.setState({ formsData: data });
        }
        else {
            const { userData } = this.state;
            let params = "?company_id=" + userData[0].employee_company_id
            ApiGetWebLinks(userData[0].token, params).then(response => {
                this.setState({ isLoading: false });
                if (response.length > 0) {
                    this.setState({
                        formsData: response,
                    });
                }
            }).catch(error => {
                this.setState({ isLoading: false });
                apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.navigateToMore)
                // console.log(error);
            })
        }
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
    onDisplayWebView = (item) => {
        // console.log("item" + JSON.stringify(item));
        this.setState({ formDetails: item, isWebLinksView: false, isWebInlineView: true })
        // this.props.navigation.navigate('WebView',{userData:this.state.userData,formDetails: item});
        //    this.props.onFooterRemove
        // this.props.onCallParent();
    }
    renderRowInlineWebView() {
        return <InlineWebView
            userData={this.props.userData}
            formDetails={this.state.formDetails}
            onBackFormQuestion={this.onBackFormQuestion}
            navigation={this.props.navigation}
        />
    }
    async onBackFormQuestion() {
        // console.log("onBackFormQuestion");
        await this.setState({ isWebInlineView: false, isWebLinksView: true })
        if (!this.state.isWebInlineView) {
            this.props.onCallParent();
        }
    }
    renderRowWebLinks() {
        return <View style={{
            flex: 1,
        }}>

            {ConstantValues.COMPANY_ID_STR == "54" ?
                <HeaderBackTitleProfile
                    title={this.props.islearningtitle ? ConstantValues.LEARNING_AND_TRAINING_STR : ConstantValues.WEB_LINKS_STR}

                    backcolor={"colors.GREY_COLOR"}
                    headerstyle={{
                        flexDirection: 'row',
                        backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                            : colors.COLOR_THEME,
                        paddingVertical: 8,
                        paddingHorizontal: 10
                    }}
                    headerlogo={this.props.title == "fraudtypetab" ? null : Constantimages.flash_back_icon}
                    profilename={this.props.islearningtitle ? ConstantValues.LEARNING_AND_TRAINING_STR : ConstantValues.WEB_LINKS_STR}
                    buttonPress={this.props.onBackForms}
                    source={this.props.title == "weblinktab" ? null : Constantimages.back_icon}
                />
                :
                <View style={{
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
                        onPress={this.props.onBackForms}
                    >
                        <Image
                            source={this.props.title == "weblinktab" ? null : Constantimages.back_icon}

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
                        }}>{this.props.islearningtitle ? ConstantValues.LEARNING_AND_TRAINING_STR : ConstantValues.WEB_LINKS_STR}</Text>
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
            }

            <FlatList
                data={this.state.formsData}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.company_id.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity onPress={() =>
                            this.onDisplayWebView(item)
                        }
                            key={index}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingLeft: 5,
                                paddingRight: 15,
                                alignItems: 'center',
                                backgroundColor: colors.COLOR_WHITE,
                                elevation: 3,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                            }}
                        >
                            <View style={{
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                paddingVertical: 5
                            }}
                            >
                                <View style={{
                                    width: 2,
                                    height: 45,
                                    backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                                        : colors.COLOR_THEME,
                                }}>
                                </View>
                                <Text style={{
                                    fontSize: fontsProps.md,
                                    color: this.state.header_background_color != "" ? this.state.header_background_color
                                        : colors.COLOR_THEME,
                                    fontWeight: 'bold',
                                    paddingHorizontal: 5, textAlign: 'center'
                                }}>
                                    {item.link_name}
                                </Text>
                            </View>
                            <View style={{
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}
                            >
                                {this.props.islearningtitle ?
                                    <Image source={Constantimages.flash_beezer_icon}
                                        style={{
                                            width: 50, height: 50,
                                            resizeMode: 'contain',
                                        }} />
                                    :
                                    <Image source={{ uri: item.link_image }}
                                        style={{
                                            width: 50, height: 50,
                                            resizeMode: 'contain',
                                        }} />
                                }
                            </View>
                        </TouchableOpacity>
                    )
                }}
            >
            </FlatList>
            {this.renderProgressDialogLoader()}
        </View>
    }
    renderRowWebLinkView() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderProgressDialogLoader()}
            </View>
        )
    }
    render() {
        // console.log("this.props.islearningtitle" + this.props.islearningtitle)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                }}>
                    {this.state.isWebLinksView &&
                        this.renderRowWebLinks()
                    }
                    {this.state.isWebInlineView &&
                        this.renderRowInlineWebView()
                    }
                </View>
            </SafeAreaView>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 70,
    },
})