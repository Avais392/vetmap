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
// import SketchDraw from 'react-native-sketch-draw';
import {Scene, Router, Actions} from 'react-native-router-flux';

import Header from '../components/Header';
import Button from '../components/Button';
// import Input from '../components/Input'

import {COLORS} from '../util/colors';
const {width, height} = Dimensions.get('window');
class ImageScreen extends Component {
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
        <ScrollView>
          <SafeAreaView style={styles.container}>
            <View style={{height: height, width: width, flex: 1}}>
              <ImageBackground
                source={{uri: this.props.imageURL}}
                style={{height: height, width: width, flex: 1}}
                resizeMode="contain">
                <Text>Hello</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    bottom: 50,
                    position: 'absolute',
                    justifyContent:"space-between",
                    alignItems:'center'

                  }}>
                  <Button
                    style={{
                      ...styles.button,
                      width: width * 0.3,
                     
                    }}
                    color={COLORS.green}
                    loading={this.state.loading}
                    titleStyle={{
                      ...styles.buttonText,
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                    title={'Text'}
                    onPress={() => {}}></Button>
                  <Button
                    style={{
                      ...styles.button,
                      width: width * 0.3,
                     
                    }}
                    color={COLORS.green}
                    loading={this.state.loading}
                    titleStyle={{
                      ...styles.buttonText,
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                    title={'Draw'}
                    onPress={() => {}}></Button>
                </View>
              </ImageBackground>
            </View>
          </SafeAreaView>
        </ScrollView>
      </>
    );
  }
}

ImageScreen.defaultProps = {};
ImageScreen.navigationOptions = {
  title: '',
};

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    height: height,

    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#acccdc',
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

export default ImageScreen;
