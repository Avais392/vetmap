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
import Snack from '../components/Snackbar';
import {Icon, Input} from 'react-native-elements';
import {Scene, Router, Actions} from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../components/Header';
import Button from '../components/Button';
import firebase from '../firebase';
// import Input from '../components/Input'

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const {width, height} = Dimensions.get('window');
class SigninScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  onSubmit = async () => {
    // this.props.navigation.navigate('AppPasscode'); Testing purpose
    // return;
    this.setState({loading: true});
    if (this.valid()) {
      const {email, password} = this.state;

      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (resp) => {
          Snack('success', 'Login successful');
          console.log(resp.user.uid);
          await firebase
            .database()
            .ref(`users/${resp.user.uid}`)
            .once('value', (snapshot) => {
              if (snapshot.exists()) {
                console.log(snapshot.val());
                AsyncStorage.setItem(
                  'userData',
                  JSON.stringify({
                    ...snapshot.val(),
                    id: resp.user.uid,
                  }),
                );
              }
            })
            .then(() => {
              Actions.reset('Home');
            });

          // this.state.checked
          //   ? session.setRememberMe(email, password)
          //   : session.setRememberMe('', '');
          this.setState({loading: false, email: '', password: ''});
        })
        .catch((error) => {
          this.setState({loading: false});
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
            Snack('error', 'The password is too weak.');
          } else {
            Snack('error', errorMessage);
          }
          console.log(error);
        });
    } else {
      this.setState({loading: false});
    }
  };

  valid() {
    const {email, password} = this.state;
    if ((email && email.length === 0) || !emailRegex.test(email)) {
      Snack('error', 'Please enter valid email');
      return false;
    }
    if (password && password.length > 0) {
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

  render() {
    return (
      <>
        {/* <StatusBar barStyle="dark-content" /> */}
        <Header title={'Log In'} />
        <ScrollView style={{flex:1,}}>
          <SafeAreaView style={[styles.container,{height}]}>
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
              secureTextEntry
              inputStyle={{color: '#555'}}
              placeholderTextColor={'#888'}
              inputContainerStyle={{
                ...styles.inputContainerStyle,
              }}
            />

            <TouchableOpacity
              onPress={() => Actions.push('Signup')}
              style={{marginBottom: 30}}>
              <Text
                style={{
                  marginHorizontal: 30,
                  textAlign: 'right',
                
                  width: width * 0.9,
                }}>
                New User? Sign Up
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
              style={{width: width * 0.9, borderRadius: 20, borderWidth: 2}}
              color="green"
              
              title={'START MAPPING'}
              titleStyle={{fontWeight:'bold',fontSize:20}}
              onPress={() => {
                this.onSubmit()
              }}></Button>
          </SafeAreaView>
        </ScrollView>
      </>
    );
  }
}

SigninScreen.defaultProps = {};
SigninScreen.navigationOptions = {
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

export default SigninScreen;
