import React, { useState } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    Animated,
} from 'react-native';
// import FastImage from 'react-native-fast-image'
import { colors, dimensionsProps } from '../../utils/StyleComponents';
import { SvgUri, SvgXml } from 'react-native-svg';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import LandingCloseButton from '../../assets/svg/landing_close_circle.svg';
import ImageZoom from 'react-native-image-pan-zoom';
import ImageViewer from 'react-native-image-zoom-viewer';
const CustomImageDialog = ({ visible, data, onControlDialogVisible }) => {
    const [reqImageHeight, setImageHeight] = useState(dimensionsProps.fullWidth * 0.5);
    const [requiredImageWidth, setImageWidth] = useState(null);
    let imageWidth = null;
    // let imageHeight = dimensionsProps.fullWidth * 0.8;
    if (data != null && data.length != 0) {
        if (data.content_feed_type == "Landing") {
            Image.getSize(data.landing_image, (width, height) => {
                const screenWidth = Dimensions.get('window').width;
                const scaleFactor = width / screenWidth;
                const imageHeightRq = height / scaleFactor;
                imageWidth = screenWidth;
                // imageHeight = imageHeightRq;
                setImageHeight(imageHeightRq);
                // setImageWidth(screenWidth);

            });

        } else {
            Image.getSize(data.notificationImage, (width, height) => {
                const screenWidth = Dimensions.get('window').width;
                const scaleFactor = width / screenWidth;
                const imageHeightRq = height / scaleFactor;
                imageWidth = screenWidth;
                // imageHeight = imageHeightRq;
                setImageHeight(imageHeightRq);
                // setImageWidth(screenWidth);


            });


        }
    }

    const feedTypeValidation = (data, imageWidth, reqImageHeight) => {
        if (data.content_feed_type == "Landing") {
            return <ImageViewer
                backgroundColor='transparent'
                imageUrls={[{
                    url: data.landing_image,
                    width: imageWidth,
                    height: reqImageHeight,
                }]}
                saveToLocalByLongPress={false}
                renderIndicator={(currentIndex, allSize) => { }}
                footerContainerStyle={{}}
            >

            </ImageViewer>

            // <Image   source={{ uri: data.landing_image, cache: "force-cache" }}
            //     resizeMode={'contain'}

            // >
            // </Image>

            // return <ImageZoom
            //     cropWidth={Dimensions.get('window').width}
            //     cropHeight={Dimensions.get('window').height}
            //     imageWidth={Dimensions.get('window').width}
            //     imageHeight={Dimensions.get('window').height}

            // >
            //     <Image style={{
            //         width: imageWidth,
            //         height: reqImageHeight,
            //         // borderRadius: 10,
            //     }}
            //         source={{ uri: data.landing_image }} resizeMode={'contain'} />

            // </ImageZoom >
        } else if (data.notificationImage) {
            // return <ImageZoom
            //     cropWidth={Dimensions.get('window').width}
            //     // cropHeight={reqImageHeight}
            //     imageWidth={Dimensions.get('window').width}
            //     // imageHeight={reqImageHeight}
            //     maxScale={0}
            //     minScale={0}
            // >
            //     <Image style={{
            //         width: imageWidth,
            //         height: reqImageHeight,
            //         // borderRadius: 10,
            //     }}
            //         source={{ uri: data.notificationImage }} resizeMode={'contain'} />

            // </ImageZoom >

            return <ImageViewer
                backgroundColor='transparent'
                imageUrls={[{
                    url: data.notificationImage,
                    width: imageWidth,
                    height: reqImageHeight,
                }]}
                saveToLocalByLongPress={false}
                renderIndicator={(currentIndex, allSize) => { }}
            >

            </ImageViewer>
            // <Image style={{
            //     borderRadius: 10,
            //     width: imageWidth,
            //     // aspectRatio: 135 / 76,
            //     overflow: 'hidden',
            //     height: reqImageHeight,
            //     // marginTop: -10.0
            // }}
            //     source={{ uri: data.notificationImage, cache: "force-cache" }}
            //     resizeMode={'contain'}
            // >
            // </Image>
        } else {
            return <></>
        }

    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType={"slide"}
            onRequestClose={() => { onControlDialogVisible }}>
            <View style={{
                flex: 1,
            }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: '#27272778',
                        justifyContent: "center",
                        paddingHorizontal: 5.0


                    }}>
                        <TouchableOpacity
                            style={{
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                                padding: 5,
                                marginHorizontal: 10.0,
                                marginTop: 20.0

                            }}
                            onPress={onControlDialogVisible}>
                            <SvgXml
                                height="30"
                                xml={LandingCloseButton}
                            />
                        </TouchableOpacity>

                        {feedTypeValidation(data, imageWidth, reqImageHeight)}

                    </View>
                </ScrollView>
            </View>
        </Modal >
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
export default CustomImageDialog;