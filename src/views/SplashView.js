
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ApplicationDataManager from '../utils/ApplicationDataManager';
export default class SplashView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            splashlogo: ApplicationDataManager.getInstance().getSplashLogo(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
        };
    }
    componentDidMount() {

        setTimeout(() => {
            if (ConstantValues.COMPANY_ID_STR == "37") {
                this.props.navigation.navigate('FlashLogin');
            } else {
                this.props.navigation.navigate('Login');
            }
        }, 1500);
    }
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: this.state.header_background_color != "" ?
                        this.state.header_background_color : colors.COLOR_THEME,

                }}>
                {this.state.splashlogo != "" &&
                    <Image style={styles.logoStyle}
                        source={
                            ConstantValues.COMPANY_ID_STR == "37" ?
                                { uri: this.state.splashlogo }
                                :
                                Constantimages.flash_head_logo_icon
                        }
                    />
                }
                {ConstantValues.COMPANY_ID_STR != "37" &&
                    <Image style={{
                        width: "100%",
                        height: 250,
                        resizeMode: 'cover'
                    }}
                        source={Constantimages.flash_sub_logo_icon}
                    />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logoStyle: {
        width: "100%",
        height: 150,
        resizeMode: 'contain',
    }
});
