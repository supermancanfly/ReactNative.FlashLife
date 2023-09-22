import React from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { colors } from "../../../../utils/StyleComponents";
import Group_green from '../../../../assets/svg/Group_green.svg';
import Group_black from '../../../../assets/svg/Group_black.svg';
import CheckCircleGreen from '../../../../assets/svg/check_circle_green.svg';
import CheckCircleFill from '../../../../assets/svg/check_circle_fill.svg';


const QuizMultipleChoicePopup = props => {
    const { isModalVisible,choiceList,onItemPress } = props;

    return <Modal transparent={true}
        animationType="slide"
        visible={isModalVisible}>
        <View style={{
            backgroundColor: '#00000099',
            justifyContent: 'center',
            flex: 1
        }}>
            <View style={{
                backgroundColor: colors.COLOR_WHITE,
                borderRadius: 10,
                padding: 10,
                marginHorizontal: "7%"
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 15,
                        marginTop: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Please select an option</Text>
                    <SvgXml xml={Group_black} height={20} width={20} />
                </View>

                <View>{choiceList.map((item, index) => {
                    return <View key={index.toString()} style={{ marginTop: 10 }}>
                        {index != 0 && <View style={{
                            backgroundColor: '#707070',
                            height: 0.7,
                            marginVertical: 5
                        }} />}
                        <TouchableOpacity onPress={() => {
                            onItemPress(item,index)
                            
                            // setDropdownValue(item.title);
                            // setVisible(!isModalVisible);

                        }}>
                            <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <SvgXml xml={(item.isChecked ? CheckCircleFill : CheckCircleGreen)} height={20} width={20} />
                                <Text style={{
                                    fontSize: 14,
                                    marginHorizontal: 10,
                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                }}>{item.choice}</Text>

                            </View>
                        </TouchableOpacity>
                    </View>
                })}</View>
            </View>
        </View>

    </Modal>

}

export default QuizMultipleChoicePopup;