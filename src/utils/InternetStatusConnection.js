import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
export default class InternetStatusConnection extends Component {
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
                <Text style={styles.offlineText}>No Internet Connection</Text>
            </View>
        } else {
            return <View />
        }
    }
}
const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0
    },
    offlineText: {
        color: '#FFFFFF'
    }
});
