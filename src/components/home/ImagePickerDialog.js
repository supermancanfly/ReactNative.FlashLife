import React from 'react';
import {
    View,
    Modal,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import Constantimages from '../../utils/ConstantImages';

const ImagePickerDialog = ({ isDialogVisible, onGallery, onCamera, onDialogDismiss }) => {
    return (
        <Modal visible={isDialogVisible}
            transparent={true}
            animationType={"slide"}
            onRequestClose={onDialogDismiss}>
            <View style={{
                backgroundColor: '#27272778',
                justifyContent: "center",
                alignItems: "center",
                flex: 1,

            }}>
                <View style={{
                    backgroundColor: "white",
                    padding: 15.0,
                    width: "90%",
                    // height: "22%",
                    marginHorizontal: 10.0,
                    borderRadius: 5.0
                }}>
                    <Text style={{
                        color: "black",
                        fontSize: 15.0,
                        fontFamily: "Radomir Tinkov - Gilroy-SemiBold"
                    }}>Select a Photo</Text>

                    <View style={{
                        marginVertical: 10.0
                    }}>
                        <TouchableOpacity style={{
                            paddingVertical: 10,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }} onPress={onCamera} >
                            <Image style={styles.icon_style}
                                source={Constantimages.camera_icon} />
                            <Text style={{ paddingLeft: 5, fontFamily: "Radomir Tinkov - Gilroy-Medium" }}>Take a Photo</Text>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }} onPress={onGallery}>
                        <Image style={styles.icon_style}
                            source={Constantimages.gallory_icon} />
                        <Text style={{
                            paddingLeft: 5,
                            fontFamily: "Radomir Tinkov - Gilroy-Medium"
                        }}>Add From Gallery</Text>
                    </TouchableOpacity>
                    <View style={{
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                    }}>
                        <TouchableOpacity onPress={onDialogDismiss}>
                            <Text style={{
                                fontSize: 15.0,
                                fontFamily: "Radomir Tinkov - Gilroy-Medium",
                                color: "black"
                            }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


        </Modal>
    );
}
export default ImagePickerDialog;
const styles = StyleSheet.create({
    icon_style: {
        width: 25, height: 25, marginLeft: 5
    },
})