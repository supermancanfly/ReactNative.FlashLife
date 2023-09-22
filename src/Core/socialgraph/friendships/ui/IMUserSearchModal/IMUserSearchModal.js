import React, {
  useContext,
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
} from 'react';
import { FlatList, View, BackHandler, Keyboard } from 'react-native';
import { useSelector, ReactReduxContext } from 'react-redux';
import { IMFriendItem } from '../..';
import { SearchBar } from '../../../..';
import dynamicStyles from './styles';
import ProgressDialog from '../../../../../components/dialogs/ProgressDialog';
import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../../../localization/IMLocalization';
import { FriendshipConstants, filteredNonFriendshipsFromUsers } from '../..';
import FriendshipTracker from '../../firebase/tracker';
import UsersTracker from '../../../../users/tracker';
import { connect } from 'react-redux';
import TNActivityIndicator from '../../../../truly-native/TNActivityIndicator';
import HomeScreen from '../../../../../screens/HomeScreen/HomeScreen';
import ApplicationDataManager from '../../../../../utils/ApplicationDataManager';
function IMUserSearchModal(props) {
  var applicationDataManager = ApplicationDataManager.getInstance();
  const [header_background_color, setHeaderBgcolor] = useState(applicationDataManager.getHeaderBgcolor())
  const { onFriendItemPress } = props;

  const currentUser = useSelector((state) => state.auth.user);
  const reduxUsers = useSelector((state) => state.users.users);
  const friendships = useSelector((state) => state.friends.friendships);

  const searchBarRef = useRef(null);
  const colorScheme = useColorScheme();
  const appStyles = props.route.params.appStyles;
  const styles = dynamicStyles(appStyles, colorScheme);
  const [loading, setLoading] = useState(false);
  const followEnabled = props.route.params.followEnabled;

  const { store } = useContext(ReactReduxContext);
  const [keyword, setKeyword] = useState('');
  const [filteredFriendships, setFilteredFriendships] = useState([]);
  const userTracker = useRef(null);
  const friendshipsTracker = useRef(null);

  function backButtonHandler() {
    props.navigation.pop();
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  useEffect(() => {

    if (!currentUser?.id) {
      return;
    }

    friendshipsTracker.current?.unsubscribe();
    friendshipsTracker.current = new FriendshipTracker(
      store,
      currentUser.id,
      followEnabled,
      followEnabled,
      followEnabled,
    );
    friendshipsTracker.current.subscribeIfNeeded();

    userTracker.current = new UsersTracker(store, currentUser.id);
    userTracker.current.subscribeIfNeeded();

    if (searchBarRef.current) {
      searchBarRef.current.focus();
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (reduxUsers) {
      updateFilteredFriendships();
    }
  }, [reduxUsers]);

  useEffect(() => {
    if (reduxUsers) {
      updateFilteredFriendships();
    }
  }, [reduxUsers]);

  useEffect(() => {
    return () => {
      userTracker.current?.unsubscribe();
      friendshipsTracker.current?.unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    let currentTheme = appStyles.navThemeConstants[colorScheme];
    props.navigation.setOptions({
      headerTitle: IMLocalized('Search users...'),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
    });
  }, []);

  const renderItem = ({ item, index }) => (

    <IMFriendItem
      item={item}
      onFriendAction={() => onAddFriend(item, index)}
      onFriendItemPress={onFriendItemPress}
      appStyles={appStyles}
      followEnabled={followEnabled}
    />
  );

  const updateFilteredFriendships = (filteringKeyword = keyword) => {
    // console.log("redux", reduxUsers);
    // console.log("friendships", friendships);
    if (reduxUsers == null) {//|| friendships == null) {
      return;
    }

    let userData = applicationDataManager.getUserData()
    const filteredFriendships = filteredNonFriendshipsFromUsers(
      filteringKeyword,
      reduxUsers.filter((user) => user.id != currentUser?.id && user.employee_company_id == userData[0].employee_company_id),
      friendships,
    ).splice(0, 25); // Show only 25 results at a time
    setFilteredFriendships(filteredFriendships);
  };

  const onSearchClear = () => {
    setKeyword('');
  };

  const onSearchBarCancel = async () => {
    if (searchBarRef.current) {
      searchBarRef.current.blur();
    }
    props.navigation.goBack();
  };

  const onSearchTextChange = (text) => {
    console.log(text, "-------");
    setKeyword(text.trim());
    updateFilteredFriendships(text.trim());
  };

  const onAddFriend = (item, index) => {
    // setLoading(true);
    // console.log("Current user", JSON.stringify(currentUser));
    // console.log("selected user", JSON.stringify(item.user));
    // if (item.type == FriendshipConstants.FriendshipType.none) {
    //   const oldFilteredFriendships = filteredFriendships;
    //   removeFriendshipAt(index);
    //   friendshipsTracker.current?.addFriendRequest(
    //     currentUser,
    //     item.user,
    //     (response) => {
    //       console.log("onAddFriend", JSON.stringify(response));
    //       if (response?.error) {
    //         setFilteredFriendships(oldFilteredFriendships);
    //       }
    //     },
    //   );
    // }
    // // onAddCurrentUser(currentUser, 0);
    // onAccept(currentUser, item)
    Keyboard.dismiss();
    props.navigation.navigate('PersonalChat', {
      channel: null,
      appStyles: appStyles,
      screenType: "IMUserSearchModal",
      selectedUser: item,
      onFriendItemPress: props.route.params.onFriendItemPress
    });
  };


  const onAccept = (currentUser, item) => {
    // console.log("ACCEPT FRIEND", JSON.stringify(item));
    // setIsLoading(true);
    friendshipsTracker.current.addFriendRequest(
      item.user,
      currentUser,
      (response) => {
        console.log("onAccept", JSON.stringify(response));
        // setIsLoading(false);
        // onSearchBarCancel()
        setLoading(false);
        if (searchBarRef.current) {
          searchBarRef.current.blur();
        }
        props.route.params.onFriendItemPress(item)
      },
    );
  };

  const onAddCurrentUser = (item, index) => {

    if (item.type == FriendshipConstants.FriendshipType.none) {
      const oldFilteredFriendships = filteredFriendships;
      // removeFriendshipAt(index);
      friendshipsTracker.current?.addFriendRequest(
        currentUser,
        item,
        (response) => {
          if (response?.error) {
            setFilteredFriendships(oldFilteredFriendships);
          }
        },
      );
    }
  }

  const removeFriendshipAt = async (index) => {
    const newFilteredFriendships = [...filteredFriendships];
    await newFilteredFriendships.splice(index, 1);
    setFilteredFriendships([...newFilteredFriendships]);
  };

  //   renderLoading = () => {
  //     if (this.state.isLoading) {
  //         return (
  //             <View style={CommonStyleSheet.loading}>
  //                 <ActivityIndicator size='large' color={colors.COLOR_BG} />
  //             </View>
  //         )
  //     }
  // }

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          onChangeText={onSearchTextChange}
          onSearchBarCancel={onSearchBarCancel}
          searchRef={searchBarRef}
          onSearchClear={onSearchClear}
          appStyles={appStyles}
        />
      </View>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={filteredFriendships.sort()}
        renderItem={renderItem}
        keyExtractor={(item) => item.user.id}
      />
      {loading &&

        <ProgressDialog
          background={header_background_color}
          visible={loading}
          title={"Loading..."}
        />

      }

      {/* <TNActivityIndicator appStyles={appStyles} */}
      {/* />} */}
    </View>
  );
}

export default IMUserSearchModal;
// export default connect(null, {
//   // setUserData,
// })(IMUserSearchModal);
