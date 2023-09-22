import React from "react";
import { ActivityIndicator, Modal, PixelRatio, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
// import VideoPlayer from "react-native-video-player";
import { colors, dimensionsProps } from "../../utils/StyleComponents";

const VideoContentFeedDialog = ({ visible, itemIndexData, onControlDialogVisible, onVideoStart, onVideoLoad, opacity }) => (
    <Modal visible={visible}
        transparent={true}
        onRequestClose={() => {
            // console.log('Modal has been closed.');
        }}>

        <TouchableWithoutFeedback
        // onPress={onControlDialogVisible}
        >
            <View transparent={true}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',

                }}>
                <View style={{
                    width: dimensionsProps.fullWidth - 20,
                    height: dimensionsProps.fullHeight / 2.8,
                    backgroundColor: colors.COLOR_WHITE,
                    borderRadius: 5,
                    overflow: 'hidden',
                    padding: 5

                }}>


                    <TouchableOpacity
                        onPress={onControlDialogVisible}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.COLOR_BLACK,
                            borderRadius: 5,
                            elevation: 5,
                            height: 30,
                            alignSelf: 'flex-end',
                            width: 50

                        }}>

                        <View >
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: colors.COLOR_WHITE,
                                    textAlign: 'center',

                                }}>
                                Close
                            </Text>
                        </View>

                    </TouchableOpacity>

                    <View style={{
                        flex: 1,
                        // backgroundColor: 'black',
                        marginTop: 10,
                        height: 0

                    }}>
                        {/* <VideoPlayer video={{ uri: itemIndexData.video_url }} autoplay={true} defaultMuted={true} videoWidth={dimensionsProps.fullWidth - 60}
                            videoHeight={dimensionsProps.fullHeight / 4} resizeMode="contain"
                            showDuration={true}
                            pauseOnPress={true}

                            // onPlayPress={() => onVideoStart("")}
                            onLoadStart={(data) => {

                                onVideoStart(data);

                            }}
                            onLoad={(data) => {

                                onVideoLoad(data);

                            }}
                            onBuffer={(isBuffering) => {


                            }}
                        /> */}

                        <ActivityIndicator
                            animating
                            size='large'
                            color={colors.COLOR_THEME}
                            style={[{
                                position: 'absolute',
                                top: 70,
                                left: 70,
                                right: 70,
                                height: 50,
                            }, { opacity: opacity }]}
                        />
                    </View>
                </View>
            </View>



        </TouchableWithoutFeedback>
    </Modal>
);

export default VideoContentFeedDialog;