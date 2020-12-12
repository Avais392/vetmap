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
  NativeModules,
  Alert,
} from 'react-native';

import {Icon, Input} from 'react-native-elements';
import {Scene, Router, Actions} from 'react-native-router-flux';
import RNImageToPdf from 'react-native-image-to-pdf';
import Snack from '../components/Snackbar';
import Swipeout from 'react-native-swipeout';
import Header from '../components/Header';
import Button from '../components/Button';
import {COLORS} from '../util/colors';
import firebase from '../firebase';
import AsyncStorage from '@react-native-community/async-storage';
// import RNFetchBlob from 'react-native-fetch-blob';
import Mailer from 'react-native-mail';
// import Input from '../components/Input'
const {width, height} = Dimensions.get('window');
class SavedPatientsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {savedPatients: []};
  }

  async componentDidMount() {
    const userData = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({userData});

    await firebase
      .database()
      .ref(`patients`)
      .on('value', (snap) => {
        if (snap.exists()) {
          const patients = Object.keys(snap.val()).map((key) => ({
            ...snap.val()[key],
            id: key,
          }));
          patients.reverse()
          this.setState({patients});
        }
      });
  }
  onChange = (value, property) => {
    this.setState({[property]: value});
  };
  swipeBtns = [
    {
      text: 'Delete',
      type: 'delete',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => {
        console.log('Deleting Row with Id ', this.state.activeRow);
        this.deleteNote(this.state.activeRow);
      },
    },
  ];
  onSwipeOpen(rowId, direction) {
    if (typeof direction !== 'undefined') {
      this.setState({activeRow: rowId});
      console.log('Active Row', rowId);
    }
  }

  deleteNote = (rowIndex) => {
    let rec = this.state.patients[rowIndex];
    firebase
      .database()
      .ref(`patients`)
      .child(rec.id)
      .remove()
      .then(function () {
        Snack('success', 'Record removed successfully');
      })
      .catch(function (error) {
        Snack('error', error.message);
      });
    //add your custome logic to delete the array element with index.
    // this will temporary delete from the state.
    // let filteredData = this.removeItem(this.state.AbcSdata,rowIndex);
    // this.setState({AbcSdata: [] },()=> {
    //   this.setState({AbcSdata: filteredData },()=> {console.log("Row deleted.", rowIndex)});
    // });
  };
  handleEmail = (path, item) => {
    Mailer.mail(
      {
        subject: `Sending Records for Patient: ${item.name}- Record: ${item.recordNo}`,
        recipients: [''],
        ccRecipients: [''],
        bccRecipients: [''],
        body: ``,
        customChooserTitle: '', // Android only (defaults to "Send Mail")
        isHTML: true,
        attachments: [
          {
            path: path, // The absolute path of the file from which to read data.
            type: 'pdf', // Mime Type: jpg, png, doc, ppt, html, pdf, csv
            // mimeType - use only if you want to use custom type
            name: 'xyz', // Optional: Custom filename for attachment
          },
        ],
      },
      (error, event) => {
        Alert.alert(
          error,
          event,
          [
            {
              text: 'Ok',
              onPress: () => console.log('OK: Email Error Response'),
            },
            {
              text: 'Cancel',
              onPress: () => console.log('CANCEL: Email Error Response'),
            },
          ],
          {cancelable: true},
        );
      },
    );
  };
  myAsyncPDFFunction = async (item) => {
    // const fs = RNFetchBlob.fs;

    // await RNFetchBlob.config({
    //   fileCache: true,
    // })
    //   .fetch(
    //     'GET',
    //     'https://firebasestorage.googleapis.com/v0/b/vetmap-eb11e.appspot.com/o/uploads%2F-MJNJVFO9HiIkXOPV5sp.png?alt=media&token=05cda4e0-a42c-474a-9415-6f86d5d87228',
    //   )
    //   // the image is now dowloaded to device's storage
    //   .then((resp) => {
    //     // the image path you can use it directly with Image component
    //     imagePath = resp.path();
    //     return resp.readFile('base64');
    //   })
    //   .then((base64Data) => {
    //     // here's base64 encoded image
    //     // console.log('BASE64', base64Data);
    //     imagePath = base64Data;
    //     // remove the file from storage
    //     return fs.unlink(imagePath);
    //   });
    try {
      // console.log('BASE64........890', imagePath);
      const options = {
        imagePaths: Object.values(item.photos),
        name: `${item.name}-${item.recordNo}`,
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 900,
          height: Math.round((height / width) * 900),
        },
        quality: 1, // optional compression paramter
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);

      console.log(pdf.filePath);
      this.handleEmail(pdf.filePath, item);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    console.log('this.state.patients', this.state.patients);
    return (
      <>
        <StatusBar barStyle="dark-content" />
        {/* <Header title={'Sign In'} /> */}
        <ScrollView contentContainerStyle={{flex: 1}}>
          <View style={styles.container}>
            <View
              style={[
                {flexDirection: 'row', marginVertical: 20},
                Platform.OS === 'ios' ? {marginTop: 50} : null,
              ]}>
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
            <FlatList
              data={this.state.patients || []}
              keyExtractor={(item) => item.id}
              renderItem={({item, index}) => (
                <Swipeout
                  right={this.swipeBtns}
                  close={this.state.activeRow !== index}
                  rowID={index}
                  sectionId={1}
                  autoClose={true}
                  onOpen={(secId, rowId, direction) =>
                    this.onSwipeOpen(rowId, direction)
                  }
                  style={{backgroundColor: '#fff'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      //   flex: 1,
                      width: width,
                      paddingHorizontal: 20,
                      justifyContent: 'space-between',
                      marginBottom: 30,
                      alignItems: 'center',
                    }}>
                    <Image
                      style={styles.profileImage}
                      source={
                        item.photos
                          ? {uri: item.photos[0]}
                          : require('../assets/imageplaceholder.png')
                      }
                    />
                    <View>
                      <Text>{item.name}</Text>
                      <Text>{item.recordNo}</Text>
                    </View>

                    <Button
                      style={{
                        ...styles.button,
                        width: width * 0.3,
                        alignSelf: 'flex-end',
                      }}
                      color={COLORS.green}
                      loading={this.state.loading}
                      titleStyle={{
                        ...styles.buttonText,
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                      title={'EXPORT'}
                      onPress={async () => await this.myAsyncPDFFunction(item)}
                    />
                  </View>
                </Swipeout>
              )}></FlatList>
            <Button
              style={{
                ...styles.button,
                width: width * 0.3,
                alignSelf: 'flex-start',
              }}
              //   color={'#0f0'}
              loading={this.state.loading}
              textStyle={{...styles.buttonText, color: '#000'}}
              title={'BACK'}
              onPress={() => Actions.popTo('Home')}
            />
            <Image
              source={require('../assets/savedpatients.jpg')}
              style={{
                width: width,
                height: width * 0.7,
                // alignSelf: 'flex-end',
                // justifyContent: 'flex-end',
                bottom: 0,
              }}
              resizeMode="cover"></Image>
          </View>
        </ScrollView>
      </>
    );
  }
}

SavedPatientsScreen.defaultProps = {};
SavedPatientsScreen.navigationOptions = {
  title: '',
};

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    height: height,

    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  profileImage: {
    backgroundColor: '#ddd',
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 10,
  },
});

export default SavedPatientsScreen;
