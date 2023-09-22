import React from "react";
import { View } from 'react-native';
import { colors } from "../../../../utils/StyleComponents";

const ProgressIndicatorView = ({ sections = 5, style, progressbarColor = '#E5E5E5', earnedPoints = 0 }) => {
    const courseProgressIndicatorView = () => {
        let listViews = [];
        for (let index = 0; index < sections; index++) {
            listViews.push(<View key={index.toString()}
                style={{
                    height: 5,
                    flex: 1,
                    borderRadius: 50,
                    marginHorizontal: 1,
                    backgroundColor: (index < earnedPoints) ? colors.COLOR_THEME : progressbarColor
                }}>
            </View>)

        }
        return listViews;
    }
    return (
        <View style={style}>{courseProgressIndicatorView()}</View>
    )
}
export default ProgressIndicatorView;