import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { colors } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import DropDownFloatingList from '../../utils/DropDownFloatingList';
import ImageShareCardType from '../home/ImageShareCardType';
import ImageTapViewCardType from '../home/ImageTapViewCardType';
import RowTwoCardType from '../home/RowTwoCardType';
import ThreeRowCardType from '../home/ThreeRowCardType';
import ThreeRowImageCardType from '../home/ThreeRowImageCardType';
import BirthDayCardType from '../home/BirthDayCardType';
import ThreeRowFullImageCardType from '../home/ThreeRowFullImageCardType';
import RowOneCardType from '../home/RowOneCardType';
import { SvgXml } from 'react-native-svg';

export default function CareersCard({ item, index, cardstyle, header_background_color, onPress,
    landingData, setToolTipVisible, onOpenMailApp, onUpdateFeedContent, onFileDownload, onOpenWebViewLink,
    onOpenToolTipInfo, onPressSeeMore,
    showmoreList,
    onPressProfile,
    onLikeContentFeed,
    onGifFeedView,
    onHuntIconPress,
    closeCustomImgeView,
    onPressCloseCustomDialog,
    onOpenActionView

}) {
    if (item.card_type == 1) {
        //1 Row
        return (
            <RowOneCardType
                item={item}
                index={index}
                cardstyle={
                    cardstyle
                }
                onPress={onPress}
                setToolTipVisible={setToolTipVisible}
                onUpdateFeedContent={onUpdateFeedContent}
            // cardInteraction={item.card_interaction == "content_feed_action"?"TouchableOpacity":"View"}
            />
        );
    }
    else if (item.card_type == 2) {
        //2 Row
        return (
            <RowTwoCardType
                item={item}
                index={index}
                cardstyle={
                    cardstyle
                }
                onPress={onPress}
                setToolTipVisible={setToolTipVisible}
                onUpdateFeedContent={onUpdateFeedContent}
                onOpenMailApp={onOpenMailApp}
                onOpenToolTipInfo={onOpenToolTipInfo}
                landingData={landingData}
            // CardInteraction={item.card_interaction == "content_feed_action"?"TouchableOpacity":"View"}
            />
        );
    }
    else if (item.card_type == 3) {
        //2 Row
        return (
            <ImageShareCardType
                item={item}
                cardstyle={{
                    flex: 1,
                    padding: 18,
                    flexDirection: 'row',
                    // marginRight: 5,
                    // marginTop: index == 0 ? 0 : 10,
                }}
                onPress={onPress}
                setToolTipVisible={setToolTipVisible}
                onOpenMailApp={onOpenMailApp}
                onOpenWebViewLink={onOpenWebViewLink}
            />
        );
    }
    else if (item.card_type == 4) {
        //2 Row
        return (
            <ImageTapViewCardType
                item={item}
                index={index}
                cardstyle={{
                    flex: 1,
                    // backgroundColor: colors.COLOR_WHITE,
                    // borderRadius: 12,
                    padding: 18,
                    flexDirection: 'row',
                    // marginRight: 5,
                    // marginTop: index == 0 ? 0 : 10,
                }}
                onPress={onOpenActionView}//{onPress}
                setToolTipVisible={setToolTipVisible}
                onOpenMailApp={onOpenMailApp}
            />
        );
    }

    else if (item.card_type == 5) {
        //3 Row
        return (
            <ThreeRowCardType
                item={item}
                index={index}
                cardstyle={cardstyle}
                onPress={onPress}
                setToolTipVisible={setToolTipVisible}
                onUpdateFeedContent={onUpdateFeedContent}
                onFileDownload={onFileDownload}
                onOpenMailApp={onOpenMailApp}
            />
        );
    }
    else if (item.card_type == 6) {
        //3 Row Image
        return (
            <ThreeRowImageCardType
                item={item}
                cardstyle={cardstyle}
                onPress={onPress}
                setToolTipVisible={setToolTipVisible}
                onFileDownload={onFileDownload}
                onLikeContentFeed={onLikeContentFeed}
                onGifFeedView={onGifFeedView}
                onHuntIconPress={onHuntIconPress}
                onPressCloseCustomDialog={onPressCloseCustomDialog}
                closeCustomImgeView={closeCustomImgeView}
                onOpenActionView={onOpenActionView}
            />
        )
    }

    else if (item.card_type == 8) {
        //3 Row_Full Image
        return (
            <ThreeRowFullImageCardType
                item={item}
                index={index}
                cardstyle={{
                    height: 150,
                    // height: 104,
                    // opacity:1,
                    // backgroundColor:'#000',

                    width: null,
                    resizeMode: 'cover',
                    padding: 18,
                    // marginRight: 5,
                    borderRadius: 12,
                    overflow: 'hidden',
                    marginTop: index == 0 ? 0 : 10,
                }}
                header_background_color={header_background_color}
                onPress={onPress}
                setToolTipVisible={setToolTipVisible}
            />
        )
    }

    else if (item.card_type == 9) {
        //Birthday Card
        return (
            <BirthDayCardType
                item={item}
                index={index}
                cardstyle={cardstyle}
                header_background_color={header_background_color}
                onPress={onPress}
                onPressSeeMore={onPressSeeMore}
                showmoreList={showmoreList}
                onPressProfile={onPressProfile}
            />

        )
    }




    else {
        return (
            <View style={{
                flex: 1,
                backgroundColor: colors.COLOR_WHITE,
                borderRadius: 12,
                marginTop: index == 0 ? 0 : 10,
            }}>
                <View style={cardstyle}>
                    <View style={{
                        justifyContent: 'center',
                        flex: 1
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>

                            {/* <Image
                                source={item.icon}
                                style={{
                                    resizeMode: 'contain',
                                    width: 20,
                                    tintColor: item.color,
                                    height: 20

                                }}
                            >
                            </Image> */}
                            <SvgXml width="20"
                                height="20"
                                xml={item.icon} />
                            <Text style={{
                                paddingLeft: 6, color: item.color,
                                fontWeight: '700'
                            }}>{item.headertitle}</Text>

                        </View>
                        <Text style={{
                            flex: 1, fontWeight: 'bold', flexWrap: 'wrap',
                            fontSize: 16, paddingTop: 8
                        }}>
                            {item.title}
                        </Text>
                    </View>
                    {item.day == "" ?

                        <View style={{

                        }}>
                            <ImageBackground
                                source={Constantimages.elipse_icon}
                                style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 30 / 2,
                                    resizeMode: 'contain',
                                    alignSelf: 'flex-end',
                                    justifyContent: 'center',
                                    tintColor: colors.GREY_COLOR

                                }}
                            >
                                <Image
                                    source={Constantimages.close_icon}
                                    style={{
                                        height: 30 / 2,
                                        resizeMode: 'contain',
                                        alignSelf: 'center',
                                        tintColor: colors.GREY_COLOR

                                    }}
                                >
                                </Image>
                            </ImageBackground>

                        </View>

                        :

                        <View style={{
                            flex: 1,
                            // backgroundColor:'red',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                        }}>
                            {item.headertitle == "Information" && item.day != "" ?
                                <Image
                                    source={Constantimages.arrow_right_icon}
                                    style={{
                                        height: 20,
                                        alignSelf: 'flex-end',
                                        resizeMode: 'contain',
                                        tintColor: colors.COLOR_BLACK
                                    }}
                                >

                                </Image>
                                :


                                <View
                                    // source={item.day != "" ? item.notificationImage : null}
                                    style={{
                                        height: 90,
                                        width: 100,
                                        borderRadius: 8,
                                        backgroundColor: item.color,

                                        alignSelf: 'flex-end'

                                    }}
                                >

                                </View>

                            }
                        </View>
                    }
                </View>
                <View style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: "#E3E3E3"
                }}>

                </View>
                {/* {item.headertitle == "BI" ? */}
                {item.action_type_id == "8" &&
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{
                            paddingVertical: 22, color: "#0097F7",
                            fontSize: 16, fontWeight: 'bold'
                        }}>Tap to view</Text>
                    </TouchableOpacity>
                }

                {item.action_type_id == "7" &&
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{
                                paddingVertical: 22, color: "#0097F7",
                                fontSize: 16, fontWeight: 'bold'
                            }}>Apply</Text>
                        </TouchableOpacity>
                        <View style={{
                            width: 1,
                            backgroundColor: "#E3E3E3",
                        }}>

                        </View>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <Text style={{
                                paddingVertical: 22, color: "#0097F7",
                                fontSize: 16, fontWeight: 'bold'
                            }}>Share</Text>
                        </TouchableOpacity>
                    </View>

                }
            </View>

        )
    }
}

const styles = StyleSheet.create({

});
