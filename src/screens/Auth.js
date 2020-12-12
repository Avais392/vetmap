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
import { COLORS } from '../util/colors';
// import Input from '../components/Input'
const {width, height} = Dimensions.get('window');
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  onChange = (value, property) => {
    this.setState({[property]: value});
  };
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        {/* <Header title={'Sign In'} /> */}
        {/* <ScrollView>
          <SafeAreaView style={styles.container}> */}
        <ImageBackground
          source={require('../assets/Auth.jpg')}
          resizeMode="stretch"
          //   width={width*0.95}
            height={height}
          style={styles.container}>
          <Text style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold'}}>
            Welcome to
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 40,
              fontWeight: 'bold',
              marginBottom: 50,
            }}>
            VetMap
          </Text>
          <Button
            style={{}}
            color={COLORS.blue}
            titleStyle={{fontWeight: 'bold', fontSize: 25}}
            title={'Log In'}
            onPress={() => {
              Actions.push('Signin');
            }}></Button>
          <Button
            style={{}}
            color={COLORS.blue}
            titleStyle={{fontWeight: 'bold', fontSize: 25}}
            title={'Sign Up'}
            onPress={() => {
              Actions.push('Signup');
            }}></Button>
          <Image
            source={require('../assets/UF.png')}
            style={{
              width: 70,
              height: 70,
              alignSelf: 'flex-end',
              bottom: 0,
              position: 'absolute',
              right: 20,
            }}
            resizeMode="contain"></Image>
        </ImageBackground>
        {/* </SafeAreaView>
        </ScrollView> */}
      </>
    );
  }
}

HomeScreen.defaultProps = {};
HomeScreen.navigationOptions = {
  title: '',
};

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    height: height * 0.97,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fca92a',
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

export default HomeScreen;
