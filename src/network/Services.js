import { ConstantValues } from '../utils/ConstantValues'
import { apiErrorHandler, fetchWithTimeout } from '../utils/CommonMethods';

const ApiPersonalUserRegister = (
    user_first_name,
    user_last_name,
    user_mobile,
    user_email,
    user_password,
    confirm_password,
    user_access_control_notification,
    user_preferences_allow_email,
    user_preferences_allow_id,
    user_preferences_allow_selfie,
    user_preferences_allow_address) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_USER_REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_first_name: user_first_name,
            user_last_name: user_last_name,
            user_mobile: user_mobile,
            user_email: user_email,
            user_password: user_password,
            confirm_password: confirm_password,
            user_type: "1",
            user_access_control_notification: user_access_control_notification,
            user_preferences_allow_email: user_preferences_allow_email,
            user_preferences_allow_id: user_preferences_allow_id,
            user_preferences_allow_selfie: user_preferences_allow_selfie,
            user_preferences_allow_address: user_preferences_allow_address,
            device_token: "",
            device_type: ""
        })
    }).then((response) => response.json());
}
const ApiBusinessUserRegister = (
    companyname,
    firstname,
    lastname,
    landline,
    mobilenumber,
    address,
    cityselected,
    stateselected,
    countryselected,
    postalcode,
    email,
    password,
    confirmpassword,
    user_access_control_notification,
    user_preferences_allow_email,
    user_preferences_allow_id,
    user_preferences_allow_selfie,
    user_preferences_allow_address
) => {

    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_USER_REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_first_name: firstname,
            user_last_name: lastname,
            user_mobile: mobilenumber,
            user_email: email,
            user_password: password,
            confirm_password: confirmpassword,
            company_name: companyname,
            user_landline: landline,
            user_address: address,
            user_city_id: cityselected,
            user_province_id: stateselected,
            user_country_id: countryselected,
            user_pincode: postalcode,
            user_type: "5",
            user_access_control_notification: user_access_control_notification,
            user_preferences_allow_email: user_preferences_allow_email,
            user_preferences_allow_id: user_preferences_allow_id,
            user_preferences_allow_selfie: user_preferences_allow_selfie,
            user_preferences_allow_address: user_preferences_allow_address,
            device_token: "",
            device_type: ""
        })
    }).then((response) => response.json());
}
const ApiUserLogin = async (
    user_email,
    user_password, type
) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_USER_LOGIN,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    user_email: user_email,
                    user_password: user_password,
                    apple_login: type
                }),

                timeout: ConstantValues.FETCH_API_TIME_OUT,
            });
        const responseJson = await response.json();

        return responseJson;
    } catch (error) {
        throw error;

    }


    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_USER_LOGIN, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         user_email: user_email,
    //         user_password: user_password,
    //         apple_login: type
    //     })
    // }).then((response) => response.json());
}
const ApiGetGeoLocateAddress = async (params) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_CREATE_GEO_ADDRESS + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CREATE_GEO_ADDRESS + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // }).then((response) => response.json());
}


export const ApiGetNavigationOrder = async (auth_token, params) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_FOOTER_NAVIGATION_ORDER + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;

    } catch (error) {
        throw error;
    }

    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_FOOTER_NAVIGATION_ORDER + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
const ApiGetRewords = async (auth_token, params) => {

    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_REWORDS_STR + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        var responseJson = await response.json();

        return responseJson;
    } catch (error) {
        throw error;
    }



    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_REWORDS_STR + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}

export const ApiGetCurrencyRandValue = async (auth_token, params) => {

    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_REWORDCONVERSION_STR + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        var responseJson = await response.json();

        return responseJson;
    } catch (error) {
        throw error;
    }



    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_REWORDCONVERSION_STR + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
// https://instaccess.co.za/instaccess_backend/index.php/api/rewards?company_id=&location_id=&division_id=&department_id=
const ApiGetGetLoyaltyCards = async (auth_token, params) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_LOYALTY_CARDS_STR + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_LOYALTY_CARDS_STR + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
const ApiLoyaltyCardCreate = async (company_id, user_id, loyalty_card_name, loyalty_card_front_image, loyalty_card_back_image, auth_token) => {

    try {
        var response = await fetchWithTimeout(
            ConstantValues.BASE_API_URL + ConstantValues.URL_LOYALTY_CARD_CREATE_STR, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                company_id: company_id,
                user_id: user_id,
                loyalty_card_name: loyalty_card_name,
                loyalty_card_front_image: loyalty_card_front_image,
                loyalty_card_back_image: loyalty_card_back_image
            })
        }
        );
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_LOYALTY_CARD_CREATE_STR, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         company_id: company_id,
    //         user_id: user_id,
    //         loyalty_card_name: loyalty_card_name,
    //         loyalty_card_front_image: loyalty_card_front_image,
    //         loyalty_card_back_image: loyalty_card_back_image
    //     })
    // }).then((response) => response.json());
}
const ApiGetUserDetails = async (auth_token, params) => {
    console.log("ApiGetUserDetails ", ConstantValues.BASE_API_URL + ConstantValues.USERS_STR + params);
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.USERS_STR + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
        }
        );

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.USERS_STR + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         // 'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
const ApiGetDepartments = async (auth_token, params) => {
    // console.log("DEPARTMENT URL", ConstantValues.BASE_API_URL + ConstantValues.URL_DEPARTMENTS + params);
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_DEPARTMENTS + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_DEPARTMENTS + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}

export const ApiGetDepartmentsValues = (auth_token, params) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_DEPARTMENTS + params, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        }
    }).then((response) => response.json());
}


const ApiGetValues = async (auth_token, params) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_VALUES_STR + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_VALUES_STR + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}


// https://instaccess.co.za/instaccess_backend/index.php/api/values?company_id=
const ApiGetReferences = async (auth_token, params) => {
    console.log("555555 : ", ConstantValues.BASE_API_URL + ConstantValues.URL_REFERENCES + params);

    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_REFERENCES + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_REFERENCES + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
const ApiChangePassword = async (old_password, new_password, repeat_password, auth_token) => {

    try {
        var response = await fetchWithTimeout(
            ConstantValues.BASE_API_URL + ConstantValues.URL_API_CHANGE_PASSWORD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                new_password: new_password,
                repeat_password: repeat_password,
            })
        }
        );
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_API_CHANGE_PASSWORD, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         new_password: new_password,
    //         repeat_password: repeat_password,
    //     })
    // }).then((response) => response.json());
}

export const ApiCreateSurvey = async (body, auth_token) => {

    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_CREATE_SURVEY_STR, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            body: JSON.stringify(body),
            timeout: ConstantValues.FETCH_API_TIME_OUT,
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CREATE_SURVEY_STR, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify(body)
    // }).then((response) => response.json());
}

// surveySubmissions/create
const ApiUpdateLocation = async (
    homeofficename_home,
    location_name,
    city_id,
    province_id,
    country_id,
    pincode,
    latitude,
    longitude,
    auth_token,
    locationid
) => {

    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL
            + ConstantValues.URL_FAVRITE_LOCATION + locationid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                location_name: homeofficename_home,
                street_address: location_name,
                city_id: city_id,
                province_id: province_id,
                country_id: country_id,
                pincode: pincode,
                latitude: latitude,
                longitude: longitude
            })
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL
    //     + ConstantValues.URL_FAVRITE_LOCATION + locationid, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         location_name: homeofficename_home,
    //         street_address: location_name,
    //         city_id: city_id,
    //         province_id: province_id,
    //         country_id: country_id,
    //         pincode: pincode,
    //         latitude: latitude,
    //         longitude: longitude
    //     })
    // }).then((response) => response.json());
}
const ApiLocationCreate = async (
    homeofficename_home,
    location_name,
    city_id,
    province_id,
    country_id,
    pincode,
    latitude,
    longitude,
    auth_token) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_LOCATION_CREATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                location_name: homeofficename_home,
                street_address: location_name,
                city_id: city_id,
                province_id: province_id,
                country_id: country_id,
                pincode: pincode,
                latitude: latitude,
                longitude: longitude
            })
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_LOCATION_CREATE, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         location_name: homeofficename_home,
    //         street_address: location_name,
    //         city_id: city_id,
    //         province_id: province_id,
    //         country_id: country_id,
    //         pincode: pincode,
    //         latitude: latitude,
    //         longitude: longitude
    //     })
    // }).then((response) => response.json());
}
const ApiUserLogout = async (auth_token) => {
    // let token="acc9651df8d4930cc0963bbba2f531b0a8163d2bb5e9231323bb54696623324353c0344bee289a058bba7fdf31fb93a8";

    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_LOGOUT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token

            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_LOGOUT, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //         // 'Authorization': 'Token ' + token
    //     }
    // }).then((response) => response.json());
}
const ApiGetFeaturePermissions = async (auth_token, params) => {
    // console.log("get feature permissions URL:", ConstantValues.BASE_API_URL + ConstantValues.URL_FEATURE_PERMISSINS + params);
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_FEATURE_PERMISSINS + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_FEATURE_PERMISSINS + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}


export const ApiGetUserLevelPermissions = async (auth_token, params) => {
    // console.log("ApiGetUserLevelPermissions URL:", ConstantValues.BASE_API_URL + ConstantValues.URL_USER_LEVEL_PERMISSIONS_STR + params);
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_USER_LEVEL_PERMISSIONS_STR + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_USER_LEVEL_PERMISSIONS_STR + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}


// URL_USER_LEVEL_PERMISSIONS_STR
const ApiGetCountryList = async () => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_COUNTRYIS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_COUNTRYIS, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // }).then((response) => response.json());
}
const ApiGetStatesList = async (countryid) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_STATES + '?country_id=' + countryid, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_STATES + '?country_id=' + countryid, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // }).then((response) => response.json());
}
const ApiGetCityList = async (stateid) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_CITYS + '?state_id=' + stateid, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CITYS + '?state_id=' + stateid, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // }).then((response) => response.json());
}
const ApiGetCompaniesList = (auth_token) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_COMANIES, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        }
    }).then((response) => response.json());
}
const ApiGetLocationsList = async (auth_token, params) => {

    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_LOCATIONS + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }

    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_LOCATIONS + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
const ApiGetWebLinks = async (auth_token, params) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_WEBLINKS + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_WEBLINKS + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}

const ApiGetCompanyQuestionsList = async (auth_token, paramsUrl) => {

    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_COMPANY_QUESTIONS + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }

    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_COMPANY_QUESTIONS + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
const ApiGetSystemQuestionsList = async (auth_token, paramsUrl) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_SYSTEM_QUESTIONS + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_SYSTEM_QUESTIONS + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}

const ApiGetRedemPoints = async (auth_token, paramsUrl) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.URL_REDEM_POINTS_STR + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.URL_REDEM_POINTS_STR + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.text());
}


export const ApiGetLunchSetupOpen = async (auth_token, paramsUrl) => {
    // console.log("ApiGetLunchSetupOpen", ConstantValues.BASE_API_URL + ConstantValues.LUNCH_SETUP_OPEN_STR + paramsUrl);
    try {
        var response = await fetchWithTimeout(
            ConstantValues.BASE_API_URL + ConstantValues.LUNCH_SETUP_OPEN_STR + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        }
        );
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.LUNCH_SETUP_OPEN_STR + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}



// URL_REDEM_POINTS_STR
const ApiGetActivitiesList = async (auth_token, paramsUrl) => {


    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_ACTIVITIES + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_ACTIVITIES + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
const ApiGetNonappUserScreeningQuestionsList = (auth_token, paramsUrl) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_ACTIVITIES + paramsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        }
    }).then((response) => response.json());
}
const ApiCheckEmployeeEntry = (auth_token, paramsUrl) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.USERS_STR + paramsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        }
    }).then((response) => response.json());
}
const ApiSubmitSystemAnswers = async (
    answeredQuestions, auth_token
) => {

    try {
        let data = JSON.stringify(answeredQuestions);
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_CREATE_SYSTEM_QUESTIONS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: data
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }


    // let data = JSON.stringify(answeredQuestions);
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CREATE_SYSTEM_QUESTIONS, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: data
    // }).then((response) => response.json());
}


const ApiNonAppActivityCreate = (
    auth_token,
    company_id,
    location_id,
    userid,
    digital_signature,
    user_image,
    cell_number,
    user_email,
    person_visiting,
    device_type
) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_ACTIVITY_CREATE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        },
        body: JSON.stringify({
            company_id: company_id,
            location_id: location_id,
            user_id: "",
            non_app_user_id: userid,
            visited_employee_id: "",
            user_temperature: "",
            user_signature: digital_signature,
            user_cell_number: cell_number,
            user_email: user_email,
            user_id_number: "",
            user_selfie: "",
            person_visiting: person_visiting,
            device_type: device_type
        })
    }).then((response) => response.json());
}


const ApiRewordRedemptionCreate = async (
    auth_token,
    reward_id,
    company_id,
    user_id,
    selected_quantity,
    reward_type_name,
    give_to_user_id,
    userInputRewardValue
) => {
    try {


        let data = JSON.stringify({
            reward_id: reward_id,
            company_id: company_id,
            user_id: user_id,
            selected_quantity: (reward_type_name == "Give") ? "0" : selected_quantity,
            reward_type_name: reward_type_name,
            given_to_user_id: give_to_user_id,
            user_inputted_rand: (reward_type_name == "Give") ? selected_quantity : "0",
            user_input_reward_value: userInputRewardValue
        });
        // console.log("AUTH:", auth_token);
        // console.log("REQ BODY:", data);
        // console.log("URL :", ConstantValues.BASE_API_URL + ConstantValues.URL_REWORDS_REDEMPTION_STR);
        // return;
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_REWORDS_REDEMPTION_STR, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: data
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }



    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_REWORDS_REDEMPTION_STR, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         reward_id: reward_id,
    //         company_id: company_id,
    //         user_id: user_id,
    //         selected_quantity: selected_quantity,
    //         reward_type_name: reward_type_name
    //     })
    // }).then((response) => response.json());
}

export const ApiLunchOrdersCreate = async (auth_token, ordersList) => {
    // console.log("ApiLunchOrdersCreate", ConstantValues.BASE_API_URL + ConstantValues.URL_LUNCH_OREDERS_CREATE_STR);
    try {
        let data = JSON.stringify(ordersList);
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_LUNCH_OREDERS_CREATE_STR, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: data
        });
        // console.log("CREATE LUNCH :", JSON.stringify(response));
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // let data = JSON.stringify(ordersList);
    // // console.log("SELECTED ORDERS LIST : ", JSON.stringify(ordersList));

    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_LUNCH_OREDERS_CREATE_STR, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: data
    // }).then((response) => response.text());
}

// https://instaccess.co.za/instaccess_backend/index.php/api/lunchOrders/create
const ApiActivityCreate = async (
    auth_token,
    company_id,
    location_id,
    userid,
    digital_signature,
    user_image,
    cell_number,
    user_email,
    person_visiting,
    device_type
) => {

    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_ACTIVITY_CREATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                company_id: company_id,
                location_id: location_id,
                user_id: userid,
                visited_employee_id: "",
                user_temperature: "",
                user_signature: digital_signature,
                user_cell_number: cell_number,
                user_email: user_email,
                user_id_number: "",
                user_selfie: "",
                person_visiting: person_visiting,
                device_type: device_type
            })
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }


    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_ACTIVITY_CREATE, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         company_id: company_id,
    //         location_id: location_id,
    //         user_id: userid,
    //         visited_employee_id: "",
    //         user_temperature: "",
    //         user_signature: digital_signature,
    //         user_cell_number: cell_number,
    //         user_email: user_email,
    //         user_id_number: "",
    //         user_selfie: "",
    //         person_visiting: person_visiting,
    //         device_type: device_type
    //     })
    // }).then((response) => response.json());
}


const ApiUpdateFavoriteLacation = async (favorite_status, locationid, auth_token) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL
            + ConstantValues.URL_FAVRITE_LOCATION + locationid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                favorite: favorite_status
            })
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL
    //     + ConstantValues.URL_FAVRITE_LOCATION + locationid, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         favorite: favorite_status
    //     })
    // }).then((response) => response.json());
}


export const ApiUpdateContentFeed = async (
    body,
    contentId,
    auth_token) => {

    try {
        console.log("BODY :", JSON.stringify(body));
        console.log("URl :", ConstantValues.BASE_API_URL
            + ConstantValues.URL_UPDATE_CONTENT_FEED_STR + contentId);
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL
            + ConstantValues.URL_UPDATE_CONTENT_FEED_STR + contentId, {

            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            body: JSON.stringify(body),
            timeout: ConstantValues.FETCH_API_TIME_OUT,
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }

    // return fetch(
    //     ConstantValues.BASE_API_URL
    //     + ConstantValues.URL_UPDATE_CONTENT_FEED_STR + contentId, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify(body)
    // }).then((response) => response.text());
}


const ApiUpdateLoyaltyCard = async (company_id, user_id,
    loyalty_card_name, loyalty_card_front_image, loyalty_card_back_image, id,
    auth_token) => {

    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL
            + ConstantValues.URL_LOYALTY_CARD_UPDATE_STR + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                company_id: company_id,
                user_id: user_id,
                loyalty_card_name: loyalty_card_name,
                loyalty_card_front_image: loyalty_card_front_image,
                loyalty_card_back_image: loyalty_card_back_image
            })
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL
    //     + ConstantValues.URL_LOYALTY_CARD_UPDATE_STR + id, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         company_id: company_id,
    //         user_id: user_id,
    //         loyalty_card_name: loyalty_card_name,
    //         loyalty_card_front_image: loyalty_card_front_image,
    //         loyalty_card_back_image: loyalty_card_back_image
    //     })
    // }).then((response) => response.json());
}
const ApiCreateNote = async (
    auth_token,
    location_id,
    user_id,
    note
) => {

    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_NOTE_CREATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                location_id: location_id,
                user_id: user_id,
                note: note
            })
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }

    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_NOTE_CREATE, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         location_id: location_id,
    //         user_id: user_id,
    //         note: note
    //     })
    // }).then((response) => response.json());
}
const ApiUpdateNote = (
    auth_token,
    note,
    params
) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_UPDATE_NOTE + params, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        },
        body: JSON.stringify({
            note: note
        })
    }).then((response) => response.json());
}
const ApiGetNotes = (auth_token,) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_NOTES, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        }
    }).then((response) => response.json());
}


export const ApiGetCurrentLunchSetupLists = (auth_token, paramsUrl) => {

    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CURRENT_LUNCH_SETUP + paramsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        }
    }).then((response) => response.json());
}

export const ApiGetCurrentLunchItems = async (auth_token, paramsUrl) => {

    //  https://instaccess.co.za/instaccess_backend/index.php/api/lunchOrders?company_id=&status=current&user_id=


    try {
        // console.log("ApiGetCurrentLunchItems", ConstantValues.BASE_API_URL + ConstantValues.URL_CURRENT_LUNCH_ITEMS_GET + paramsUrl);
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_CURRENT_LUNCH_ITEMS_GET + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CURRENT_LUNCH_ITEMS_GET + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}

export const ApiDeleteCurrentOrderItem = async (auth_token, lunch_item_id) => {

    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_DELETE_CURRENT_ORDER_ITEM + lunch_item_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }

    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_DELETE_CURRENT_ORDER_ITEM + lunch_item_id, {
    //     method: 'DELETE',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.text());
}

export const ApiGetOpenLunchOrders = async (auth_token, paramsUrl) => {
    console.log("ApiGetOpenLunchOrders", ConstantValues.BASE_API_URL + ConstantValues.URL_LUNCH_ORDERS + paramsUrl);

    // console.log("AUTH", auth_token);
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_LUNCH_ORDERS + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // // console.log("SUBMITION ORDERS URL : ", ConstantValues.BASE_API_URL + ConstantValues.URL_LUNCH_ORDERS + paramsUrl);
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_LUNCH_ORDERS + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
export const ApiGetLunchRules = async (auth_token, paramsUrl) => {

    // console.log("ApiGetLunchRules", ConstantValues.BASE_API_URL + ConstantValues.URL_LUNCH_RULES + paramsUrl);
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_LUNCH_RULES + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }


    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_LUNCH_RULES + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());

}
// https://instaccess.co.za/instaccess_backend/index.php/api/lunchOrders?company_id=54&user_id=223&status=open

// https://instaccess.co.za/instaccess_backend/index.php/api/lunchOrders/backendCurrent?company_id=&user_id=

const ApiCheckOutUser = async (checkout_time, activityid, auth_token,
) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL
            + ConstantValues.URL_CHECKOUT + activityid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                checkout_time: checkout_time,
            })
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL
    //     + ConstantValues.URL_CHECKOUT + activityid, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         checkout_time: checkout_time,
    //     })
    // }).then((response) => response.json());
}
const ApiLeaveNoteUser = async (
    activityid,
    auth_token,
    user_note,
) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL
            + ConstantValues.URL_CHECKOUT + activityid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                user_note: user_note,
            })
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL
    //     + ConstantValues.URL_CHECKOUT + activityid, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         user_note: user_note,
    //     })
    // }).then((response) => response.json());
}
const ApiLeaveAReview = async (
    activityid,
    auth_token,
    user_rating,
    user_experience
) => {

    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL
            + ConstantValues.URL_CHECKOUT + activityid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                user_rating: user_rating,
                user_experience: user_experience,
            })
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL
    //     + ConstantValues.URL_CHECKOUT + activityid, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         user_rating: user_rating,
    //         user_experience: user_experience,
    //     })
    // }).then((response) => response.json());
}
const ApiUpadateCheckInStatusOfUser = async (auth_token, activityid, checkin_status) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL
            + ConstantValues.URL_CHECKOUT + activityid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                checkIn_status: checkin_status
            })
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL
    //     + ConstantValues.URL_CHECKOUT + activityid, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         checkIn_status: checkin_status
    //     })
    // }).then((response) => response.json());
}
const ApiForgotPassword = (email) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_FORGOT_PASSWORD_STR, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_email: email
        })
    }).then((response) => response.json());
}
const ApiAddSignatureOfUser = async (auth_token, userid, firstname, imageblob) => {

    var t = JSON.stringify({
        user_first_name: firstname,
        digital_signature: imageblob
    });
    console.log("ApiAddSignatureOfUser", t);
    console.log("ApiAddSignatureOfUser", ConstantValues.BASE_API_URL
        + ConstantValues.URL_USER_UPDATE + userid);
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL
            + ConstantValues.URL_USER_UPDATE + userid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                user_first_name: firstname,
                digital_signature: imageblob
            })
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
}
const ApiSaveSharedPreferencesUser = async (
    auth_token, userid,
    user_access_control_notification,
    user_preferences_allow_email,
    user_preferences_allow_id,
    user_preferences_allow_selfie,
    user_preferences_allow_address) => {
    var j = JSON.stringify({
        user_access_control_notification: user_access_control_notification,
        user_preferences_allow_email: user_preferences_allow_email,
        user_preferences_allow_id: user_preferences_allow_id,
        user_preferences_allow_selfie: user_preferences_allow_selfie,
        user_preferences_allow_address: user_preferences_allow_address
    });
    console.log("ApiSaveSharedPreferencesUser", j);
    console.log("ApiSaveSharedPreferencesUser url", ConstantValues.BASE_API_URL
        + ConstantValues.URL_USER_UPDATE + userid);
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL
            + ConstantValues.URL_USER_UPDATE + userid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                user_access_control_notification: user_access_control_notification,
                user_preferences_allow_email: user_preferences_allow_email,
                user_preferences_allow_id: user_preferences_allow_id,
                user_preferences_allow_selfie: user_preferences_allow_selfie,
                user_preferences_allow_address: user_preferences_allow_address
            })
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
}
const ApiUpdateUser = async (auth_token,
    userid,
    firstname,
    mobilenumber,
    email,
    idnumber,
    address,
    postalcode,
    imageString,
    user_city_id,
    user_province_id,
    user_country_id
) => {

    var b = JSON.stringify({
        user_first_name: firstname,
        user_mobile: mobilenumber,
        user_email: email,
        user_id_number: idnumber,
        user_address: address,
        user_city_id: user_city_id,
        user_province_id: user_province_id,
        user_country_id: user_country_id,
        user_pincode: postalcode,
        user_image: imageString,
    });

    // console.log("BODY", b);
    // console.log("URL user_update", ConstantValues.BASE_API_URL
    //     + ConstantValues.URL_USER_UPDATE + userid);

    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL
            + ConstantValues.URL_USER_UPDATE + userid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                user_first_name: firstname,
                user_mobile: mobilenumber,
                user_email: email,
                user_id_number: idnumber,
                user_address: address,
                user_city_id: user_city_id,
                user_province_id: user_province_id,
                user_country_id: user_country_id,
                user_pincode: postalcode,
                user_image: imageString,
            })
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }

}
const ApiUpdateFirebasData = async (auth_token, userid, device_token, device_type,
    home_location_id
) => {
    var c = JSON.stringify({
        user_home_location_id: home_location_id,
        device_type: device_type,
        device_token: device_token,
        // allow_microsoft_aad_login:allow_microsoft_aad_login,
        apple_id: "",
        apple_token: "",
    });

    console.log("Firebase data", c);
    console.log("fire base user update url", ConstantValues.BASE_API_URL + ConstantValues.URL_USER_UPDATE + userid);
    try {

        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_USER_UPDATE + userid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            body: JSON.stringify({
                user_home_location_id: home_location_id,
                device_type: device_type,
                device_token: device_token,
                // allow_microsoft_aad_login:allow_microsoft_aad_login,
                apple_id: "",
                apple_token: "",
            }),
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }


}

const ApiUpdateUserDetails = async (auth_token, userid, updateData
) => {

    var f = JSON.stringify(updateData);
    console.log("update user details", f);
    console.log("update user details url", ConstantValues.BASE_API_URL + ConstantValues.URL_USER_UPDATE + userid);
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_USER_UPDATE + userid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
                // 'Authorization': 'Token ' + token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify(updateData)
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
}
const ApiGetWrongQuestionsList = async (auth_token, paramsUrl) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_WRONG_QUESTIONS + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_WRONG_QUESTIONS + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
const ApiGetClubCycles = async (auth_token, paramsUrl) => {
    console.log("33333", ConstantValues.BASE_API_URL + ConstantValues.URL_CLUB_CYCLES + paramsUrl);

    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_CLUB_CYCLES + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CLUB_CYCLES + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}

const ApiGetFormsList = async (auth_token, paramsUrl) => {
    console.log("FULL URL : ", ConstantValues.BASE_API_URL + ConstantValues.URL_FORMS + paramsUrl);

    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_FORMS + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }

    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_FORMS + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}

export const ApiGetClubFormsList = (auth_token, paramsUrl) => {

    // return fetch("https://instaccess.co.za/instaccess_backend/index.php/api/formSubmission/getCount?company_id=54&user_id=223", {
    return fetch(ConstantValues.BASE_API_URL + "formSubmission/getCount?company_id=54&user_id=223", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        }
    }).then((response) => response.json());
}
const ApiGetFormsQuestions = async (auth_token, paramsUrl) => {
    // console.log("GET FORM DATA URL :", ConstantValues.BASE_API_URL + ConstantValues.URL_FORM_QUESTIONS + paramsUrl);
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_FORM_QUESTIONS + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_FORM_QUESTIONS + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}


// https://instaccess.co.za/instaccess_backend/index.php/api/clubMonthly?user_id=

const ApiGetClubMonthly = async (auth_token, paramsUrl) => {
    console.log("111111 : ", ConstantValues.BASE_API_URL + ConstantValues.URL_CLUB_MONTHLY_STR + paramsUrl);
    console.log("Token1111111111 :", auth_token);
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_CLUB_MONTHLY_STR + paramsUrl,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + auth_token
                }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            }

        );
        const responseJson = await response.json();

        return responseJson;

    } catch (error) {
        throw error;
    }

    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CLUB_MONTHLY_STR + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
const ApiGetClubScores = async (auth_token, paramsUrl) => {
    console.log("22222222222", ConstantValues.BASE_API_URL + ConstantValues.URL_CLUB_SCORE_STR + paramsUrl);
    console.log("Token222222222 :", auth_token);

    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_CLUB_SCORE_STR + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CLUB_SCORE_STR + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}


export const ApiGetFlashBook = async (auth_token, paramsUrl) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_FLASH_BOOK + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_FLASH_BOOK + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}

export const ApiGetVirtulTransactions = async (auth_token, paramsUrl) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_VIRTUAL_TRANSACTION + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_VIRTUAL_TRANSACTION + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}

const ApiGetValueNominations = async (auth_token, paramsUrl) => {
    console.log("44444", ConstantValues.BASE_API_URL + ConstantValues.URL_VALUE_NOMINATIONS + paramsUrl);
    
    try {
        console.log("VALUE NOMINATIONS URL:", ConstantValues.BASE_API_URL + ConstantValues.URL_VALUE_NOMINATIONS + paramsUrl);
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_VALUE_NOMINATIONS + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        // console.log("VALUE NOMINATIONS RES 1:", JSON.stringify(response));
        var responseJson = await response.json();
        console.log("44444444444444444444444:", JSON.stringify(responseJson));
        return responseJson;

    } catch (error) {
        console.log(error, "44444444444444444")
        throw error;
    }


    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_VALUE_NOMINATIONS + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
// https://instaccess.co.za/instaccess_backend/index.php/api/valueNominations?nominated_user_id=223


const ApiGetGateActivities = (auth_token, paramsUrl) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_GET_GATE_ACTIVITIES + paramsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        }
    }).then((response) => response.json());
}
const ApiUpdateGateActivity = (auth_token, gateid, company_id, location_id, purpose_visit_id, visited_employee_id,
    checkin_time,
    checkout_time,
    scan_car_license,
    scan_id_drivers,
    number_people,
    scan_out_value,
    scanned_out
) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_UPDATE_GATE_ACTIVITY + gateid, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        },
        body: JSON.stringify({
            company_id: company_id,
            location_id: location_id,
            purpose_visit_id: purpose_visit_id,
            visited_employee_id: visited_employee_id,
            checkin_time: checkin_time,
            checkout_time: checkout_time,
            scan_car_license: scan_car_license,
            scan_id_drivers: scan_id_drivers,
            number_people: number_people,
            scan_out_value: scan_out_value,
            scanned_out: scanned_out
        })
    }).then((response) => response.json());
}
const ApiCreateGateActivity = (
    auth_token,
    company_id, location_id, purpose_visit_id, visited_employee_id,
    checkin_time,
    checkout_time,
    scan_car_license,
    scan_id_drivers,
    number_people,
    scan_out_value,
    scanned_out) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CREATE_GATE_ACTIVITY, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        },
        body: JSON.stringify({
            company_id: company_id,
            location_id: location_id,
            purpose_visit_id: purpose_visit_id,
            visited_employee_id: visited_employee_id,
            checkin_time: checkin_time,
            checkout_time: checkout_time,
            scan_car_license: scan_car_license,
            scan_id_drivers: scan_id_drivers,
            number_people: number_people,
            scan_out_value: scan_out_value,
            scanned_out: scanned_out
        })
    }).then((response) => response.json());
}


export const ApiSendSMTPMail = async (auth_token, body) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_SUPPORT_SMTPMAIL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: body
            // JSON.stringify({
            //     support_type_id: support_type_id,
            //     contact_number: contact_number,
            //     name: name,
            //     lastname: lastname,
            //     // last_name: lastname,
            //     details: details,
            //     user_mail: user_mail,
            //     // user_mail: "saikrishnakukkala@gmail.com",
            //     support_image: imageBlob


            // })
        });

        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_SUPPORT_SMTPMAIL, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         support_type_id: support_type_id,
    //         contact_number: contact_number,
    //         name: name,
    //         lastname: lastname,
    //         // last_name: lastname,
    //         details: details,
    //         user_mail: user_mail,
    //         // user_mail: "saikrishnakukkala@gmail.com",


    //     })
    // }).then((response) => response.json());
}


export const ApiSendSMTPReportFraudMail = async (
    auth_token,
    fraud_type_id,
    contact_number,
    details,
    name,
    last_name,
    user_mail,
    fileBlob,
    file_format
) => {
    // console.log(fraud_type_id, "Goal is this point:: ", "::", auth_token, "::", fraud_type_id, "::", contact_number, "::", details, "::", name,  "::",last_name,  "::",user_mail, "::", file,  "::",file_format)

    try {
        let body = {
            fraud_type_id: fraud_type_id,
            contact_number: contact_number,
            details: details,
            name: name,
            last_name: last_name,
            user_mail: user_mail,
            file: fileBlob,
            file_format: file_format
        }
        console.log("REQ BODY :", JSON.stringify(body.file));
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_REPORT_FRAUD_SMTPMAIL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify(body)
        });
        var responseJson = await response.json();
        return response;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_REPORT_FRAUD_SMTPMAIL, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify(body)
    // }).then((response) => response.json());
}

export const ApiSendSMTPWellBeingMail = async (
    auth_token,
    well_being_id,
    details,
    name,
    last_name,
    user_email
) => {

    try {
        let body = {
            well_being_id: well_being_id,
            details: details,
            name: name,
            last_name: last_name,
            user_mail: user_email,
            // user_mail: "saikrishnakukkala@gmail.com",

        }

        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_WELL_BEINGSMTPMAIL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify(body)
        });

        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }

    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_WELL_BEINGSMTPMAIL, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify(body)
    // }).then((response) => response.json());
}
const ApiCreateScanOutGateEntry = (
    auth_token,
    scan_car_license,
    scan_id_drivers,
) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_SCAN_OUT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        },
        body: JSON.stringify({
            scan_car_license: scan_car_license,
        })
    }).then((response) => response.json());
}
const ApiDeleteGateEntry = (auth_token, gateid) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_DELETE_GATE_ACTIVITY + gateid, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        }
    }).then((response) => response.text());
}
const ApiDeleteLoyaltyCard = async (id, auth_token) => {
    try {
        var response = await fetchWithTimeout(
            ConstantValues.BASE_API_URL + ConstantValues.URL_LOYALTY_CARD_DELETE_STR + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        }
        );
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_LOYALTY_CARD_DELETE_STR + id, {
    //     method: 'DELETE',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.text());
}
const ApiPurposeOfVisitDropDown = (auth_token, paramsUrl) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_PURPOSE_OF_VISIT + paramsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        }
    }).then((response) => response.json());
}
const ApiGetWhiteLabelSettings = async (paramsUrl) => {
    // console.log("GET COMPANY DATA URL: ", ConstantValues.BASE_API_URL + ConstantValues.URL_WHITE_LABEL_SETTINGS_STR + paramsUrl);
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_WHITE_LABEL_SETTINGS_STR + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT,
        }
        );

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_WHITE_LABEL_SETTINGS_STR + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // }).then((response) => response.json());
}
const ApiGetTriggerQuestions = async (auth_token, paramsUrl) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_TRIGGER_QUESTIONS + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }


    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_TRIGGER_QUESTIONS + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
const ApiGetCompany = async (auth_token, paramsUrl) => {

    try {
        console.log("ApiGetCompany:", ConstantValues.BASE_API_URL + ConstantValues.URL_COMANIES + paramsUrl);
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_COMANIES + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_COMANIES + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
const ApiGetLocation = async (auth_token, paramsUrl) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_LOCATIONS + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_LOCATIONS + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}

export const ApiGetContentLibraryFiles = async (auth_token, paramsUrl) => {

    try {
        const response = await fetchWithTimeout(
            ConstantValues.BASE_API_URL + ConstantValues.URL_CONTENT_FILES_STR + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        }
        );

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CONTENT_FILES_STR + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}

export const ApiGetContentLibraryCategories = async (auth_token, paramsUrl) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_CONTENT_CATEGORIS_STR + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CONTENT_CATEGORIS_STR + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}


export const ApiGetContentFeed = async (auth_token, paramsUrl) => {
    // console.log("CONTENT FEED URL : ", ConstantValues.BASE_API_URL + ConstantValues.URL_CONTENT_FEED_STR + paramsUrl);
    // console.log("AUTH :", auth_token);

    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_CONTENT_FEED_STR + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
        });

        const responseJson = await response.json();
        // console.log("RES 1:", JSON.stringify(responseJson));
        return responseJson;
    } catch (error) {
        throw error;
    }


    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_CONTENT_FEED_STR + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}

export const ApiGetCategories = (auth_token, paramsUrl) => {
    return fetch(ConstantValues.URL_GATEWAY_BASE_URL + ConstantValues.URL_CONTENT_CATEGORIS_STR + paramsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        }
    }).then((response) => response.text());
}

const ApiGetDivision = (auth_token, paramsUrl) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_DIVISIONS + paramsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        }
    }).then((response) => response.json());
}
const ApiGetLocationSettings = async (auth_token, paramsUrl) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_LOCATION_SETTINGS + paramsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_LOCATION_SETTINGS + paramsUrl, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.json());
}
const ApiNonAppUserCreate = (
    employeecode, firstname, lastname, inserttemparature, mobilenumber, email) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_NONAPP_USER_CREATE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: firstname,
            surname: lastname,
            email: email,
            cell_number: mobilenumber,
            id_number: "",
            street_address: "",
            city_id: "",
            province_id: "",
            country_id: "",
            pincode: "",
            latitude: "",
            longitude: "",
            user_type: "Visitor"
        })
    }).then((response) => response.json());
}
const ApiNonAppUserSubmitSystemuestions = (
    answeredQuestions, auth_token) => {
    let data = JSON.stringify(answeredQuestions);
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_NON_APP_USER_SUBMITQUESTIONS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        },
        body: data
    }).then((response) => response.json());
}
const ApiSubmitFormAnswers = async (
    answeredQuestions, auth_token) => {
    try {
        let data = JSON.stringify(answeredQuestions);
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_FORM_SUBMISSION_ANSWER_STR, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: data
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }

    // let data = JSON.stringify(answeredQuestions);
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_FORM_SUBMISSION_ANSWER_STR, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: data
    // }).then((response) => response.text());
}
const ApiSubmitForm = async (
    company_id,
    location_id,
    user_id,
    form_id,
    online_offline_submission,
    auth_token,
    approved,
    objBody
) => {

    try {
        let body = JSON.stringify(objBody);

        // console.log("FORM URL:", ConstantValues.BASE_API_URL + ConstantValues.URL_FORM_SUBMISSION_STR);
        // console.log("AUTH", auth_token);
        console.log("FINAL BODY : ", objBody);

        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_FORM_SUBMISSION_STR, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: body
        });
        // console.log("RES 1", JSON.stringify(response));
        const responseJson = await response.json();
        // console.log("RES 2", JSON.stringify(responseJson));
        return responseJson;
    } catch (error) {
        // console.log("ERROR 2", JSON.stringify(error));
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_FORM_SUBMISSION_STR, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         company_id: company_id,
    //         location_id: location_id,
    //         user_id: user_id,
    //         form_id: form_id,
    //         online_offline_submission: online_offline_submission,
    //         approved: approved
    //     })
    // }).then((response) => response.json());
}




// Support type > https://instaccess.co.za/instaccess_backend/index.php/api/supportType/supportSendMail
// POST body
// {
//     "support_type_id":
//     "from_email":
//     "contact_number":
//     "details":
// }

// Fraud type > https://instaccess.co.za/instaccess_backend/index.php/api/supportType/fraudendMail
// POST body
// {
//     "fraud_type_id":
//     "from_email":
//     "contact_number":
//     "details":
//     "attachment":
// }


const ApiSubmitSupportTypeDetails = async (
    auth_token, support_type_id, from_email, contact_number, details) => {

    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_SUPPORT_TYPES + ConstantValues.URL_SUPPORT_SEND_MAIL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                support_type_id: support_type_id,
                from_email: from_email,
                contact_number: contact_number,
                details: details
            })
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_SUPPORT_TYPES + ConstantValues.URL_SUPPORT_SEND_MAIL, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         support_type_id: support_type_id,
    //         from_email: from_email,
    //         contact_number: contact_number,
    //         details: details
    //     })
    // }).then((response) => response.text());
}


const ApiSubmitFraudTypeDetails = async (
    auth_token,
    fraud_type_id,
    from_email,
    contact_number,
    details,
    attachment) => {
    // console.log("URL :", ConstantValues.BASE_API_URL + ConstantValues.URL_FRAUD_TYPES + ConstantValues.URL_FRAUD_SEND_MAIL);
    // console.log("BODY : ", JSON.stringify({
    //     fraud_type_id: fraud_type_id,
    //     from_email: from_email,
    //     contact_number: contact_number,
    //     details: details,
    //     attachment: attachment
    // }));
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_FRAUD_TYPES + ConstantValues.URL_FRAUD_SEND_MAIL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify({
                fraud_type_id: fraud_type_id,
                from_email: from_email,
                contact_number: contact_number,
                details: details,
                attachment: attachment
            })
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_FRAUD_TYPES + ConstantValues.URL_FRAUD_SEND_MAIL, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify({
    //         fraud_type_id: fraud_type_id,
    //         from_email: from_email,
    //         contact_number: contact_number,
    //         details: details,
    //         attachment: attachment
    //     })
    // }).then((response) => response.text());
}

const ApiGetNonAppUserSystemQuestions = (
    auth_token, params) => {
    return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_NON_UAPP_USER_GET_FETCHING_SYSTEMQUESTIONS + params, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + auth_token
        },
    }).then((response) => response.json());
}
const ApiGetSupportTypes = async (
    auth_token, params) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_SUPPORT_TYPES + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_SUPPORT_TYPES + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    // }).then((response) => response.json());
}
const ApiGetFraudTypes = async (
    auth_token, params) => {

    try {

        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_FRAUD_TYPES + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTT", responseJson)
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_FRAUD_TYPES + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    // }).then((response) => response.json());
}

export const ApiGetWellbeingValues = async (
    auth_token, params) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_WELBEING_VALUES + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }


    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_WELBEING_VALUES + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    // }).then((response) => response.json());
}

export const ApiGetImportValueNominations = async (
    auth_token) => {
    // console.log("NOMINATIONS URL:", ConstantValues.URL_GATEWAY_BASE_URL + ConstantValues.URL_IMPORT_VALUE_NOMINATIONS);
    try {
        const response = await fetchWithTimeout(ConstantValues.URL_GATEWAY_BASE_URL + ConstantValues.URL_IMPORT_VALUE_NOMINATIONS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        console.log("ApiGetImportValueNominations 1:", JSON.stringify(response));
        const responseJson = await response.text();
        console.log("ApiGetImportValueNominations 2:", responseJson);
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.URL_GATEWAY_BASE_URL + ConstantValues.URL_IMPORT_VALUE_NOMINATIONS, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    // }).then((response) => response.text());
}

export const ApiGetClubScoringByUserId = async (
    auth_token,
    params) => {
    console.log("CLUB MONTHLY SCORE :", ConstantValues.URL_REDEM_POINTS_STR + params);
    try {
        const response = await fetchWithTimeout(ConstantValues.URL_REDEM_POINTS_STR + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        // console.log("CLUB MONTHLY SCORE RES 1:", JSON.stringify(response));
        const responseJson = await response.text();
        // console.log("CLUB MONTHLY SCORE RES 1:", responseJson);
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.URL_REDEM_POINTS_STR + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    // }).then((response) => response.text());
}
// hello.txt hello.txt 54 223
export const ApiCreateProfileFile = async (
    auth_token,
    fileblob,
    file_name,
    file_format,
    filetype,
    company_id,
    user_id) => {

    // console.log("ApiCreateProfileFile", ConstantValues.BASE_API_URL + ConstantValues.URL_PROFILE_FILES_CREATE_STR);

    try {
        let body = {
            file: fileblob,
            file_name: file_name,
            file_format: file_format,
            company_id: company_id,
            user_id: user_id,
            file_type: filetype

            // file_format
        }

        // console.log("REQ BODY : ", JSON.stringify(
        //     body));
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_PROFILE_FILES_CREATE_STR, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify(
                body)
        });
        // console.log("RES 1", JSON.stringify(response));
        var responseJson = await response.json();
        // console.log("RES 2", JSON.stringify(responseJson));
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_PROFILE_FILES_CREATE_STR, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify(
    //         body

    //     )
    // }).then((response) => response.text());
}



export const ApiUpdateProfileFile = async (
    auth_token, body, fileid) => {

    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_PROFILE_FILE_UPDATE_STR + fileid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify(
                body

            )
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_PROFILE_FILE_UPDATE_STR + fileid, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    //     body: JSON.stringify(
    //         body

    //     )
    // }).then((response) => response.text());
}


export const ApiGetProfileFiles = async (
    auth_token,
    params) => {

    // console.log("FILE URL :", ConstantValues.BASE_API_URL + ConstantValues.URL_GET_PROFILE_FILES_STR + params);
    // console.log("AUTH : ", auth_token);
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_GET_PROFILE_FILES_STR + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_GET_PROFILE_FILES_STR + params, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     },
    // }).then((response) => response.json());
}

export const ApiDeleteProfileFile = async (auth_token, fileid) => {
    // console.log("FILE DELETE URL : ", ConstantValues.BASE_API_URL + ConstantValues.URL_PROFILE_FILE_DELETE_STR + fileid);

    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_PROFILE_FILE_DELETE_STR + fileid, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }
        });
        // console.log("RES 1:", JSON.stringify(response));
        var responseJson = await response.json();
        // console.log("RES 2:", JSON.stringify(responseJson));
        return responseJson;
    } catch (error) {
        throw error;
    }
    // return fetch(ConstantValues.BASE_API_URL + ConstantValues.URL_PROFILE_FILE_DELETE_STR + fileid, {
    //     method: 'DELETE',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + auth_token
    //     }
    // }).then((response) => response.text());
}


const ApiUpdateClubMonthPoints = async (auth_token, user_id) => {
    // Edukondalu
    try {
        console.log("ApiUpdateClubMonthPoints", ConstantValues.URL_REDEM_POINTS_STR + "?user_id=" + user_id);
        var response = await fetchWithTimeout(ConstantValues.URL_REDEM_POINTS_STR + "?user_id=" + user_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
        });
        // console.log("GET RES : ", JSON.stringify(response));
        var responseJson = response.text();
        console.log("RES : ", responseJson);
        return responseJson;
    } catch (error) {
        // console.log("ERROR OCCUR : ", JSON.stringify(error));
        throw error;
    }
}


const ApiRedeemRewardsList = async (auth_token, user_id, company_id) => {
    // Edukondalu
    try {


        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + "redemption?company_id=" + company_id + "&user_id=" + user_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
        });

        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
}

export const ApiSendSMTPReportEthicsMail = async (auth_token, text, file, file_format) => {
    try {
        console.log("AUTH", auth_token);
        console.log("URL :", ConstantValues.BASE_API_URL + ConstantValues.URL_ETHICS_DISCLOSURE);
        let body = {
            file: file,
            file_format,
            text: text
        }
        console.log("REQ BODY :", JSON.stringify(body));
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_ETHICS_DISCLOSURE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify(body)
        });
        // console.log("RES 1 :", JSON.stringify(response));
        var responseJson = await response.json();
        // console.log("RES 2 :", JSON.stringify(responseJson));
        return responseJson;
    } catch (error) {
        throw error;
    }
}

export const ApiGetMonthlyRewardsPoints = async (auth_token, paramsUrl) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_CLUB_MONTHLY_STR + paramsUrl,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + auth_token
                }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            }

        );
        const responseJson = await response.json();
        return responseJson;

    } catch (error) {
        throw error;
    }
}
export const ApiGetMaintenanceLocations = async (
    auth_token, params) => {
    try {
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_LOCATIONS + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
}

export const ApiSendSMTPMaintenanceMail = async (auth_token, text, file, locationId, userId, fileFormat) => {
    try {
        let body = {
            user_id: userId,
            file: file,
            location_id: locationId,
            text: text,
            file_format: fileFormat
        }
        var response = await fetchWithTimeout(ConstantValues.BASE_API_URL + ConstantValues.URL_MAINTENANCE_MAIL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth_token
            }, timeout: ConstantValues.FETCH_API_TIME_OUT,
            body: JSON.stringify(body)
        });
        var responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
}
const ApiGetAllCourses = async (params) => {
    if(ConstantValues.IS_DEVELOPMENT){
        params = `${params}&includeTest=true`
    }
    
    try {
        const response = await fetchWithTimeout(ConstantValues.NEW_LMS_BASE_URL + ConstantValues.GET_COURSES + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ''
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
}

const ApiMyLmsTracking = async (access_token, user_id) => {
    try {
        console.log(access_token, user_id)
        const params = `?user_id=${user_id}`

        console.log("Xxx", params);
        const response = await fetchWithTimeout(ConstantValues.URL_GATEWAY_GEOREP + ConstantValues.GET_LMS_DASHBOARD_API + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });

        console.log("responseJson===", responseJson)
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
}
const ApiPostQuizSubmission = async (access_token, quiz_submission) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.URL_GATEWAY_GEOREP + ConstantValues.POST_QUIZ_SUBMISSION, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(quiz_submission),
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
}
const ApiGetCoursesByCourseId = async params => {
    console.log("courses URL", ConstantValues.LMS_BASE_URL + ConstantValues.GET_COURSES_BY_COURSE_ID + params);
    try {
        const response = await fetchWithTimeout(ConstantValues.NEW_LMS_BASE_URL + ConstantValues.GET_COURSES_BY_COURSE_ID + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ''
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
}

const ApiGetCourseProgress = async (access_token, user_id, course_id) => {
    const params = `?user_id=${user_id}&course_id=${course_id}`
    console.log("GetCourseAPI URL:", ConstantValues.URL_GATEWAY_GEOREP + ConstantValues.GET_COURSE_PROGRESS_API + params)
    try {
        const response = await fetchWithTimeout(ConstantValues.URL_GATEWAY_GEOREP + ConstantValues.GET_COURSE_PROGRESS_API + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
}

const ApiSaveCourseActivity = async (access_token, course_activity) => {
    try {
        const response = await fetchWithTimeout(ConstantValues.URL_GATEWAY_GEOREP + ConstantValues.POST_COURSE_ACTIVITY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(course_activity),
            timeout: ConstantValues.FETCH_API_TIME_OUT
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        throw error;
    }
}

export {
    ApiNonAppActivityCreate,
    ApiPersonalUserRegister,
    ApiBusinessUserRegister,
    ApiUserLogin,
    ApiGetUserDetails,
    ApiGetCountryList,
    ApiGetStatesList,
    ApiGetCityList,
    ApiGetCompaniesList,
    ApiGetLocationsList,
    ApiUserLogout,
    ApiGetCompanyQuestionsList,
    ApiGetSystemQuestionsList,
    ApiGetActivitiesList,
    ApiSubmitSystemAnswers,
    ApiUpdateFavoriteLacation,
    ApiGetNonappUserScreeningQuestionsList,
    ApiCheckOutUser,
    ApiUpadateCheckInStatusOfUser,
    ApiGetWrongQuestionsList,
    ApiGetTriggerQuestions,
    ApiActivityCreate,
    ApiGetCompany,
    ApiGetLocation,
    ApiGetDivision,
    ApiGetNonAppUserSystemQuestions,
    ApiNonAppUserSubmitSystemuestions,
    ApiNonAppUserCreate,
    ApiAddSignatureOfUser,
    ApiUpdateUser,
    ApiSaveSharedPreferencesUser,
    ApiForgotPassword,
    ApiLeaveNoteUser,
    ApiLeaveAReview,
    ApiCreateNote,
    ApiUpdateNote,
    ApiGetNotes,
    ApiChangePassword,
    ApiCheckEmployeeEntry,
    ApiGetLocationSettings,
    ApiGetReferences,
    ApiGetDepartments,
    ApiUpdateFirebasData,
    ApiLocationCreate,
    ApiUpdateLocation,
    ApiGetGeoLocateAddress,
    ApiGetFormsQuestions,
    ApiGetFormsList,
    ApiDeleteGateEntry,
    ApiCreateGateActivity,
    ApiUpdateGateActivity,
    ApiGetGateActivities,
    ApiPurposeOfVisitDropDown,
    ApiCreateScanOutGateEntry,
    ApiSubmitForm,
    ApiSubmitFormAnswers,
    ApiLoyaltyCardCreate,
    ApiGetGetLoyaltyCards,
    ApiUpdateLoyaltyCard,
    ApiDeleteLoyaltyCard,
    ApiGetWhiteLabelSettings,
    ApiGetFeaturePermissions,
    ApiGetWebLinks,
    ApiGetSupportTypes,
    ApiGetFraudTypes,
    ApiSubmitSupportTypeDetails,
    ApiSubmitFraudTypeDetails,
    ApiGetValues,
    ApiGetClubMonthly,
    ApiGetClubScores,
    ApiGetValueNominations,
    ApiUpdateUserDetails,
    ApiGetRewords,
    ApiRewordRedemptionCreate,
    ApiGetRedemPoints,
    ApiGetClubCycles,
    ApiUpdateClubMonthPoints,
    ApiRedeemRewardsList,
    ApiGetAllCourses,
    ApiGetCoursesByCourseId,
    ApiMyLmsTracking,
    ApiGetCourseProgress,
    ApiSaveCourseActivity,
    ApiPostQuizSubmission
};