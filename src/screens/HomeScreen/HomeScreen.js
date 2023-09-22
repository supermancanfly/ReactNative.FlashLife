import React, {
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
} from 'react';
import { BackHandler, Text, View, TouchableOpacity, Image, SafeAreaView, StatusBar } from "react-native";
import { useSelector, ReactReduxContext } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import { IMChatHomeComponent } from '../../Core/chat';
import { TNTouchableIcon } from '../../Core/truly-native';
import { connect } from 'react-redux';
import AppStyles from '../../DynamicAppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import FriendshipTracker from '../../Core/socialgraph/friendships/firebase/tracker';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../../utils/StyleComponents';
import Constantimages from '../../utils/ConstantImages';
import MessagesHeader from '../../components/shared/MessagesHeader';
const HomeScreen = (props) => {
  const { store } = useContext(ReactReduxContext);
  const { navigation } = props;
  var applicationDataManager = ApplicationDataManager.getInstance();
  let colorScheme = useColorScheme();
  let currentTheme = AppStyles.navThemeConstants[colorScheme];
  const [loading, setLoading] = useState(true);
  const [header_background_color, setHeaderBgcolor] = useState(applicationDataManager.getHeaderBgcolor())
  const friends = useSelector((state) => state.friends.friends);
  const currentUser = useSelector((state) => state.auth.user);
  const channels = useSelector((state) => state.chat.channels);
  const friendships = useSelector((state) => state.friends.friendships);
  const friendshipTracker = useRef(null);
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, []);

  useEffect(() => {
    let userId = currentUser?.id;
    if (userId) {
      friendshipTracker.current = new FriendshipTracker(store, currentUser?.id);
      friendshipTracker.current.subscribeIfNeeded();
    }

  }, [currentUser?.id]);

  const onBackButtonPressAndroid = () => {
    if (props.fromNotification) {
      props.onBackForms();
    } else {
      props.navigation.goBack();

    }
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackButtonPressAndroid);
    return () => backHandler.remove();
  });

  const openDrawer = () => {
    props.navigation.openDrawer();
  };

  const onFriendItemPress = (friend, isFromChat = false) => {
    const id1 = currentUser.id || currentUser.userID;
    const id2 =
      friend.id || friend.userID || friend.user.id || friend.user.userID;
    let channel = {
      id: id1 < id2 ? id1 + id2 : id2 + id1,
      participants: friend.user ? [friend.user] : [friend],
    };
    const otherChannelInfo = channels?.find(
      (currentChannel) => currentChannel.id === channel.id,
    );
    if (otherChannelInfo) {
      channel = {
        ...channel,
        ...otherChannelInfo,
      };
    }
    props.navigation.navigate('PersonalChat', {
      channel,
      appStyles: AppStyles,
    });
  };

  const onSearchButtonPress = async () => {
    props.navigation.navigate('UserSearchScreen', {
      appStyles: AppStyles,
      followEnabled: false,
      onFriendItemPress: onFriendItemPress
    });
  };

  const onEmptyStatePress = () => {
    onSearchButtonPress();
  };

  const onSenderProfilePicturePress = (item) => {
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
      <StatusBar hidden={true} />
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        <MessagesHeader
          title={"Show"}
          backcolor={"colors.GREY_COLOR"}
          headerstyle={{
            flexDirection: 'row',
            backgroundColor: header_background_color != "" ? header_background_color
              : colors.COLOR_THEME,
            paddingVertical: 8,
            paddingHorizontal: 10
          }}
          headerlogo={Constantimages.flash_back_icon}
          profilename={"Messages"}
          buttonPress={
            onBackButtonPressAndroid
          }
          onaddGroup={() =>
            navigation.navigate('CreateGroup',
              { appStyles: AppStyles })
          }
          source={Constantimages.back_icon}
          rightimage={AppStyles.iconSet.add_group}

        />

        <IMChatHomeComponent
          loading={loading}
          friends={friends}
          onFriendItemPress={onFriendItemPress}
          onSearchBarPress={onSearchButtonPress}
          appStyles={AppStyles}
          navigation={props.navigation}
          onEmptyStatePress={onEmptyStatePress}
          onSenderProfilePicturePress={onSenderProfilePicturePress}
          user={currentUser}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;