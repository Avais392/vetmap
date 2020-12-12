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
import Button from '../components/Button'
// import Input from '../components/Input'

import {COLORS} from '../util/colors'
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
     <View  style={{width:'100%',flex:1,height:height}}>
        {/* <StatusBar barStyle="dark-content" /> */}
        {/* <Header title={'Sign In'} /> */}
       
        {/* <ScrollView style={{flex:1,width:'100%',height:height}}> */}
          <View  style={[styles.container,{height:height}]}>
          {/* <SafeAreaView style={styles.container}> */}
              <View style={[{flexDirection:"row",marginVertical:20},Platform.OS==='ios'?{marginTop:50}:null]}>
                  <Image source={require('../assets/blackvetmap.png')} style={{width:200,height:100}} resizeMode='contain'></Image>
                  <Image source={require('../assets/UF.png')} style={{width:50,height:50,alignSelf:'flex-end',marginBottom:-7}} resizeMode='contain'></Image>
              </View>
            <View style={{}}>
            <Button style={{}} color={COLORS.orange} titleStyle={{fontWeight:'bold',fontSize:25}} title={'Add Patients'} onPress={()=>{Actions.push('AddPatient')}}></Button>
            <Button style={{}} color={COLORS.blue} titleStyle={{fontWeight:'bold',fontSize:25}} title={'Saved Patients'} onPress={()=>{Actions.push('SavedPatients')}}></Button></View>
            <Image source={require('../assets/homescreendog.jpg')} style={{width:width,height:width,alignSelf:'center',justifyContent:'flex-end',bottom:0,}} resizeMode='contain'></Image>
          {/* </SafeAreaView> */}
        </View>
        {/* </ScrollView> */}
      </View>
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
    // height: height,

    justifyContent: 'space-between',
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

export default HomeScreen;
