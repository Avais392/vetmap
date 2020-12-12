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
import AsyncStorage from '@react-native-community/async-storage';
import {Icon, Input} from 'react-native-elements';
import {Scene, Router, Actions} from 'react-native-router-flux';

import Header from '../components/Header';
import Button from '../components/Button';
// import Input from '../components/Input'
const {width, height} = Dimensions.get('window');
class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const userData = await AsyncStorage.getItem('userData');
    setTimeout(() => {
      if (userData) {
        Actions.reset('Home');
      } else {
        Actions.reset('Auth');
      }
    }, 500);
  }
  onChange = (value, property) => {
    this.setState({[property]: value});
  };
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        {/* <Header title={'Sign In'} /> */}

        <View style={styles.container}>
          <Image
            source={require('../assets/splash.jpg')}
            style={{
              width: width,
              height: height*0.97,
              position: 'absolute',
              top: 0,
              backgroundColor: '#fa4727',
            }}
            resizeMode="contain"></Image>
        </View>
      </>
    );
  }
}

SplashScreen.defaultProps = {};
SplashScreen.navigationOptions = {
  title: '',
};

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    height: height,

    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fa4727',
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

export default SplashScreen;
