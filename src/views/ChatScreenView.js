// ChatScreenView.js



import PropTypes from 'prop-types';
import React, {
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  Keyboard,
  // TextInput,
  BackHandler,
  ActivityIndicator,
  Alert,
  PixelRatio,
  PermissionsAndroid
} from 'react-native';
import { useSelector, ReactReduxContext } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import { IMChatHomeComponent } from '../../Core/chat';
import { TNTouchableIcon } from '../../Core/truly-native';
import AppStyles from '../../DynamicAppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import FriendshipTracker from '../../Core/socialgraph/friendships/firebase/tracker';
import { firebaseUser } from '../../Core/firebase';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../../utils/StyleComponents';
var applicationDataManager = ApplicationDataManager.getInstance();
const defaultAvatar =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';
class ChatScreenView extends React.Component {

  // this.dbRef = firebase.firestore().collection('users');
  constructor(props) {
    super(props)
    this.state = {
      friendsdata: [],
      userData: this.props.userData,
      isLoading: false,
      chatItem: this.props.route.params.chatItem,
      // chatMessages:this.
    }

  }

  componentDidMount() {
    this.usersUnsubscribe = firebaseUser.subscribeUsers(
      this.onUsersCollection,
    );
  }



  //  useEffect(() => {
  //   this.usersUnsubscribe = firebaseUser.subscribeUsers(
  //     this.onUsersCollection,
  //   );
  // //  let p= ApplicationDataManager.getInstance().getFriendsList()
  // // console.log("p"+JSON.stringify(p))
  //  }, [friends]);


  onUsersCollection = (users) => {

    const nonMeUsers = users.filter((user) => user.employee_company_id != this.props.userData[0].employee_company_id);
    if (nonMeUsers?.length > 0) {
      this.setState({
        friendsdata: nonMeUsers
      })
      // setFriends(users)
      // ApplicationDataManager.getInstance().setFriendsList(nonMeUsers);
      // let p= ApplicationDataManager.getInstance().getFriendsList()
      // console.log("p"+JSON.stringify(p))
      // friendsdata=p;
      // console.log("friendsdata"+JSON.stringify(friendsdata))
      // ApplicationDataManager.getInstance().getFriendsList()
    }
    // setFriends(nonMeUsers)
    // setFriends(nonMeUsers)
    // this.updateUsersIfNeeded();
    // this.onSetValues(nonMeUsers);
  };

  //  onSetValues=(nonMeUsers)=>{
  //   // setFriends(nonMeUsers)
  // }


  onFriendItemPress = async (friend) => {

  }

  onConversation = async (item, index) => {
  }

  onSearchButtonPress = async () => {

  };

  onEmptyStatePress = () => {
    // onSearchButtonPress();
  };

  onSenderProfilePicturePress = (item) => {
  };


  render() {
    return (
      // console.log("-2222--"+JSON.stringify(friends)),
      // <IMChatHomeComponent
      //   loading={this.state.isLoading}
      //   friends={this.state.friendsdata}
      //   onFriendItemPress={this.onFriendItemPress}
      //   onSearchBarPress={this.onSearchButtonPress}
      //   appStyles={AppStyles}
      //   navigation={this.props.navigation}
      //   onEmptyStatePress={this.onEmptyStatePress}
      //   onSenderProfilePicturePress={this.onSenderProfilePicturePress}
      //   user={this.state.userData}
      // />
      <ScrollView showsVerticalScrollIndicator={false}
        style={{
          marginBottom: 70
        }}
      >
        <View style={{ flex: 1, padding: 16, }}>
          {this.state.friendsdata.map((item, index) => (
            // console.log("this.props.featureData[0].app_report_fraud"+JSON.stringify(this.props.featureData[0])),

            <TouchableOpacity
              onPress={() => {
                this.onConversation(item, index)
              }
                // this.onListItemClick(item)
              }
              key={index}
            >
              <View
                style={{
                  paddingVertical: 20,
                  flexDirection: 'row',
                  // justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  // backgroundColor: colors.COLOR_WHITE,
                  // elevation: 3,
                  // shadowOffset: { width: 0, height: 2 },
                  // shadowOpacity: 0.3,
                  margin: 3,
                  // borderRadius:5
                }}>
                <Image
                  style={[{
                    width: 60,
                    height: 60,
                    borderRadius: Math.floor(60 / 2),
                    // borderColor: 'grey',
                    borderWidth: 1,
                    overflow: 'hidden',
                  }]}
                  source={{ uri: item.profilePictureURL }}
                />
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <Text style={{ color: colors.COLOR_BLACK }}>
                    {`${item.name} ${item.lastname}`}


                  </Text>
                  <Text style={{ color: colors.GREY_COLOR }}>
                    I love this great app


                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
          }
        </View>

      </ScrollView>


    );
  }
};

export default ChatScreenView;

