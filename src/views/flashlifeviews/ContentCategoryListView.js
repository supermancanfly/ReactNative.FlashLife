import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Platform,
    SafeAreaView
} from 'react-native';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, fontsProps } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import { apiErrorHandler, onResetActions } from '../../utils/CommonMethods';
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile';
import ContentLibraryView from '../flashlifeviews/ContentLibraryView';
import FormsListItem from '../../components/forms/FormsListItem';
import {
    ApiGetContentLibraryCategories
} from '../../network/Services';
// console.log("ContentCategoryListView");
export default class ContentCategoryListView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            employeenumber: "",
            isLoading: false,
            categoryList: [],
            userData: this.props.userData,
            isCategoryView: true,
            isFormsQuestionView: false,
            formDetails: []

        }
        this.onBackFormQuestion = this.onBackFormQuestion.bind(this);
    }
    navigateToMore = () => {
        console.log(",njdshfghjsdgfyd");
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInContentCategoryListView(ConstantValues.MORE_STR);
    }
    handleEmployeeNumberChange = (newText) => this.setState({ employeenumber: newText })
    componentDidMount() {
        this.getCategoryList();
    }

    getCategoryList() {
        const { userData } = this.state;
        this.setState({
            isLoading: true,

        })

        let params = "?company_id=" + userData[0].employee_company_id;
        // + "&user_id=" + userData[0].id
        ApiGetContentLibraryCategories(userData[0].token, params).then(response => {
            this.setState({ isLoading: false });
            if (response.length > 0) {
                this.setState({
                    categoryList: response,
                });
            }
            else {
                onResetActions(this.props)
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            console.log("kdfjlshfksdfgzsdf");

            //Hello, I fixed api error handler
        })
    }
    renderProgressDialogLoader() {
        if (this.state.isLoading) {
            return (
                <ProgressDialog
                    visible={this.state.isLoading}
                    title={ConstantValues.LOADING_STR}
                    background={this.state.header_background_color}
                />
            )
        }
    }
    onFormQuestion = (item) => {
        this.setState({ formDetails: item, isCategoryView: false, isFormsQuestionView: true })
    }
    renderRowFormQuestionView() {
        return <ContentLibraryView
            userData={this.props.userData}
            onBackForms={this.onBackFormQuestion}
            formDetails={this.state.formDetails}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInContentLibrary={this.props.callBackForMoreTabInContentCategoryListView}
        />
    }
    async onBackFormQuestion() {
        // console.log("onBackFormQuestion");
        await this.setState({ isFormsQuestionView: false, isCategoryView: true })
    }
    renderRowCategoryView() {
        return <View style={{
            flex: 1,
        }}>

            <HeaderBackTitleProfile
                title={"Show"}
                backcolor={"colors.GREY_COLOR"}
                headerstyle={{
                    flexDirection: 'row',
                    backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                        : colors.COLOR_THEME,
                    paddingVertical: 8,
                    paddingHorizontal: 10
                }}
                headerlogo={this.props.title == "fraudtypetab" ? null : Constantimages.flash_back_icon}
                profilename={ConstantValues.CONTENT_LIBRARY_STR}
                buttonPress={this.props.onBackForms}
                source={this.props.title == "fraudtypetab" ? null : Constantimages.back_icon}
            />

            <FlatList
                data={this.state.categoryList}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.category_id.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <FormsListItem
                            item={item}
                            index={index}
                            onPressItem={() => this.onFormQuestion(item)}
                            header_background_color={
                                this.state.header_background_color != "" ? this.state.header_background_color
                                    : colors.COLOR_THEME}
                            itemname={item.category_name}
                            numofitems={item.number_of_files}
                        />
                    )

                }}
            >
            </FlatList>
            {this.renderProgressDialogLoader()}
        </View>
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                    // marginBottom: 70,
                    marginBottom: Platform.OS === 'ios' ? 0 : 70,

                }}>
                    {this.state.isCategoryView &&
                        this.renderRowCategoryView()
                    }
                    {this.state.isFormsQuestionView &&
                        this.renderRowFormQuestionView()
                    }
                </View>
            </SafeAreaView>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 10
    },

})