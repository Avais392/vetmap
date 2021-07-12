import React, {Component, useCallback} from 'react';
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
  Modal,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
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

import ViewShot from 'react-native-view-shot';

class SavedPatientsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedPatients: [],
      hold: [],
      modalVisible: false,
      collageImages: [],
      showText: true,
      currentVetData: [],
    };
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
          patients.reverse();
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
    // alert('j')
    console.log(Object.values(item.photos), '345');
    console.log(item, '312312');
    // this.setState({
    //   // showText: true,
    //   // modalVisible: true,
    //   collageImages: Object.values(item.photos),
    //   currentVetData: item,
    // });
    console.log(item, '312312');
    let options = {
      html: `<!DOCTYPE html>
      <html>
      <style>
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        font-family: Arial;
      }
      
      .header {
        text-align: center;
        padding: 32px;
      }
      
      /* Create two equal columns that floats next to each other */
      .column {
        float: left;
        width: 50%;
        padding: 10px;
      }
      
      .column img {
        margin-top: 12px;
      }
      
      /* Clear floats after the columns */
      .row:after {
        content: "";
        display: table;
        clear: both;
      }
      </style>
      <body  style="width:2480px; height:3508;">
      
      <!-- Header -->
      
      
      <!-- Photo Grid -->
      <div class="row"> 
      <div class="row">
       <div style="width:50%; float:left"><div class="header">
        <h1>Image Grid</h1>
      </div></div>
         <img src=${item.photos[0]} style="width:1200px; float:right; height:1000px;">
        </div>
        <div class="column">
        <img src=${item.photos[1]}  style="width:1200px height:1000px;">
         <img src=${item.photos[2]}  style="width:1200px; height:1000px;">
        </div>
        <div class="column">
        <img src=${item.photos[3]}  style="width:1200px; height:1000px;">
         <img src=${item.photos[4]}  style="width:1200px; height:1000px;">
        </div>
       
        
      </div>
      
      </body>
      </html>      
      `,
      fileName: 'test',
      directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options)
    console.log(file.filePath);
    alert(file.filePath);
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

    // console.log('BASE64........890', imagePath);
    // const options = {
    //   // imagePaths: [
    //   //   'https://i.pinimg.com/originals/76/0f/37/760f37d6d0ff9ccc6931278c2360cdcd.jpg',
    //   //   'https://www.highlandernews.org/wp-content/uploads/radar.broly_.toeiAnimation.jpg',
    //   //   'https://talkiesnetwork.files.wordpress.com/2017/09/broly-dragon-ball-206651-1280x0.jpg?w=930&h=450&crop=1',
    //   //   'https://i.ytimg.com/vi/1DPGe85-pG4/maxresdefault.jpg',
    //   //   'https://static2.cbrimages.com/wordpress/wp-content/uploads/2020/04/dragon-ball-broly.jpg',
    //   // ],
    //   imagePaths: Object.values(item?.photos),
    //   name: `${item.name}-${item.recordNo}`,

    //   maxSize: {
    //     // optional maximum image dimension - larger images will be resized
    //     width: 45,
    //     height: 45,
    //   },
    //   quality: 1, // optional compression paramter
    // };
    // const pdf = await RNImageToPdf.createPDFbyImages(options);

    //   // console.log(pdf.filePath, 'erwre');
    //
    //   var arrHold = [];
    //   let save = array.map((item) => {
    //     ImgToBase64.getBase64String(item)
    //       .then((base64String) => {
    //         this.setState({hold: [base64String, ...this.state.hold]});
    //         arrHold = base64String;
    //       })
    //       .catch((err) => console.log(err));

    //     return arrHold;
    //   });
    //   console.log(save, 'sadads');
    //   // console.log(this.state.hold, 'asdasd', arrHold, save);

    //   // ImagesMerge.mergeImages(
    //   //   [
    //   //     {
    //   //       uri: arrHold[0],
    //   //     },
    //   //     {
    //   //       uri: arrHold[1],
    //   //     },
    //   //   ],
    //   //   (result) => {
    //   //     console.log(result);
    //   //   },
    //   // );
    //   this.saveImage(arrHold);
    //   //  this.handleEmail(pdf.filePath, item);
    // } catch (e) {
    //   console.log(e, 'sdfsdf');
    // }
  };

  saveImage = () => {
    this.refs.viewShot.capture().then(
      //callback function to get the result URL of the screnshot
      async (uri) => {
        //  setSavedImagePath(uri);
        //setImageURI(uri);
        console.log(uri, 'asd');
        try {
          // console.log('BASE64........890', imagePath);
          const options = {
            imagePaths: [uri],
            name: `${this.state.currentVetData?.name}-${this.state.currentVetData?.recordNo}`,
            maxSize: {
              // optional maximum image dimension - larger images will be resized
              width: 900,
              height: Math.round((height / width) * 900),
            },
            quality: 1, // optional compression paramter
          };
          const pdf = await RNImageToPdf.createPDFbyImages(options);

          console.log(pdf.filePath);

          this.handleEmail(pdf.filePath, this.state.currentVetData);
          this.setState({
            modalVisible: false,
            collageImages: [],
            showText: false,
            currentVetData: [],
          });
        } catch (e) {
          console.log(e);
        }
      },
      (error) => console.error('Oops, Something Went Wrong', error),
    );
  };

  renderItem = ({item, index, drag, isActive}) => {
    return (
      <TouchableOpacity
        style={{
          height: 100,
          width: 100,
          backgroundColor: isActive ? 'blue' : item.backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onLongPress={drag}>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'white',
            fontSize: 32,
          }}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        {/* <Header title={'Sign In'} /> */}
        {this.state.modalVisible == false ? (
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
                        onPress={async () =>
                          await this.myAsyncPDFFunction(item)
                        }
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
        ) : (
          <>
            {this.state.showText == true ? (
              <>
                {/* <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                  Confirm your Image Placements
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginBottom: 20,
                  }}>
                  Drag images according to your need
                </Text> */}
              </>
            ) : null}
            <ViewShot ref="viewShot" options={{format: 'jpg', quality: 0.9}}>
              {/* <DynamicCollage
                height={Dimensions.get('window').height - 200}
                width={Dimensions.get('window').width}
                images={this.state.collageImages}
                matrix={
                  Object.values(this.state.currentVetData?.photos).length == 5
                    ? [1, 2, 2]
                    : Object.values(this.state.currentVetData?.photos).length ==
                      4
                    ? [2, 2]
                    : Object.values(this.state.currentVetData?.photos).length ==
                      3
                    ? [1, 2]
                    : Object.values(this.state.currentVetData?.photos).length ==
                      2
                    ? [1, 1]
                    : Object.values(this.state.currentVetData?.photos).length ==
                      1
                    ? [1]
                    : [0]
                }
                direction="column"
                scaleAmplifier={500}
                imageSelectedStyle={{
                  borderColor: 'transparent',
                  borderWidth: 2,
                }}
                imageSwapStyle={{borderColor: 'red', borderWidth: 2}}
                imageStyle={{width: 100, height: 100, resizeMode: 'center'}}
                separatorStyle={{
                  borderColor: 'transparent',
                  borderWidth: 3,
                }}
              /> */}
              {/* <DraggableFlatList
                data={this.state.data}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => `draggable-item-${item.key}`}
                scrollPercent={5}
                //  onMoveEnd={({data}) => this.setState({data})}
                //  numColumns={2}
                inverted={false}
                onDragEnd={({data}) => this.setState(data)}
              /> */}
              {/* <View
                style={{
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <Image
                  source={{uri: this.state.collageImages[0]}}
                  style={{width: width, height: 300}}
                  resizeMode={'contain'}></Image>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{width: 300, height: 200}}>
                  <Image
                    source={{uri: this.state.collageImages[1]}}
                    style={{width: 200, height: 200}}
                    resizeMode={'contain'}></Image>
                </View>
                <View style={{width: 300, height: 200}}>
                  <Image
                    source={{uri: this.state.collageImages[1]}}
                    style={{width: 200, height: 200}}
                    resizeMode={'contain'}></Image>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{width: 300, height: 200}}>
                  <Image
                    source={{uri: this.state.collageImages[1]}}
                    style={{width: 200, height: 200}}
                    resizeMode={'contain'}></Image>
                </View>
                <View style={{width: 300, height: 200}}>
                  <Image
                    source={{uri: this.state.collageImages[1]}}
                    style={{width: 200, height: 200}}
                    resizeMode={'contain'}></Image>
                </View>
              </View> */}

              <FlatList
                data={this.state.collageImages}
                renderItem={({item, index}) => (
                  console.log(index, '132123'),
                  (
                    <View
                      style={{
                        flex: 1,
                        height: index == 4 ? 230 : 230,
                        borderWidth: 1,
                        backgroundColor: 'white',
                      }}>
                      <Image
                        source={{uri: item}}
                        style={{height: 230, width: index == 4 ? '100%' : 200}}
                        resizeMode={index == 4 ? 'contain' : 'contain'}
                      />
                    </View>
                  )
                )}
                //Setting the number of column
                numColumns={2}
                keyExtractor={(item, index) => index}
              />

              {/* <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                <View
                  style={{
                    //   backgroundColor: 'red',
                    width: '50%',
                    height: 300,
                    marginLeft: 10,
                    marginTop: 10,
                    marginRight: 5,
                  }}>
                  <Image
                    source={{uri: this.state.collageImages[1]}}
                    style={{width: 200, height: 200}}
                    resizeMode={'contain'}></Image>
                </View>
                <View
                  style={{
                    //  backgroundColor: 'red',
                    width: '50%',
                    height: 300,
                    marginRight: 10,
                    marginTop: 10,
                  }}>
                  <Image
                    source={{uri: this.state.collageImages[1]}}
                    style={{width: 200, height: 200}}
                    resizeMode={'contain'}></Image>
                </View>
              </View> */}

              {/* <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  flex: 1,
                }}>
                <View>
                  <Image
                    source={{uri: this.state.collageImages[1]}}
                    style={{width: 300, height: 300}}
                    resizeMode={'contain'}></Image>
                </View>
                <View>
                  <Image
                    source={{uri: this.state.collageImages[1]}}
                    style={{width: 300, height: 300}}
                    resizeMode={'contain'}></Image>
                </View>
              </View> */}

              {/* <Image
                source={{uri: this.state.collageImages[0]}}
                style={{width: '100%', height: 350}}></Image>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                }}>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Image
                    source={{uri: this.state.collageImages[1]}}
                    style={{width: 300, height: 300}}
                    resizeMode={'contain'}></Image>

                  <Image
                    source={{uri: this.state.collageImages[2]}}
                    style={{width: 300, height: 300}}
                    resizeMode={'contain'}></Image>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={{uri: this.state.collageImages[3]}}
                    style={{width: 300, height: 300}}
                    resizeMode={'contain'}></Image>

                  <Image
                    source={{uri: this.state.collageImages[4]}}
                    style={{width: 300, height: 300}}
                    resizeMode={'contain'}></Image>
                </View>
              </View> */}
            </ViewShot>
            {this.state.showText == true ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Button
                    style={{
                      width: width * 0.3,
                      alignSelf: 'flex-end',
                    }}
                    color={COLORS.red}
                    loading={this.state.loading}
                    titleStyle={{
                      ...styles.buttonText,
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                    title={'CLOSE'}
                    onPress={() => this.setState({modalVisible: false})}
                  />

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
                    title={'DONE'}
                    onPress={() => this.saveImage()}
                  />
                </View>
              </>
            ) : null}
          </>
        )}
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
