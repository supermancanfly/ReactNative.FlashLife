import React from 'react';
import {
    View,
    Text,
    Image,
    Modal,
    Animated,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import orderSubmittedIcon from '../../assets/svg/order_submitted.svg';

const LunchOrderSuccessPopup = ({ isShowModal, lunchItems }) => {
    let bottomText = "Order successfully submitted";
    // console.log("LUNCH ITESM", JSON.stringify(lunchItems));
    if (lunchItems.length > 0) {
        for (let index = 0; index < lunchItems.length; index++) {
            const element = lunchItems[index];
            if (element.orderid) {
                // console.log("llklk");
                bottomText = "Order successfully updated";
                break;
            }

        }
    }
    return (
        <Animated.View style={{
            flex: 1,
            transform: [
                { scale: 2 },
            ],
        }}>
            <Modal visible={isShowModal}
                transparent={true}
                animationType={"slide"}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: "transparent",//'#27272778',
                    justifyContent: "flex-end",
                    alignItems: "center",//"flex-end",
                    paddingHorizontal: 5.0,
                    marginBottom: 100.0,
                    marginHorizontal: 10.0
                }}>

                    <View style={{
                        backgroundColor: "#CCF3E9",
                        borderColor: "#00C193",
                        borderWidth: 1.0,
                        borderRadius: 10.0,
                        padding: 10.0,
                        flexDirection: "row",
                        height: 50.0,
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "100%",

                    }}>
                        <SvgXml xml={orderSubmittedIcon} height={20} width={20} />
                        <Text style={{
                            fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                            color: "black",
                            fontSize: 15,
                            fontWeight: "700",
                            marginHorizontal: 5
                        }}>{bottomText}</Text>
                    </View>
                </View>

            </Modal>
        </Animated.View>



    );
};
export default LunchOrderSuccessPopup;