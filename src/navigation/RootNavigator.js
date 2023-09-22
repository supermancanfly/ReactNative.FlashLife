import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginView from '../views/LoginView';
import FlashLoginView from '../views/FlashLoginView';
import SplashView from '../views/SplashView';
import MainView from '../views/MainView';
import ProfileView from '../views/ProfileView';
import MoreView from '../views/MoreView';
import ClubView from '../views/ClubView';
import CheckInView from '../views/CheckInView';
import EmployeeView from '../views/EmployeeView';
import RegistrationView from '../views/RegistraionView';
import ApprovedAccessView from '../views/ApprovedAccessView';
import AccessControlView from '../views/AccessControlView';
import HomeReceptionLoginView from '../views/HomeReceptionLoginView';
import HomeChoiceWynbergView from '../views/HomeChoiceWynbergView';
import ForgotPasswordView from '../views/ForgotPasswordView';
import ChangePasswordView from '../views/ChangePasswordView';
import HomeAddressView from '../views/HomeAddressView';
import VisitorGateEntryView from '../views/VisitorGateEntryView';
import RegisterEntryHomeView from '../views/RegisterEntryHomeView';
import FormsView from '../views/FormsView';
import WeblinkView from '../views/WeblinkView';
import LoyaltyCardsView from '../views/LoyaltyCardsView';
import ClubSubmissionsView from '../views/ClubSubmissionsView';
import ClubRewordsView from '../views/ClubRewordsView';
import ClubDashboardView from '../views/ClubDashboardView';
import ClubFormQuestionsView from '../views/ClubFormQuestionsView';
import TagFormsView from '../views/TagFormsView';
import FormQuestionsView from '../views/FormQuestionsView';
import LoyaltyCardDetails from '../views/LoyaltyCardDetails';
import AddLoyaltyCard from '../views/AddLoyaltyCard';
import EditLoyaltyCardView from '../views/EditLoyaltyCardView';
import InlineWebView from '../views/InlineWebView';
import ReportFraudView from '../views/ReportFraudView';
import SupportView from '../views/SupportView';
import MicrosoftLoginWebView from '../views/MicrosoftLoginWebView';
import LearningView from '../views/LearningView';
import VocherDetailsView from '../views/VocherDetailsView';
import BookingsView from '../views/BookingsView';
import LunchView from '../views/LunchView';
import DeskView from '../views/DeskView';
import TravelView from '../views/TravelView';
import FlashMoreView from '../views/flashlifeviews/FlashMoreView';
import FlashSupportView from '../views/flashlifeviews/FlashSupportView';
import FlashClubView from '../views/flashlifeviews/FlashClubView';
import FlashFormQuestionsView from '../views/flashlifeviews/FlashFormQuestionsView';
import FlashReportFraudView from '../views/flashlifeviews/FlashReportFraudView';
import ContentLibraryView from '../views/flashlifeviews/ContentLibraryView';
import FlashClubDashboardView from '../views/flashlifeviews/FlashClubDashboardView';
import FlashProfileView from '../views/flashlifeviews/FlashProfileView';
import FlashClubRewordsView from '../views/flashlifeviews/FlashClubRewordsView';
import MessagesView from '../views/MessagesView';
import { IMChatScreen } from '../Core/chat';
import { IMUserSearchModal } from '../Core/socialgraph/friendships';
import { createDrawerNavigator } from '@react-navigation/drawer';
import IMDrawerMenu from '../Core/ui/drawer/IMDrawerMenu/IMDrawerMenu';
import { IMFriendsScreen, IMCreateGroupScreen } from '../Core';
import {
  IMEditProfileScreen,
  IMUserSettingsScreen,
  IMContactUsScreen,
} from '../Core/profile';
import MyProfileScreen from '../screens/MyProfileScreen/MyProfileScreen';
import ChatConfig from '../config';

import { IMLocalized } from '../Core/localization/IMLocalization';
import authManager from '../Core/onboarding/utils/authManager';
import HomeScreen from '../screens/HomeScreen/HomeScreen';


const Stack = createStackNavigator();
import DynamicAppStyles from '../DynamicAppStyles';
import TrainingDashboard from '../views/flashlifeviews/training_view/TrainingDashboard';
import CourseDashboard from '../views/flashlifeviews/training_view/CourseDashboard';
import TermsKnow from '../views/flashlifeviews/training_view/TermsKnow';
import LeassonPage from '../views/flashlifeviews/training_view/leasson_view/LeassonPage';
// import { AppNavigator } from '../navigations/AppNavigation';
const RootNavigator = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          {/* {companyid.companyid==37 ? */}


          {/* ChatScreen: { screen: IMChatScreen }, */}
          {/* <Stack.Screen
            options={{ headerShown: false }}
            appStyles={ DynamicAppStyles}
            name="ChatScreen"
            component={IMChatScreen}
          /> */}
          <Stack.Screen
            initialParams={{
              appStyles: DynamicAppStyles,
              appConfig: ChatConfig,
            }}
            options={{ headerShown: false }}
            name="Splash"
            component={SplashView}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="Messages"
            component={MessagesView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginView}
          />
          {/* : */}
          <Stack.Screen
            options={{ headerShown: false }}
            name="FlashLogin"
            component={FlashLoginView}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="TagForms"
            component={TagFormsView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="EditLoyaltyCard"
            component={EditLoyaltyCardView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="AddLoyaltyCard"
            component={AddLoyaltyCard}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="LoyaltyCardDetails"
            component={LoyaltyCardDetails}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Forms"
            component={FormsView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Weblink"
            component={WeblinkView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="WebView"
            component={InlineWebView}
          />
          {/*  */}
          <Stack.Screen
            options={{ headerShown: false }}
            name="ClubFormQuestions"
            component={ClubFormQuestionsView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ClubRewords"
            component={ClubRewordsView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ClubSubmissions"
            component={ClubSubmissionsView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ClubDashboard"
            component={ClubDashboardView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Loyalty"
            component={LoyaltyCardsView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Club"
            component={ClubView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="FlashClub"
            component={FlashClubView}
          />
          {/*  */}
          <Stack.Screen
            options={{ headerShown: false }}
            name="FormQuestions"
            component={FormQuestionsView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="FlashFormQuestions"
            component={FlashFormQuestionsView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="GateEntryHome"
            component={RegisterEntryHomeView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="GateEntry"
            component={VisitorGateEntryView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Register"
            component={RegistrationView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Main"
            component={MainView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="HomeAddress"
            component={HomeAddressView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Forgot"
            component={ForgotPasswordView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Change Password"
            component={ChangePasswordView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="HomeChoiceWynberg"
            component={HomeChoiceWynbergView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="More"
            component={MoreView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="FlashMore"
            component={FlashMoreView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="FlashClubRewords"
            component={FlashClubRewordsView}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="ReceptionLogin"
            component={HomeReceptionLoginView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Profile"
            component={ProfileView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="CheckIn"
            component={CheckInView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Employee"
            component={EmployeeView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="AccessControl"
            component={AccessControlView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="FlashClubDashboard"
            component={FlashClubDashboardView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="FlashProfile"
            component={FlashProfileView}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="Approval"
            component={ApprovedAccessView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ReportFraud"
            component={ReportFraudView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="FlashReportFraud"
            component={FlashReportFraudView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="FlashContent"
            component={ContentLibraryView}
          />

          {/*  */}
          <Stack.Screen
            options={{ headerShown: false }}
            name="Support"
            component={SupportView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Microsoft"
            component={MicrosoftLoginWebView}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="FlashSupport"
            component={FlashSupportView}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="Learn"
            component={LearningView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Vocher"
            component={VocherDetailsView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Bookings"
            component={BookingsView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Lunch"
            component={LunchView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Desk"
            component={DeskView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Travel"
            component={TravelView}
          />
          <Stack.Screen
            name="UserSearchScreen"
            component={IMUserSearchModal}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='training_dashboard_view'
            component={TrainingDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='course_dashboard_view'
            component={CourseDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='terms_to_know_view'
            component={TermsKnow}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='leasson_view'
            component={LeassonPage}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            options={{ headerShown: false }}
            name="ChatIView"
            component={ChatScreenView}
          />
       */}
          <RootStack.Screen
            name="MainStack"
            options={{ headerShown: false }}
            component={MainStackNavigator}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();
const HomeSearchStackNavigator = createStackNavigator();
const FriendsSearchStackNavigator = createStackNavigator();


const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home" headerMode="float">
      <Stack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
        }}
        name={IMLocalized('Home')}
        options={{ headerShown: false }}
        component={DrawerStack}
      />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <AppStack.Navigator
      initialRouteName="Home"
      headerMode="float"
      screenOptions={{ headerTitleAlign: 'center' }}>
      <AppStack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
        }}
        name="Home"
        component={HomeScreen}
      />
      <AppStack.Screen name="CreateGroup" component={IMCreateGroupScreen} />
      <AppStack.Screen name="PersonalChat" component={IMChatScreen} />
    </AppStack.Navigator>
  );
};

const HomeSearchStack = () => {
  return (
    <HomeSearchStackNavigator.Navigator
      mode="modal"
      initialRouteName="Main"
      headerMode="float">
      <HomeSearchStackNavigator.Screen
        name="Main"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <HomeSearchStackNavigator.Screen
        name="UserSearchScreen"
        component={IMUserSearchModal}
        options={{ headerShown: false }}
      />
    </HomeSearchStackNavigator.Navigator>
  );
};

const FriendsStack = () => {
  return (
    <AppStack.Navigator initialRouteName="Friends" headerMode="float">
      <AppStack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
          showDrawerMenuButton: true,
        }}
        name="Friends"
        component={IMFriendsScreen}
      />
    </AppStack.Navigator>
  );
};

const FriendsSearchStack = () => {
  return (
    <FriendsSearchStackNavigator.Navigator
      mode="modal"
      initialRouteName="Main"
      headerMode="float">
      <FriendsSearchStackNavigator.Screen
        name="Main"
        component={FriendsStack}
        options={{ headerShown: false }}
      />
      <FriendsSearchStackNavigator.Screen
        name="UserSearchScreen"
        component={IMUserSearchModal}
        options={{ headerShown: false }}
      />
    </FriendsSearchStackNavigator.Navigator>
  );
};

const MyProfileStack = () => {
  return (
    <AuthStack.Navigator>
      <Stack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: ChatConfig,
        }}
        name="MyProfile"
        component={MyProfileScreen}
      />
      <AuthStack.Screen name="AccountDetails" component={IMEditProfileScreen} />
      <AuthStack.Screen name="Settings" component={IMUserSettingsScreen} />
      <AuthStack.Screen name="ContactUs" component={IMContactUsScreen} />
    </AuthStack.Navigator>
  );
};

// drawer stack
const DrawerStack = () => {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      drawerStyle={{ width: 270 }}
      drawerContent={({ navigation, state }) => {
        return (
          <IMDrawerMenu
            navigation={navigation}
            menuItems={ChatConfig.drawerMenu.upperMenu}
            menuItemsSettings={ChatConfig.drawerMenu.lowerMenu}
            appStyles={DynamicAppStyles}
            authManager={authManager}
            appConfig={ChatConfig}
          />
        );
      }}
      initialRouteName="HomeSearchStack">
      <Drawer.Screen name="HomeSearchStack" component={HomeSearchStack} />
      <Drawer.Screen name="FriendsSearchStack" component={FriendsSearchStack} />
      <Drawer.Screen name="MyProfileStack" component={MyProfileStack} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  return (
    // <NavigationContainer>
    <RootNavigator />
    // </NavigationContainer>
  );
};


export { RootNavigator, AppNavigator };
