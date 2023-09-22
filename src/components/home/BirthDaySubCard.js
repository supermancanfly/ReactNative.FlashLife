import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    FlatList
} from 'react-native';
import Moment from 'moment';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../../utils/StyleComponents';
import { ConstantValues } from '../../utils/ConstantValues';
import Constantimages from '../../utils/ConstantImages';
import DropdownButton from '../../utils/DropdownButton';
import DropDownFloatingList from '../../utils/DropDownFloatingList';
export default function BirthDaySubCard({ cardstyle, header_background_color,list,onPressHeader,headervisible }) {

    return (
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
                    <Image
                        source={Constantimages.user_survey_icon}
                        style={{
                            resizeMode: 'contain',
                            width: 20,
                            height: 20
                        }}
                    >
                    </Image>
                    <Text style={{
                        paddingLeft: 6, color: "#8BD41F",
                        fontSize: 12,
                        lineHeight: 18,
                        fontWeight: '700'
                    }}>
                        Survey</Text>
                </View>
                <Text style={{
                    flex: 1, fontWeight: 'bold', flexWrap: 'wrap',
                    fontSize: 16, lineHeight: 20, paddingTop: 8
                }}>What days are best to run Info Sessions?----</Text>
                <FlatList 
                    data={list}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    style={{
                        backgroundColor: colors.COLOR_WHITE,  
                    }}
                    ListHeaderComponent={
                        headervisible?
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderWidth: 1,
                        backgroundColor: colors.COLOR_WHITE,
                        borderColor: "#E3E3E3",
                        borderRadius: 5,
                        paddingHorizontal: 16,
                        marginTop:10
                    }}
                    onPress={() => { console.log("onpress")}}
                    >
                        <DropDownFloatingList
                            title={"Show"}
                            backcolor={"colors.GREY_COLOR"}
                            headerstyle={{
                                flexDirection: 'row',
                                backgroundColor: header_background_color != "" ? header_background_color
                                    : colors.COLOR_THEME,
                            }}
                            headerlogo={Constantimages.flash_header_logo}
                            profilename={"Select an option"}
                            selectedsupporttypevalue={"Select an option"}
                        />
                        <Image source={Constantimages.flash_dropdown_icon} style={{
                            height: 17,
                            width: 17,
                            resizeMode: 'contain',
                            alignItems: 'center',
                            tintColor: colors.COLOR_BLACK
                        }} />
                    </TouchableOpacity>
                :
                null    
                }
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => { }
                                    
                                }
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    // justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    backgroundColor: colors.COLOR_WHITE,
                                    borderColor: "#E3E3E3",
                                    paddingVertical:17,
                                    // borderRadius: 5,
                                    paddingHorizontal: 16,

                                    // marginVertical:10
                                }}
                            >
                 
                    
                    {item.isActive ?
                    <TouchableOpacity onPress={console.log("isactive")}>
                       <Image source={Constantimages.checkedcircle_icon} style={{
                        height: 17,
                        width: 17,
                        resizeMode: 'contain',
                        alignItems: 'center',
                        tintColor: colors.COLOR_BLACK
                    }} >
                         <Image source={Constantimages.checked_tick_icon} style={{
                        height: 17/2,
                        width: 17/2,
                        resizeMode: 'contain',
                        alignItems: 'center',
                        tintColor: colors.COLOR_BLACK
                    }} >
                        </Image>
                        </Image>
                        </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={console.log("active")}>
                    <Image source={Constantimages.uncheckedcircle_icon} style={{
                        height: 17,
                        width: 17,
                        resizeMode: 'contain',
                        alignItems: 'center',
                        paddingLeft:11,
                        tintColor: colors.COLOR_BLACK
                    }} />
                    </TouchableOpacity>

                }
                    <Text>{item.date}</Text>
                            </TouchableOpacity>
                        );
                    }}
               
                >
                </FlatList>
                {/* <TouchableOpacity style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderWidth: 1,
                    backgroundColor: colors.COLOR_WHITE,
                    borderColor: "#E3E3E3",
                    marginBottom: 9,
                    borderRadius: 5,
                    paddingHorizontal: 16,
                    marginVertical:10
                }}
                >
                    <DropDownFloatingList
                        title={"Show"}
                        backcolor={"colors.GREY_COLOR"}
                        headerstyle={{
                            flexDirection: 'row',
                            backgroundColor: header_background_color != "" ? header_background_color
                                : colors.COLOR_THEME,
                        }}
                        headerlogo={Constantimages.flash_header_logo}
                        profilename={"Select an option"}
                        selectedsupporttypevalue={"Select an option"}
                    />
                    <Image source={Constantimages.flash_dropdown_icon} style={{
                        height: 17,
                        width: 17,
                        resizeMode: 'contain',
                        alignItems: 'center',
                        tintColor: colors.COLOR_BLACK
                    }} />
                </TouchableOpacity> */}
            </View>
            
        </View>

    )
}
// QuickSurvey
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: colors.COLOR_LIGHT_GRAY,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
