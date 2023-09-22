import PropTypes from 'prop-types';
import React, {
  useEffect,
  useLayoutEffect,
  useContext,
  useState,
  useRef,
} from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
import IMConversationList from '../IMConversationList';
import ChannelsTracker from '../firebase/channelsTracker';

const IMConversationListView = (props) => {
  const appStyles =
    (props.navigation &&
      props.route &&
      props.route.params &&
      props.route.params.appStyles) ||
    props.appStyles;
  const currentUser = useSelector((state) => state.auth.user);
  const channels = useSelector((state) => state.chat.channels);
  const { store } = useContext(ReactReduxContext);
  const channelsTracker = useRef(null);

  // console.log("STORE VALUE OBJECT :", JSON.stringify(store));

  useEffect(() => {

    const userId = currentUser.id || currentUser.userID;
    if (!userId) {
      return;
    }

    channelsTracker.current = new ChannelsTracker(store, userId);
    channelsTracker.current.subscribeIfNeeded();
    // console.log("STORE VALUE AND USER ID:" + store, userId);
  }, [currentUser?.id]);

  useEffect(() => {
    return () => {
      channelsTracker.current?.unsubscribe();
    };
  }, []);

  const onConversationPress = (channel) => {
    // console.log("onConversationPress:channel" + JSON.stringify(channel));
    let title = '';
    let participant = channel.participants[0];


    if (participant.preferredName) {
      title = participant.preferredName + ' ' + participant.lastName;
    } else {
      title = participant.firstName + ' ' + participant.lastName;
    }
    props.navigation.navigate('PersonalChat', {
      channel: { ...channel, name: title },//channel.title },
      appStyles: appStyles,
    });

  };

  return (
    <IMConversationList
      loading={channels == null}
      conversations={channels}
      onConversationPress={onConversationPress}
      appStyles={appStyles}
      emptyStateConfig={props.emptyStateConfig}
      user={currentUser}
    />
  );
};

export default IMConversationListView;
