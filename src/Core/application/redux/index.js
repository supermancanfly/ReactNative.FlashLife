const SET_FOOTER_TABS = 'SET_FOOTER_TABS';
const SET_FIREBASE_USER_DATA = 'SET_FIREBASE_USER_DATA';
const SET_NAVIGATION_ORDERS = 'SET_NAVIGATION_ORDERS_DATA';
const SET_FOOTER_OPTIONS = 'SET_FOOTER_OPTIONS';
const SET_FEATURE_DATA = 'SET_FEATURE_DATA';
export const setFooterTabs = (data) => ({
    type: SET_FOOTER_TABS,
    data,
});

export const setFirebaseUserData = (data) => ({
    type: SET_FIREBASE_USER_DATA,
    data
});

export const setNavigationOrders = (data) => ({
    type: SET_NAVIGATION_ORDERS,
    data
});

export const setFooterOptions = (data) => ({
    type: SET_FOOTER_OPTIONS,
    data
});
export const setFeatureData = (data) => ({
    type: SET_FEATURE_DATA,
    data
});

const initialState = {
    footer_tabs: [],
    firebase_user_data: [],
    footer_options: [],
    navigation_orders: [],
    feature_data: []
};

export const applicationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FOOTER_TABS:
            return { ...state, footer_tabs: action.data };
        case SET_FIREBASE_USER_DATA:
            return { ...state, firebase_user_data: action.data }
        case SET_FOOTER_OPTIONS:
            return { ...state, footer_options: action.data }
        case SET_NAVIGATION_ORDERS:
            return { ...state, navigation_orders: action.data }
        case SET_FEATURE_DATA:
            return { ...state, feature_data: action.data }
        default:
            return state;
    }
};
