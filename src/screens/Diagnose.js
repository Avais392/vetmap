import React, {Component} from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import {Icon, Input} from 'react-native-elements';
import {Scene, Router, Actions} from 'react-native-router-flux';
import firebase from '../firebase';
import Header from '../components/Header';
import Button from '../components/Button';
import ImageInput from '../components/ImageInput';
import {COLORS} from '../util/colors';
import AsyncStorage from '@react-native-community/async-storage';
const {width, height} = Dimensions.get('window');
class DiagnoseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const userData = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({userData});
    console.log('userData', userData);
  }

  submit = async () => {
    await firebase
      .database()
      .ref(`patients`)
      .push({
        name: this.props.patientName,
        recordNo: this.props.medicalRecordNo,
        photos: [
          this.state.photo1 || null,
          this.state.photo2 || null,
          this.state.photo3 || null,
          this.state.photo4 || null,
          this.state.photo5 || null,
        ],
      });

    Actions.push('SavedPatients', {...this.props});
  };
  onChange = (value, property) => {
    this.setState({[property]: value});
  };
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <Header title={'Saved Patients'} containerStyle={Platform.OS==='ios'?{paddingTop:30,height:70}:null}/>
        <ScrollView>
          <SafeAreaView style={styles.container}>
            <View style={{flexDirection: 'row', marginVertical: 20}}>
              <Image
                source={require('../assets/blackvetmap.png')}
                style={{width: 200, height: 100}}
                resizeMode="contain"></Image>
              <Image
                source={require('../assets/UF.png')}
                style={{
                  width: 50,
                  height: 50,
                  alignSelf: 'flex-end',
                  marginBottom: -7,
                }}
                resizeMode="contain"></Image>
            </View>
            <Text
              style={{
                width:width*0.85,
                textAlign: 'center',
                fontSize: 20,
                backgroundColor: COLORS.blue,
                color: '#fff',
                paddingVertical: 10,
                paddingHorizontal: 5,
                borderRadius: 15,
              }}>
              Select a box and take a picture.{'\n'}Repeat for each box.
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: width * 0.9,
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text
                style={{fontSize: 20, textAlign: 'left', fontWeight: 'bold'}}>
                {this.props.patientName}
              </Text>
              <Text
                style={{fontSize: 20, textAlign: 'right', fontWeight: 'bold'}}>
                {this.props.medicalRecordNo}
              </Text>
            </View>
            <ImageInput
              user={{...this.props}}
              type="Photo"
              logo={true}
              label="0"
              callback={(photo1) => {
                this.setState({photo1});
                console.log('Digone ki callback', photo1);
              }}>
              <Image
                style={styles.profileImage}
                source={
                  this.state.photo1
                    ? {uri: this.state.photo1}
                    : require('../assets/imageplaceholder.png')
                }
              />
            </ImageInput>
            <View
              style={{
                flexDirection: 'row',
                //   flex: 1,
                width: width * 0.9,
                // marginHorizontal: 20,
                justifyContent: 'space-between',
              }}>
              <ImageInput
                user={{...this.props}}
                type="Photo"
                logo={true}
                label="1"
                callback={(photo2) => this.setState({photo2})}>
                <Image
                  style={styles.profileImage}
                  source={
                    this.state.photo2
                      ? {uri: this.state.photo2}
                      : require('../assets/imageplaceholder.png')
                  }
                />
              </ImageInput>
              <ImageInput
                user={{...this.props}}
                type="Photo"
                logo={true}
                label="2"
                callback={(photo3) => this.setState({photo3})}>
                <Image
                  style={styles.profileImage}
                  source={
                    this.state.photo3
                      ? {uri: this.state.photo3}
                      : require('../assets/imageplaceholder.png')
                  }
                />
              </ImageInput>
            </View>
            <View
              style={{
                flexDirection: 'row',
                //   flex: 1,
                width: width * 0.9,
                // marginHorizontal: 20,
                justifyContent: 'space-between',
              }}>
              <ImageInput
                user={{...this.props}}
                type="Photo"
                logo={true}
                label="3"
                callback={(photo4) => this.setState({photo4})}>
                <Image
                  style={styles.profileImage}
                  source={
                    this.state.photo4
                      ? {uri: this.state.photo4}
                      : require('../assets/imageplaceholder.png')
                  }
                />
              </ImageInput>
              <ImageInput
                user={{...this.props}}
                type="Photo"
                logo={true}
                label="4"
                callback={(photo5) => this.setState({photo5})}>
                <Image
                  style={styles.profileImage}
                  source={
                    this.state.photo5
                      ? {uri: this.state.photo5}
                      : require('../assets/imageplaceholder.png')
                  }
                />
              </ImageInput>
            </View>
            <View
              style={{
                flexDirection: 'row',
                //   flex: 1,
                width: width * 0.95,
                marginHorizontal: 20,
                justifyContent: 'space-between',
                marginBottom: 30,
              }}>
              <Button
                style={{...styles.button}}
                textStyle={{...styles.buttonText}}
                color={'#787878'}
                title={'BACK'}
                onPress={() => {Actions.pop()}}
              />
              <Button
                style={{...styles.button}}
                color={COLORS.green}
                loading={this.state.loading}
                textStyle={{...styles.buttonText, color: '#000'}}
                title={'SAVE BODY MAP'}
                onPress={() => this.submit()}
              />
            </View>
          </SafeAreaView>
        </ScrollView>
      </>
    );
  }
}

DiagnoseScreen.defaultProps = {};
DiagnoseScreen.navigationOptions = {
  title: '',
};

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    // height: height,

    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f84b25',
  },
  inputContainerStyle: {
    borderColor: '#555',
    // borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 0,
    marginHorizontal: 10,
    backgroundColor: '#f1f1f1',
    paddingLeft: 10,
  },
  button: {width: 150, borderRadius: 3},
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  profileImage: {
    backgroundColor: '#ddd',
    width: 150,
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
  },
});

export default DiagnoseScreen;
