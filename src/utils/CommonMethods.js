import {
    Alert,
    Linking,
    PermissionsAndroid,
    Platform
} from 'react-native';
import { ConstantValues } from '../utils/ConstantValues';
import AsyncStorage from '@react-native-community/async-storage';
import {
    ApiUserLogout,
} from '../network/Services';
import ApplicationDataManager from './ApplicationDataManager';

export const ValidateAlertPop = (message) => {

    let status = ApplicationDataManager.getInstance().getIsNetworkAlertShowing();

    if (Platform.OS == 'ios') {
        setTimeout(() => {
            Alert.alert(
                '',
                message,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: false },
            );

        }, 1000);

    } else {
        Alert.alert(
            '',
            message,
            [
                {
                    text: ConstantValues.OK_ALERT_STR,
                }
            ],
            { cancelable: false },
        );
    }

}



export const onResetActions = (props) => {

    // ApiUserLogout(sharedpreference.getAuthToken()).then(responseJson => {
    //     AsyncStorage.removeItem('mobile_number', err => {
    //     });
    //     AsyncStorage.removeItem('password', err => {
    //     });
    ResetNavigation(props, "Login")

    // }).catch((err) => {
    // })
    // ApiUserLogout(
    //     // this.props.userData[0].token
    //     // props
    //     ).then(responseJson => {
    //     this.setState({ isLoading: false })
    //     this.resetActions()
    //   }).catch((err) => {
    //     this.setState({ isLoading: false })
    //   this.resetActions();
    //   })
}
// resetActions = () => {
//     AsyncStorage.removeItem('email', err => {
//     });
//     AsyncStorage.removeItem('password', err => {
//     });
//     AsyncStorage.removeItem('userToken', err => {
//     });
//     this.props.navigation.dispatch(
//       CommonActions.reset({
//         index: 0,
//         routes: [
//           { name: 'Login' },
//         ],
//       })
//     );
//   }
export const ResetNavigation = (props, routeName) => {
    AsyncStorage.removeItem('email', err => {
    });
    AsyncStorage.removeItem('password', err => {
    });
    AsyncStorage.removeItem('userToken', err => {
    });
    props.navigation.reset({
        index: 0,
        routes: [{ name: routeName }],
    })
}
// export const onCameraPermissions = (type) => {
//     var that = this;
//     async function requestCameraPermission() {
//         const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//                 title: 'AndoridPermissionExample App Camera Permission',
//                 message: 'AndoridPermissionExample App needs access to your camera ',
//             }
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             // proceed();
//             // return granted;
//         } else {
//         }
//     }
//     if (Platform.OS === 'android') {
//         requestCameraPermission();
//     } else {
//         // proceed();
//         // return granted;
//     }
// }
// if (typeof yourVariable === 'undefined'){
export const sendEmailViaEmailApp = (toMailId, subject, body, attachment) => {
    if (typeof toMailId !== 'undefined') {
        let link = `mailto:${toMailId}`;
        //     if (
        //         typeof subject !== 'undefined'
        //         ) {
        //       link = `${link}?subject=${subject}`;
        //     }
        //    if (
        //     typeof subject == 'undefined'
        //        ) {
        //      link = `${link}?body=${body}`;
        //    } else {
        //      link = `${link}&body=${body}`;
        //    }
        //    if(typeof attachment !== 'undefined'){
        //     link = `${link}&attachment=${attachment}`;
        //    }
        link = `${link}?attachment=${attachment}`;
        Linking.canOpenURL(link)
            .then(supported => {
                if (supported) {
                    // 'mailto:support@example.com?subject=Billing Query&body=Description'
                    Linking.openURL(link);
                }
            })
            .catch(err => console.error('An error occurred', err));
    } else {
    }
};
export const onCameraPermissions = (type) => {
    var that = this;
    async function requestCameraPermission() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'AndoridPermissionExample App Camera Permission',
                message: 'AndoridPermissionExample App needs access to your camera ',
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // proceed();
            // value= "you can use camera";
            return "sai"
        } else {
        }
    }
    if (Platform.OS === 'android') {
        requestCameraPermission();
    } else {
        // proceed();
        value = "you can use camera";
    }
    // return value;
}

export const apiErrorHandler = (props, error, message, onPress) => {
    // console.log("FALSH HOME");
    let status = ApplicationDataManager.getInstance().getIsNetworkAlertShowing();
    // console.log("getIsNetworkAlertShowing : ", status);
    if (status) {
        return;
    }

    // if (error.name && error.name === 'AbortError') {
    //     console.log("FETCH API ERROR : AbortError");

    // }

    if ((error.name && error.name === 'AbortError') || (error == "TypeError: Network request failed")) {

        console.log("FETCH API ERROR : TypeError: Network request failed");
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(true);
        if (Platform.OS == 'ios') {
            setTimeout(() => {
                // ValidateAlertPop(ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE)

                Alert.alert(
                    '',
                    message,
                    [
                        {
                            text: ConstantValues.OK_ALERT_STR,
                            onPress: onPress
                        }
                    ],
                    { cancelable: false },
                );
            }, 1500);
        }
        else {
            // ValidateAlertPop(ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE)

            Alert.alert(
                '',
                message,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                        onPress: onPress
                    }
                ],
                { cancelable: false },
            );
        }

        // return;
    }


}





export const fetchWithTimeout = async (resource, options = {}) => {

    const { timeout = 8000 } = options;
    // console.log("TIME OUT OPTIONS : ", JSON.stringify(options));
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

export const navigateToMore = (props) => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    props.callBackForMoreTab(ConstantValues.MORE_STR);
}


export const showRedeemSuccessPopup = (message, props) => {

    if (Platform.OS == 'ios') {
        setTimeout(() => {
            Alert.alert(
                '',
                message,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                        onPress: props.onBackReword
                    }
                ],
                { cancelable: false },
            )

        }, 1500);
    } else {
        Alert.alert(
            '',
            message,
            [
                {
                    text: ConstantValues.OK_ALERT_STR,
                    onPress: props.onBackReword
                }
            ],
            { cancelable: false },
        );
    }

}

export const showHuntSuccessPopup = ({ message, onPresss }) => {
    if (Platform.OS == 'ios') {
        setTimeout(() => {
            Alert.alert(
                '',
                message,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                        onPress: onPresss
                    }
                ],
                { cancelable: false },
            );
        }, 1500);
    }
    else {
        Alert.alert(
            '',
            message,
            [
                {
                    text: ConstantValues.OK_ALERT_STR,
                    onPress: onPresss
                }
            ],
            { cancelable: false },
        );
    }

}
export const getUserName = userProfileData => {
    if (userProfileData.preferred_name && userProfileData.surname) {
        return `${userProfileData.preferred_name} ${userProfileData.surname}`;
    }

    if (userProfileData.preferred_name && userProfileData.lastname) {
        return `${userProfileData.preferred_name} ${userProfileData.lastname}`;
    }
    if (userProfileData.surname) {
        return `${userProfileData.name} ${userProfileData.surname}`;
    }
    if (userProfileData.lastname) {
        return `${userProfileData.name} ${userProfileData.lastname}`;
    }

    return `${userProfileData.name}`;
}
// export default onCameraPermissions;



