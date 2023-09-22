import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, ReactReduxContext } from 'react-redux';
import { Platform, Alert, BackHandler, View, Dimensions, SafeAreaView, Keyboard } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import ImagePicker from 'react-native-image-crop-picker';
import { IMIconButton } from '../../truly-native';
import IMChat from '../IMChat/IMChat';
import { channelManager } from '../firebase';
import { firebaseStorage } from '../../firebase/storage';
import { reportingManager } from '../../user-reporting';
import { IMLocalized } from '../../localization/IMLocalization';
import { notificationManager } from '../../notifications';
import MessagesHeader from '../../../components/shared/MessagesHeader';
import ApplicationDataManager from '../../../utils/ApplicationDataManager'
var applicationDataManager = ApplicationDataManager.getInstance();
import HeaderBackTitleProfile from '../../../components/shared/HeaderBackTitleProfile';
import Constantimages from '../../../utils/ConstantImages';
import AppStyles from '../../../DynamicAppStyles';
import { ApiGetUserDetails } from '../../../network/Services';
import { FriendshipConstants } from '../../socialgraph/friendships';
import FriendshipTracker from '../../socialgraph/friendships/firebase/tracker';
import UsersTracker from '../../users/tracker';
import ProgressDialog from '../../../components/dialogs/ProgressDialog';
import { ConstantValues } from '../../../utils/ConstantValues';
import { colors } from '../../../utils/StyleComponents';
// import {
//   IMAudioVideoChat,
//   sendCallInitiationRemoteNotification,
//   setMediaChatReceivers,
//   setMediaChatData,
// } from '../audioVideo';

const IMChatScreen = (props) => {
  const screenType = props.route.params.screenType;
  const selectedUser = props.route.params.selectedUser;
  const appStyles = props.route.params.appStyles;
  const [header_background_color, setHeaderBgcolor] = useState(applicationDataManager.getHeaderBgcolor())
  const [chattitle, setChatTitle] = useState("")
  const colorScheme = useColorScheme();
  const currentTheme = appStyles.navThemeConstants[colorScheme];

  const openedFromPushNotification =
    props.route.params.openedFromPushNotification;
  const navigation = props.navigation;

  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [channel, setChannel] = useState(null);
  const [thread, setThread] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [downloadObject, setDownloadObject] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [isRenameDialogVisible, setIsRenameDialogVisible] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(-1);
  const [inReplyToItem, setInReplyToItem] = useState(null);
  const [images, setImages] = useState([]);

  const threadUnsubscribe = useRef(null);
  const singleChannelUnsubscribe = useRef(null);

  const groupSettingsActionSheetRef = useRef(null);
  const privateSettingsActionSheetRef = useRef(null);

  const [willBlur, setWillBlur] = useState(false);
  const willBlurSubscription = useRef(null);
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) => {
      setWillBlur(false);
    }),
  );
  const [oppositeUserPushToken, setOppsiteUserPushToken] = useState("");
  const { store } = useContext(ReactReduxContext);
  const friendshipsTracker = useRef(null);
  const userTracker = useRef(null);
  const [isLoading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState(ConstantValues.PLEASE_WAIT_STR);
  const [profilePictureURL, setProfilePictureURL] = useState("")
  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }
    friendshipsTracker.current?.unsubscribe();
    friendshipsTracker.current = new FriendshipTracker(
      store,
      currentUser.id,
      false,
      false,
      false,
    );
    friendshipsTracker.current.subscribeIfNeeded();
    userTracker.current = new UsersTracker(store, currentUser.id);
    userTracker.current.subscribeIfNeeded();
  }, [currentUser?.id]);
  useLayoutEffect(() => {
    if (!openedFromPushNotification) {
      configureNavigation(
        channelWithHydratedOtherParticipants(props.route.params.channel),
      );
    } else {
      navigation.setOptions({ headerTitle: '' });
    }
  }, [navigation]);

  useEffect(() => {
    configureNavigation(channel);
  }, [channel]);

  useEffect(() => {
    if (thread) {
      configureImages();
    }
  }, [thread]);

  useEffect(() => {
    if (selectedMediaIndex !== -1) {
      setIsMediaViewerOpen(true);
    } else {
      setIsMediaViewerOpen(false);
    }
  }, [selectedMediaIndex]);

  useEffect(() => {
    if (props.route.params.channel != null) {
      updateChannelsData(props.route.params.channel);
    }

  }, [currentUser?.id]);
  useEffect(() => {
    willBlurSubscription.current = props.navigation.addListener(
      'blur',
      (payload) => {
        setWillBlur(true);
      },
    );
    return () => {
      willBlurSubscription.current && willBlurSubscription.current();
      didFocusSubscription.current && didFocusSubscription.current();
    };
  }, []);

  useEffect(() => {
    if (downloadObject !== null) {
      // We've just finished the photo upload, so we send the message out
      setUploadProgress(0);
      onSendInput();
    }
  }, [downloadObject]);

  useEffect(() => {
    if (willBlur) {
      threadUnsubscribe.current && threadUnsubscribe.current();
      singleChannelUnsubscribe.current && singleChannelUnsubscribe.current();
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackButtonPressAndroid);
    return () => backHandler.remove();
  }, [willBlur]);

  const updateChannelsData = async (channel) => {
    if (channel != null) {
      const hydratedChannel = channelWithHydratedOtherParticipants(channel);
      if (!hydratedChannel) {
        return;
      }
      if (screenType === "IMUserSearchModal") {
        updateSendMessage(hydratedChannel);
      }
      setChannel(hydratedChannel);
      const selectedUserData = hydratedChannel.otherParticipants;
      if (selectedUserData && selectedUserData.length > 0) {
        getUserDataById(selectedUserData[0].id);
      }
      threadUnsubscribe.current = channelManager.subscribeThreadSnapshot(
        hydratedChannel,
        onThreadCollectionUpdate,
      );
      singleChannelUnsubscribe.current = channelManager.subscribeSingleChannel(
        hydratedChannel.id,
        (doc) => {
          onRemoteChannelRetrieved(doc?.data());
        },
      );
    }
  }

  const updateSendMessage = channel => {

    setLoading(true);
    setLoaderMessage(ConstantValues.PLEASE_WAIT_STR);
    createOne2OneChannel(channel).then((response) => {
      sendMessage(response);
    });

  }
  const configureNavigation = (channel) => {
    var title = channel?.name;
    var profileURL = "";
    var isGroupChat = channel?.otherParticipants?.length > 1;
    if (!title && channel?.otherParticipants?.length > 0) {
      title =
        channel.otherParticipants[0]?.firstName +
        ' ' +
        channel.otherParticipants[0]?.lastName ||
        channel.otherParticipants[0]?.fullname;
      profileURL = channel.otherParticipants[0]?.profilePictureURL;
    }
    setProfilePictureURL(profileURL)
    setChatTitle(title || props.route.params.title || IMLocalized('Chat'))
    navigation.setOptions({ headerShown: false })
  };

  const onRemoteChannelRetrieved = (remoteChannel) => {
    if (!remoteChannel) {
      return;
    }
    // We have a hydrated channel, so we replace the partial channel we have on the state
    const hydratedChannel = channelWithHydratedOtherParticipants(remoteChannel);

    setChannel(hydratedChannel);
    // console.log("DATA 3", JSON.stringify(hydratedChannel));
    markThreadItemAsReadIfNeeded(hydratedChannel);

    // We have a hydrated channel, so we update the title of the screen
    if (openedFromPushNotification) {
      configureNavigation(hydratedChannel);
    }
  };

  const channelWithHydratedOtherParticipants = (channel) => {
    const allParticipants = channel?.participants;
    if (!allParticipants) {
      return channel;
    }
    // otherParticipants are all the participants in the chat, except for the currently logged in user
    const otherParticipants =
      allParticipants &&
      allParticipants.filter(
        (participant) => participant && participant.id != currentUser.id,
      );


    return { ...channel, otherParticipants };
  };


  const onVideoChat = () => {
    // if (channel?.otherParticipants) {
    //   dispatch(setMediaChatData({ status: 'initiated' }));
    //   dispatch(
    //     setMediaChatReceivers({
    //       receivers: channel.otherParticipants,
    //       channelId: channel.id,
    //       channelTitle: channel.name || '',
    //       type: 'video',
    //     }),
    //   );

    //   IMAudioVideoChat.showVideoChatModal();
    //   sendCallInitiationRemoteNotification(
    //     currentUser,
    //     channel?.otherParticipants,
    //     'video',
    //     channel.id,
    //     channel.name,
    //   );
    // }
  };

  const onAudioChat = () => {
    // if (channel?.otherParticipants) {
    //   dispatch(setMediaChatData({ status: 'initiated' }));
    //   dispatch(
    //     setMediaChatReceivers({
    //       receivers: channel.otherParticipants,
    //       channelId: channel.id,
    //       channelTitle: channel.name || '',
    //       type: 'audio',
    //     }),
    //   );
    //   IMAudioVideoChat.showAudioChatModal();
    //   sendCallInitiationRemoteNotification(
    //     currentUser,
    //     channel?.otherParticipants,
    //     'audio',
    //     channel.id,
    //     channel.name,
    //   );
    // }
  };

  const onSettingsPress = () => {
    if (channel?.otherParticipants?.length > 1) {
      groupSettingsActionSheetRef.current.show();
    } else {
      privateSettingsActionSheetRef.current.show();
    }
  };

  const onChangeName = (text) => {
    showRenameDialog(false);

    const channel = { ...channel };
    channel.name = text;

    channelManager.onRenameGroup(
      text,
      channel,
      ({ success, error, newChannel }) => {
        if (success) {
          setChannel(newChannel);
          configureNavigation(newChannel);
        }
        if (error) {
          alert(error);
        }
      },
    );
  };

  const onLeave = () => {
    Alert.alert(
      IMLocalized(`Leave ${channel?.name ?? 'group'}`),
      IMLocalized('Are you sure you want to leave this group?'),
      [
        {
          text: 'Yes',
          onPress: onLeaveDecided,
          style: 'destructive',
        },
        { text: 'No' },
      ],
      { cancelable: false },
    );
  };

  const onLeaveDecided = () => {
    channelManager.onLeaveGroup(
      channel.id,
      currentUser.id,
      ({ success, error }) => {
        if (success) {
          navigation.goBack(null);
        }
        if (error) {
          alert(error);
        }
      },
    );
  };

  const showRenameDialog = (show) => {
    setIsRenameDialogVisible(show);
  };

  const markThreadItemAsReadIfNeeded = (channel) => {
    const {
      id: channelID,
      lastThreadMessageId,
      readUserIDs,
      participants,
      lastMessage,
    } = channel;
    const userID = currentUser?.id;
    const isRead = readUserIDs?.includes(userID);
    if (!isRead && channelID && lastMessage && userID) {
      const newReadUserIDs = readUserIDs ? [...readUserIDs, userID] : [userID];
      channelManager.markChannelThreadItemAsRead(
        channelID,
        userID,
        lastThreadMessageId,
        newReadUserIDs,
        participants,
      );
    }
  };

  const onThreadCollectionUpdate = (querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      const message = doc.data();
      data.push({ ...message, id: doc.id });
    });
    setThread(data);
  };

  const onChangeTextInput = (text) => {
    setInputValue(text);
  };

  const createOne2OneChannel = channel => {
    return new Promise((resolve) => {
      channelManager
        .createChannel(currentUser, channel?.otherParticipants)
        .then((response) => {
          setLoading(false);
          if (!response.channel) {
            return;
          }
          setChannel(channelWithHydratedOtherParticipants(response.channel));
          threadUnsubscribe.current && threadUnsubscribe.current();
          threadUnsubscribe.current = channelManager.subscribeThreadSnapshot(
            response.channel,
            onThreadCollectionUpdate,
          );
          resolve(channelWithHydratedOtherParticipants(response.channel));
        }).catch((err) => {
          setLoading(false);
          console.log("err" + err)
        });
    });
  };

  const onSendInput = async () => {
    if (screenType === "IMUserSearchModal" && thread == null && channel == null) {
      Keyboard.dismiss();
      onAddFriend();
    } else {
      if (thread?.length > 0 || channel?.otherParticipants?.length > 1) {
        sendMessage(channel);
        return;
      }
      // If we don't have a chat message, we need to create a 1-1 channel first
      createOne2OneChannel(channel).then((response) => {
        sendMessage(response);
      });
    }

  };
  const onAddFriend = () => {
    setLoading(true);
    setLoaderMessage(ConstantValues.PLEASE_WAIT_STR);
    if (selectedUser.type == FriendshipConstants.FriendshipType.none) {
      friendshipsTracker.current?.addFriendRequest(
        currentUser,
        selectedUser.user,
        (response) => {
          setLoading(false);
          if (response?.error) {

            console.log("onAddFriend e", JSON.stringify(response));
            return;
          }
          console.log("onAddFriend", JSON.stringify(response));
        },
      );
    }
    onAccept();
  };
  const onAccept = () => {
    setLoading(true);
    setLoaderMessage(ConstantValues.PLEASE_WAIT_STR);
    friendshipsTracker.current.addFriendRequest(
      selectedUser.user,
      currentUser,
      (response) => {
        setLoading(false);
        if (response?.error) {

          console.log("onAddFriend e", JSON.stringify(response));
          return;
        }
        console.log("onAccept", JSON.stringify(response));
        createFeedStorie();
      },
    );
  };

  const createFeedStorie = async () => {
    setLoading(true);
    setLoaderMessage("Creating channel..");
    let friend = selectedUser;
    const id1 = currentUser.id || currentUser.userID;
    const id2 =
      friend.id || friend.userID || friend.user.id || friend.user.userID;
    let channel = {
      id: id1 < id2 ? id1 + id2 : id2 + id1,
      participants: friend.user ? [friend.user] : [friend],
    };
    const otherChannelInfo = props.route.params.channel?.find(
      (currentChannel) => currentChannel.id === channel.id,
    );
    if (otherChannelInfo) {
      channel = {
        ...channel,
        ...otherChannelInfo,
      };
    }
    setLoading(false);
    await updateChannelsData(channel);


  }


  const getParticipantPictures = () => {
    if (channel?.otherParticipants) {
      return channel.otherParticipants.map((participant) => {
        return {
          participantId: participant.id || participant.userID,
          profilePictureURL: participant.profilePictureURL,
        };
      });
    } else {
      return [];
    }
  };

  const sendMessage = channelsData => {
    const tempInputValue = inputValue;
    const tempInReplyToItem = inReplyToItem;
    const participantProfilePictureURLs = getParticipantPictures();
    setInputValue('');
    setInReplyToItem(null);
    channelManager
      .sendMessage(
        currentUser,
        channelsData,
        tempInputValue,
        downloadObject,
        tempInReplyToItem,
        participantProfilePictureURLs,
      )
      .then((response) => {
        setLoading(false);
        if (response.error) {
          alert(error);
          setInputValue(tempInputValue);
          setInReplyToItem(tempInReplyToItem);
        } else {
          setDownloadObject(null);
          broadcastPushNotifications(tempInputValue, downloadObject);
        }
      });
  };

  const broadcastPushNotifications = (inputValue, downloadObject) => {
    const participants = channel.otherParticipants;
    // console.log("otherParticipants:", JSON.stringify(participants));
    // console.log("CHANNED IN CHAT SCREEN :", JSON.stringify(channel));
    if (!participants || participants.length == 0) {
      return;
    }
    const sender = currentUser;
    const isGroupChat = channel.name && channel.name.length > 0;
    let fromTitle = '';
    if (isGroupChat) {
      fromTitle = channel.name;
    } else if (sender.preferredName) {
      fromTitle = sender.preferredName + ' ' + sender.lastName;
    } else {
      fromTitle = sender.firstName + ' ' + sender.lastName;
    }
    var message;
    if (isGroupChat) {

      if (downloadObject) {
        if (
          downloadObject.mime &&
          downloaddownloadObjectURL.mime.startsWith('video')
        ) {
          message =
            sender.firstName +
            ' ' +
            sender.lastName +
            ' ' +
            IMLocalized('sent a video.');
        } else {
          message =
            sender.firstName +
            ' ' +
            sender.lastName +
            ' ' +
            IMLocalized('sent a photo.');
        }
      } else {
        console.log("else1 executed");
        message = sender.firstName + ' ' + sender.lastName + ': ' + inputValue;
      }
    } else {
      if (downloadObject) {
        if (downloadObject.mime && downloadObject.mime.startsWith('video')) {
          message = sender.firstName + ' ' + IMLocalized('sent you a video.');
        } else if (
          downloadObject.mime &&
          downloadObject.mime.startsWith('audio')
        ) {
          message =
            sender.firstName + ' ' + IMLocalized('sent you an audio message.');
        } else {
          message = sender.firstName + ' ' + IMLocalized('sent you a photo.');
        }
      } else {
        message = inputValue;
      }
    }



    participants.forEach((participant) => {
      if (participant.id !== currentUser.id) {
        notificationManager.sendPushNotification(
          participant,
          fromTitle,
          message,
          'chat_message',
          { channelID: channel.id },
          oppositeUserPushToken

        );
      }
    });
  };

  const onAddMediaPress = (photoUploadDialogRef) => {
    photoUploadDialogRef.current.show();
  };

  const onAudioRecordSend = (audioRecord) => {
    startUpload(audioRecord);
  };

  const onLaunchCamera = () => {
    const { id, firstName, profilePictureURL } = currentUser;

    ImagePicker.openCamera({
      cropping: false,
    })
      .then((image) => {
        startUpload(image);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onOpenPhotos = () => {
    const { id, firstName, profilePictureURL } = currentUser;

    ImagePicker.openPicker({
      cropping: false,
      multiple: false,
    })
      .then((image) => {
        startUpload(image);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const startUpload = (uploadData) => {
    const { mime } = uploadData;
    firebaseStorage.uploadFileWithProgressTracking(
      uploadData,
      async (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(uploadProgress);
      },
      async (url) => {
        if (url) {
          setDownloadObject({
            ...uploadData,
            source: url,
            uri: url,
            url,
            mime,
          });
        }
      },
      (error) => {
        setUploadProgress(0);
        alert(IMLocalized('Oops! An error has occurred. Please try again.'));
        console.log(error);
      },
    );


  };

  const configureImages = () => {
    var images = [];

    thread?.forEach((item) => {
      if (item && item.url && item.url !== '') {
        if (item.url.mime && item.url.mime.startsWith('image')) {
          images.push({
            id: item.id,
            url: item.url,
          });
        } else if (!item.url.mime && item.url.startsWith('https://')) {
          // To handle old format before video feature
          images.push({
            id: item.id,
            url: item.url,
          });
        }
      }
    });
    setImages(images);
  };

  const onChatMediaPress = (item) => {
    const index = images?.findIndex((image) => {
      return image.id === item.id;
    });
    setSelectedMediaIndex(index);
  };
  const onMediaClose = () => {
    setSelectedMediaIndex(-1);
  };

  const onUserBlockPress = () => {
    reportAbuse('block');
  };

  const onUserReportPress = () => {
    reportAbuse('report');
  };

  const reportAbuse = (type) => {
    const participants = channel?.otherParticipants;
    if (!participants || participants.length != 1) {
      return;
    }
    const myID = currentUser.id;
    const otherUserID = participants[0].id;
    reportingManager.markAbuse(myID, otherUserID, type).then((response) => {
      if (!response.error) {
        navigation.goBack(null);
      }
    });
  };

  const onReplyActionPress = (inReplyToItem) => {
    setInReplyToItem(inReplyToItem);
  };

  const onReplyingToDismiss = () => {
    setInReplyToItem(null);
  };

  const onDeleteThreadItem = (threadItem) => {
    let newLastCreatedThreadItem = null;
    let isLastCreatedThreadItem = false;

    if (thread.length > 0 && thread[0].id === threadItem?.id) {
      isLastCreatedThreadItem = true;
      newLastCreatedThreadItem = thread[1];
    }

    const params = {
      isLastCreatedThreadItem,
      newLastCreatedThreadItem,
      channel,
      sender: currentUser,
      threadItemID: threadItem?.id,
    };

    channelManager.deleteMessage(params);
  };
  const onBackButtonPressAndroid = () => {
    props.navigation.goBack();
    return true;
  };

  const getUserDataById = (userid) => {
    let params = "?id=" + userid;
    ApiGetUserDetails("", params).then(response => {
      setOppsiteUserPushToken(response[0].device_token);
    }).catch(error => {
      this.setState({ isLoading: false });
      apiErrorHandler(null, error, ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE, () => { ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false) });
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderBackTitleProfile
        title={ConstantValues.MESSAGE_LIST}//{"Show"}
        backcolor={"colors.GREY_COLOR"}
        headerstyle={{
          flexDirection: 'row',
          backgroundColor: header_background_color != "" ? header_background_color
            : colors.COLOR_THEME,
          paddingVertical: 8,
          paddingHorizontal: 10
        }}
        headerlogo={Constantimages.flash_back_icon}
        profilename={chattitle}
        buttonPress={
          onBackButtonPressAndroid
        }
        source={Constantimages.back_icon}
        rightimage={AppStyles.iconSet.add_group}
        profilePictureURL={profilePictureURL}

      />
      <IMChat
        appStyles={appStyles}
        user={currentUser}
        thread={thread}
        inputValue={inputValue}
        inReplyToItem={inReplyToItem}
        onAddMediaPress={onAddMediaPress}
        onSendInput={onSendInput}
        onAudioRecordSend={onAudioRecordSend}
        onChangeTextInput={onChangeTextInput}
        onLaunchCamera={onLaunchCamera}
        onOpenPhotos={onOpenPhotos}
        uploadProgress={uploadProgress}
        mediaItemURLs={images.flatMap((i) => i.url?.url)}
        isMediaViewerOpen={isMediaViewerOpen}
        selectedMediaIndex={selectedMediaIndex}
        onChatMediaPress={onChatMediaPress}
        onMediaClose={onMediaClose}
        isRenameDialogVisible={isRenameDialogVisible}
        groupSettingsActionSheetRef={groupSettingsActionSheetRef}
        privateSettingsActionSheetRef={privateSettingsActionSheetRef}
        showRenameDialog={showRenameDialog}
        onChangeName={onChangeName}
        onLeave={onLeave}
        onUserBlockPress={onUserBlockPress}
        onUserReportPress={onUserReportPress}
        onReplyActionPress={onReplyActionPress}
        onReplyingToDismiss={onReplyingToDismiss}
        onDeleteThreadItem={onDeleteThreadItem}
        channelItem={channel}
      />
      <ProgressDialog
        visible={isLoading}
        title={loaderMessage}
        background={colors.COLOR_THEME}
        isShowText={true}
      />
    </SafeAreaView>
  );



};

export default IMChatScreen;
