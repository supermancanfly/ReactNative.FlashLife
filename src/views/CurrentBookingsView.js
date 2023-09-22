import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    Platform,
    UIManager,
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import { color } from 'react-native-reanimated';
export default class CurrentBookingsView extends React.Component {
    constructor(props) {
        super(props)
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true)
        }
        this.state = {
            isLoading: false,
            userData: this.props.userData,
            whitelabelsettings: [],
            clubMonthList: [],
            isOrderDateOpen: false,
            valueNominationList: [],
            additionalnotes: "",
            isLunchSubmitted: false,
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            header_background: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            isLoading: false,
            userData: this.props.userData,
            whitelabelsettings: [],
            clubMonthList: [],
            valueNominationList: [],
            additionalnotes: "",
            clubScoresList: [],
            pointsByMonth: [],
            monthcount: 0
        }
    }
    componentDidMount() {
        this.props.callBackMethodFromSubchildBookings()
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <View style={styles.MainContainer}>
                <ScrollView contentContainerStyle={{
                    flex: 1,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {
                        <View style={{
                            flex: 1,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // backgroundColor: colors.COLOR_WHITE,
                            // elevation: 5,
                            borderRadius: 5,
                            margin: 10
                        }}>
                            <Image source={Constantimages.Bookings_image_icon}
                                style={{
                                    width: 100,
                                    height: 70,
                                    resizeMode: 'contain'
                                    // tintColor: this.state.header_background != "" ?
                                    //     this.state.header_background :
                                    //     colors.COLOR_THEME,
                                }}
                            >
                            </Image>
                            <Text style={{
                                fontSize: fontsProps.lg,
                                fontWeight: 'bold',
                                color: colors.COLOR_BLACK,
                                textAlign: 'center',
                                paddingVertical: 5,
                                paddingHorizontal: 5,
                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" :
                                    "Radomir Tinkov - Gilroy-Bold",

                                // fontWeight:'700',
                                // fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                                // "Radomir Tinkov - Gilroy-Medium",

                            }}>
                                {this.props.viewtype == "menu" ? "New menu not\navailable yet" : "You have no\nplaced orders"}
                                {/* Orders currently unavailable */}
                                {/* New menu not available yet */}
                                {/* {ConstantValues.CURRENTLY_UNAVAILABLE_STR} */}
                            </Text>
                            <Text style={{
                                fontSize:
                                    // this.props.viewtype =="menu"?
                                    fontsProps.md,
                                // :fontsProps.lg,
                                color:
                                    //  this.props.viewtype =="menu"?
                                    colors.GREY_COLOR
                                // :colors.COLOR_BLACK
                                ,
                                textAlign: 'center',
                                // paddingVertical: 5,
                                paddingHorizontal: 5,
                                // fontWeight:'700',
                                fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" :

                                    "Radomir Tinkov - Gilroy-Bold",

                                // Platform.OS === 'ios' ? "Gilroy-Medium" :
                                // "Radomir Tinkov - Gilroy-Medium",

                            }}>
                                {this.props.viewtype == "menu" ? "Please check back. The new menu is usually released the Tuesday before." : "Your orders only show here once the menu closes for the week."}

                                {/* {ConstantValues.NEW_ORDERS_CURRENTLY_UNAVAILABLE_STR} */}
                                {/* Please check in again next week on XX? */}
                                {/* Please check back.the new menu is usually released the Tuesday before. */}

                            </Text>
                        </View>
                    }
                </ScrollView>
            </View>
        );
    }
};
const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'#C1C3C8',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },
})
