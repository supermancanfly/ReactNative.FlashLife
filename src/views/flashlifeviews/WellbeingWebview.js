import React from 'react';
import imageURL from "../../assets/images/well-being.jpg"
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile';
import Constantimages from '../../utils/ConstantImages';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors } from '../../utils/StyleComponents';


export default class WellbeingWebview extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            showOriginalImage: true // State to control the visibility of the original image
        }
    }

    handleImageClick = () => {
        this.setState({ modalVisible: true, showOriginalImage: false });
    }

    handleModalClose = () => {
        this.setState({ modalVisible: false, showOriginalImage: true });
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* ... other components, HeaderBackTitleProfile, etc. */}
                <HeaderBackTitleProfile
                    title={"Show"}
                    backcolor={"colors.GREY_COLOR"}
                    headerstyle={{
                        flexDirection: 'row',
                        backgroundColor: colors.COLOR_THEME,
                        paddingVertical: 8,
                        paddingHorizontal: 10
                    }}
                    headerlogo={this.props.title == "fraudtypetab" ? null : Constantimages.flash_back_icon}
                    profilename={ConstantValues.FLASH_WELNESS_SEC_STR}
                    buttonPress={this.props.onBackForms}
                    source={this.props.title == "fraudtypetab" ? null : Constantimages.back_icon}
                />
                <View style={styles.container}>
                    <View>
                        {this.state.showOriginalImage && (
                            <TouchableOpacity onPress={this.handleImageClick} style={{height: 400 }}>
                                <Image
                                    source={imageURL}
                                    style={{ width: 350, height: 350, }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={this.handleModalClose}
                    >
                        <View style={styles.centeredView}>

                            <ScrollView
                                contentContainerStyle={styles.modalView}
                                maximumZoomScale={3}
                                minimumZoomScale={1}
                            >
                                <Image
                                    source={imageURL}
                                    style={styles.modalImage}
                                    resizeMode="contain"
                                />
                            </ScrollView>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={this.handleModalClose}
                            >
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
        borderRadius: 5,
        margin: 15
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 70,
        backgroundColor: 'white',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        zIndex: 9999,
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
    },
    modalView: {
        flex: 1, // Take up full screen space
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: Dimensions.get('window').width, // Full width of the device
        height: Dimensions.get('window').height - 60, // Subtracting some height to avoid overlapping with the close button
    },
});
