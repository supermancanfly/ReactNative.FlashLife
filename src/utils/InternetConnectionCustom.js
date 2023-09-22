import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
export default class InternetConnectionCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: true
        };
    }
    componentDidMount() {
        // NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        NetInfo.addEventListener(this.handleConnectivityChange);
    }
    componentWillUnmount() {
        // NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange)
        // NetInfo.(this.handleConnectivityChange);
    }
    handleConnectivityChange = isConnected => {
        this.setState({ isConnected:isConnected.isConnected });
    };
    // handleConnectivityChange = state => {
    //     if (state.isConnected) {
    //       Alert.alert('online');
    //       this.setState({connection_Status: 'Online'});
    //     } else {
    //       Alert.alert('offline');
    //       this.setState({connection_Status: 'Offline'});
    //     }
    //   };
    render() {
        if (!this.state.isConnected) {
            return <View style={styles.offlineContainer}>
               <Text style={{fontWeight:'bold',fontSize:16}}>
  No Internet Connection
</Text>
<Text style={{paddingTop:10,fontSize:14}}>
   Please check your internet connection and try again
</Text>
            </View>
} else {
            return <View />
        }
    }
}
const styles = StyleSheet.create({
    offlineContainer: {
        flex:1,alignItems:'center',justifyContent:'center'
    },
    offlineText: {
        color: '#FFFFFF'
    }
});
