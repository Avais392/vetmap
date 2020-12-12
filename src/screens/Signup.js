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

import Header from '../components/Header';
import Button from '../components/Button';
import firebase from '../firebase';
import Snack from '../components/Snackbar';
// import Input from '../components/Input'
const {width, height} = Dimensions.get('window');
let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  valid() {
    const {email, password, confirmPassword} = this.state;
    if ((email && email.length === 0) || !emailRegex.test(email)) {
      Snack('error', 'Please enter valid email');
      return false;
    }
    if (password === confirmPassword && password.length > 0) {
      return true;
    } else {
      Snack('error', 'All fields must be filled');
      return false;
    }
  }

  rememberMe = () => {
    this.setState({checked: !this.state.checked});
  };

  onChange = (value, property) => {
    this.setState({[property]: value});
  };
  onSubmit = async () => {
    this.setState({loading: true});
    // alert('Ins')
    if (this.valid()) {
      const {email, password, clinicName} = this.state;
      // let deviceToken = await session.getDeviceToken();
      let body = {email, password, clinicName};
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (resp) => {
          this.setState({loading: false});
          Snack(
            'success',
            'Signup successful, Verify your email so you can login.',
          );
          await firebase
            .database()
            .ref(`users/${resp.user.uid}`)
            .set(body)
            .then((res) => console.log('new user data stored', res))
            .catch((err) => {
              console.log('new user data stored error', err);
            });
          Actions.replace('Signin');
        })
        .catch((err) => {
          console.log(err);
          this.setState({loading: false});
          if (err.response) {
            Snack('error', err.response.data.error);
            return false;
          } else {
            Snack('error', 'Unknown error occured, please contact an Admin');
            return false;
          }
        });
    } else {
      this.setState({loading: false});
    }
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <Header title={'Sign Up'} />
        <ScrollView style={{flex:1,}}>
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
            <Input
              placeholder={'Clinic Name'}
              onChangeText={(text) => this.onChange(text, 'clinicName')}
              value={this.state.clinicName}
              inputStyle={{color: '#555'}}
              placeholderTextColor={'#888'}
              inputContainerStyle={{
                ...styles.inputContainerStyle,
              }}
            />
            <Input
              placeholder={'Email'}
              onChangeText={(text) => this.onChange(text, 'email')}
              value={this.state.email}
              inputStyle={{color: '#555'}}
              placeholderTextColor={'#888'}
              inputContainerStyle={{
                ...styles.inputContainerStyle,
              }}
            />
            <Input
              placeholder={'Password'}
              onChangeText={(text) => this.onChange(text, 'password')}
              value={this.state.password}
              // passwordRules={{minLength:6}}
            // textContentType='password'
            secureTextEntry
              inputStyle={{color: '#555'}}
              placeholderTextColor={'#888'}
              inputContainerStyle={{
                ...styles.inputContainerStyle,
              }}
            />
            <Input
              placeholder={'Confirm Password'}
              onChangeText={(text) => this.onChange(text, 'confirmPassword')}
              value={this.state.confirmPassword}
              secureTextEntry
              inputStyle={{color: '#555'}}
              placeholderTextColor={'#888'}
              inputContainerStyle={{
                ...styles.inputContainerStyle,
              }}
            />
            <TouchableOpacity onPress={() => this._navigateToSignin()}>
              <Text
                style={{marginHorizontal: 30, textAlign: 'center'}}
                onPress={() => Actions.push('Signin')}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
            <Image
              source={require('../assets/dogfamily.jpg')}
              style={{width: width, height: 200, alignSelf: 'flex-end'}}
              resizeMode="cover"></Image>
            <Text style={{margin: 30, textAlign: 'center'}}>
              By proceeding you also agree to Terms of Service and Privacy
              Policy
            </Text>
            <Button
              title={'SIGN UP'}
              style={{marginBottom:30}}
              onPress={() => {
                this.onSubmit();
              }}></Button>
          </SafeAreaView>
        </ScrollView>
      </>
    );
  }
}

SignupScreen.defaultProps = {};
SignupScreen.navigationOptions = {
  title: '',
};

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    // height: height,

    // justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#d9e4f2',
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
});

export default SignupScreen;
