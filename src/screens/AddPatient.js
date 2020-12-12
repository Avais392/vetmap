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
import Snack from '../components/Snackbar';
import Header from '../components/Header';
import Button from '../components/Button';
import { COLORS } from '../util/colors';
// import Input from '../components/Input'
const {width, height} = Dimensions.get('window');
class AddPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  onChange = (value, property) => {
    this.setState({[property]: value});
  };
  onNext = () => {
    const {patientName, medicalRecordNo} = this.state;
    if (patientName && medicalRecordNo) {
      Actions.push('Diagnose', {patientName, medicalRecordNo});
    } else {
      Snack('error', 'Please enter valid details');
      return false;
    }
  };
  render() {
    return (
      <>
        {/* <StatusBar barStyle="dark-content" /> */}
        {/* <Header title={'Sign In'} /> */}
        {/* <ScrollView contentContainerStyle={{flex:1}}> */}
        <View style={{flex: 1, width: width}}>
          <View style={{flex: 1, width: width, height: height,justifyContent:'space-between',...styles.container}}>
            <View style={[{flexDirection: 'row', marginVertical: 40,},Platform.OS==='ios'?{marginTop:50}:null]}>
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
            <Input
              placeholder={'Patient Name'}
              onChangeText={(text) => this.onChange(text, 'patientName')}
              value={this.state.patientName}
              inputStyle={{color: '#555'}}
              placeholderTextColor={'#888'}
              inputContainerStyle={{
                ...styles.inputContainerStyle,
              }}
            />
            <Input
              placeholder={'Medical Record No.'}
              onChangeText={(text) => this.onChange(text, 'medicalRecordNo')}
              value={this.state.medicalRecordNo}
              inputStyle={{color: '#555'}}
              placeholderTextColor={'#888'}
              inputContainerStyle={{
                ...styles.inputContainerStyle,
              }}
            />
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
                onPress={() => Actions.pop()}
              />
              <Button
                style={{...styles.button}}
                color={ COLORS.blue}
                loading={this.state.loading}
                textStyle={{...styles.buttonText, color: '#000'}}
                title={'NEXT'}
                onPress={() => this.onNext()}
              />
            </View>

            <Image
              source={require('../assets/birthdaydog.jpg')}
              style={{
                width: width,
                height: width * 0.8,
                // alignSelf: 'flex-end',
                // justifyContent: 'flex-end',
                // marginBottom: -20,
                bottom: 0,
                // position: 'absolute',
              }}
              resizeMode="cover"></Image>
          </View>
        </View>
        {/* </ScrollView> */}
      </>
    );
  }
}

AddPatient.defaultProps = {};
AddPatient.navigationOptions = {
  title: '',
};

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    height: height,

    // justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffdee2',
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
});

export default AddPatient;
