import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  PermissionsAndroid
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import LoyaltyCardDetails from './LoyaltyCardDetails';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import AddLoyaltyCard from '../views/AddLoyaltyCard';
import EditLoyaltyCardView from '../views/EditLoyaltyCardView';
import {
  ApiGetGetLoyaltyCards,
} from '../network/Services';
import { apiErrorHandler } from '../utils/CommonMethods';
export default class LoyaltyCardsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
      action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
      header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
      header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
      isLoading: false,
      loyaltyData: [],
      userData: this.props.userData,
      isFormsView: true,
      isFormsQuestionView: false,
      formDetails: [],
      isaddloyaltycard: false,
      iseditloyaltycard: false,
      loyaltycardname: "",
      loyaltycardfrontphoto: null,
      loyaltycardbackphoto: null,
      loyaltycardfrontphotoBlob: null,
      loyaltycardbackphotoBlob: null,

    }
    this.onBackFormQuestion = this.onBackFormQuestion.bind(this);
  } navigateToMore = () => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    this.props.callBackForMoreTabInLoyaltyCardView(ConstantValues.MORE_STR);
  }

  componentDidMount() {

    this.getLoyaltyCards()
  }

  componentWillUnmount() {
  }
  getLoyaltyCards() {
    const { userData, } = this.state;
    this.setState({
      isLoading: true,
      locationData: []
    })
    let params = "?user_id=" + userData[0].id
    ApiGetGetLoyaltyCards(userData[0].token, params).then(response => {
      this.setState({ isLoading: false, });
      let data = [];
      if (response.length > 0) {
        for (let i = 0; i < response.length; i++) {
          data.push({
            loyalty_card_id: response[i].loyalty_card_id,
            company_id: response[i].company_id,
            loyalty_card_name: response[i].loyalty_card_name,
            loyalty_card_back_image: response[i].loyalty_card_back_image,
            loyalty_card_front_image: response[i].loyalty_card_front_image,
          })
        }
        data.sort((a, b) => {
          return a.form_name > b.form_name;
        });
        this.setState({
          loyaltyData: data,
        });
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      // console.log(error);
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
    this.setState({
      formDetails: item, isFormsView: false,
      iseditloyaltycard: false, isaddloyaltycard: false, isFormsQuestionView: true
    })
  }
  onAddLoyaltyCardVisible = () => {
    this.setState({
      isFormsView: false, isFormsQuestionView: false,
      iseditloyaltycard: false, isaddloyaltycard: true
    })
  }
  renderRowCardDetails() {
    return <LoyaltyCardDetails
      userData={this.props.userData}
      formDetails={this.state.formDetails}
      onBackFormQuestion={this.onBackFormQuestion}
      navigation={this.props.navigation}
      callBackForMoreTabInLoyaltyCardDetails={this.props.callBackForMoreTabInLoyaltyCardView}
    />
  }
  async onBackFormQuestion() {
    await this.setState({
      isFormsQuestionView: false,
      isaddloyaltycard: false, loyaltyData: [], isFormsView: true
    })
    this.getLoyaltyCards()
  }
  renderRowAddLoyaltyCard() {
    return <AddLoyaltyCard
      userData={this.props.userData}
      formDetails={this.state.formDetails}
      onBackFormQuestion={this.onBackFormQuestion}
      navigation={this.props.navigation}
      callBackForMoreTabInAddLoyaltyCard={this.props.callBackForMoreTabInLoyaltyCardView}
    />
  }
  renderRowEditLoyaltyCard() {
    return <EditLoyaltyCardView
      userData={this.props.userData}
      formDetails={this.state.formDetails}
      onBackFormQuestion={this.onBackFormQuestion}
      navigation={this.props.navigation}
      callBackForMoreTabInEditLoyaltyCardDetails={this.props.callBackForMoreTabInLoyaltyCardView}
    />
  }
  renderRowFormView() {
    return <View style={{
      flex: 1,
    }}>
      <View style={{
        flexDirection: 'row',
        backgroundColor: this.state.header_background_color != "" ?
          this.state.header_background_color : colors.COLOR_THEME,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            paddingHorizontal: 5
          }}
          onPress={this.props.onBackForms}
        >
          <Image source={this.props.title == "loyaltytab" ? null : Constantimages.back_icon}
            style={{
              width: 25,
              height: 25,
              tintColor: colors.COLOR_WHITE
            }}
          >
          </Image>
        </TouchableOpacity>
        <View style={{
          flex: 1,
          justifyContent: 'center', alignItems: 'center'
        }}>
          <Text style={{
            fontSize: fontsProps.lg, fontWeight: 'bold',
            textAlign: 'center',
            color: this.state.header_text_color != "" ?
              this.state.header_text_color : colors.COLOR_WHITE,
          }}>{ConstantValues.LOYALTYCARDS_STR}</Text>
        </View>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            paddingHorizontal: 5
          }}
          onPress={() => {
            this.onAddLoyaltyCardVisible(this,)
          }}
        >
          <Image source={Constantimages.add_icon}
            style={{
              width: 25,
              height: 25,
              tintColor: colors.COLOR_WHITE
            }}
          >
          </Image>
        </TouchableOpacity>
      </View>
      <FlatList
        data={this.state.loyaltyData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.loyalty_card_id.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() =>
              this.onFormQuestion(item)
            }
              key={index}
              style={{
                paddingVertical: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                alignItems: 'center',
                backgroundColor: colors.COLOR_WHITE,
                elevation: 3,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                margin: 3
              }}
            >
              <Text style={{ fontSize: 16, color: '#616161' }}>{item.loyalty_card_name}</Text>
              <View style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
              >
                <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, fontWeight: 'bold', paddingHorizontal: 5, textAlign: 'center' }}>{item.number_of_questions}</Text>
                <Image source={Constantimages.arrow_right_icon}
                  style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: '#aeaeae' }} />
              </View>
            </TouchableOpacity>
          )
        }}
      >
      </FlatList>
      {this.renderProgressDialogLoader()}
    </View>
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.isFormsView &&
          this.renderRowFormView()
        }
        {this.state.isaddloyaltycard &&
          this.renderRowAddLoyaltyCard()
        }
        {this.state.iseditloyaltycard &&
          this.renderRowEditLoyaltyCard()
        }
        {this.state.isFormsQuestionView &&
          this.renderRowCardDetails()
        }
      </View>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 70,
  },
})