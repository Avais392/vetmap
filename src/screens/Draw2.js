import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
} from 'react-native';
import firebase from '../firebase';
import RNSketchCanvas from '../@terrylinla/react-native-sketch-canvas';
import AsyncStorage from '@react-native-community/async-storage';
import {Input} from 'react-native-elements';
import {Scene, Router, Actions} from 'react-native-router-flux';
var RNFS = require('react-native-fs');
export default class example extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    const userData = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({userData});
    console.log('userData', userData);
  }
  state = {textDesc: ''};

  // setUri = (downloadURL) => {
  //   this.setState({downloadURL});
  //   this.props.callback(downloadURL);
  // };
  uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };
      // this helps us get a blob
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };
  uploadToFirebase = async (blob, callback) => {
    var storageRef = firebase.storage().ref();
    var id = firebase.database().ref(`uploads`).push().key;
    var uploadTask = storageRef.child(`uploads/${id}.png`).put(blob, {
      contentType: 'image/png',
    });
    uploadTask.on(
      'state_changed',
      function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState?.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState?.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      function (error) {
        // Handle unsuccessful uploads
      },
      function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log('File available at DRAW', downloadURL);
          // setImageUrl(downloadURL);
          callback(downloadURL);
          // setValue([id, downloadURL]);
          // setError("");
          console.log('Uploaded from Draw');
          // setLoading(false);
        });
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={[{flex: 1, flexDirection: 'row'},Platform.OS === 'ios' ? {paddingTop: 20} : null]}>
          <RNSketchCanvas
            containerStyle={{backgroundColor: 'transparent', flex: 1}}
            canvasStyle={{backgroundColor: 'transparent', flex: 1,height:'300px',borderWidth:3}}
            onClosePressed={() => {
              Actions.pop();
            }}
            text={[
              {
                text: this.state.textDesc,
                fontSize: 60,
                position: {x: 0.5, y: 0.05},
                anchor: {x: 0.5, y: 0},
                coordinate: 'Ratio',
                overlay: 'SketchOnText',
                fontColor: 'black',
                alignment: 'Center',
                lineHeightMultiple: 1,
              },
            ]}
            CanvasText={{
              text: 'TEXT',
              font: '',
              fontSize: 20,
              fontColor: 'red',
              overlay: 'TextOnSketch',
              anchor: {x: 0, y: 1},
              position: {x: 100, y: 200},
              coordinate: 'Absolute',
              alignment: 'Center',
              lineHeightMultiple: 1.2,
            }}
            onSketchSaved={async (success, path) => {
              if (success) {
                // alert(path)
                const blob = await this.uriToBlob('file://' + path);
                await this.uploadToFirebase(blob, (uri) =>
                  this.props.callback(uri),
                );
                path ? await RNFS.unlink(path) : null;
                // this.props.callback('file://' + path);
                // alert('file://' + path);
                // alert(JSON.stringify(path));
                Actions.popTo('Diagnose');
              }
            }}
            localSourceImage={{
              filename: String(this.props.response.uri).replace('file://', ''),
              // String(this.props.imageURL).replace('file://', '/private'),
              directory: '',
              mode: 'AspectFit',
              
            }}
            
            defaultStrokeIndex={0}
            defaultStrokeWidth={5}
            closeComponent={
              <View style={styles.functionButton}>
                <Text style={{color: 'white'}}>Close</Text>
              </View>
            }
            undoComponent={
              <View style={styles.functionButton}>
                <Text style={{color: 'white'}}>Undo</Text>
              </View>
            }
            clearComponent={
              <View style={styles.functionButton}>
                <Text style={{color: 'white'}}>Clear</Text>
              </View>
            }
            eraseComponent={
              <View style={styles.functionButton}>
                <Text style={{color: 'white'}}>Eraser</Text>
              </View>
            }
            strokeComponent={(color) => (
              <View
                style={[{backgroundColor: color}, styles.strokeColorButton]}
              />
            )}
            strokeSelectedComponent={(color, index, changed) => {
              return (
                <View
                  style={[
                    {backgroundColor: color, borderWidth: 2},
                    styles.strokeColorButton,
                  ]}
                />
              );
            }}
            strokeWidthComponent={(w) => {
              return (
                <View style={styles.strokeWidthButton}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      marginHorizontal: 2.5,
                      width: Math.sqrt(w / 3) * 10,
                      height: Math.sqrt(w / 3) * 10,
                      borderRadius: (Math.sqrt(w / 3) * 10) / 2,
                    }}
                  />
                </View>
              );
            }}
            saveComponent={
              <View style={styles.functionButton}>
                <Text style={{color: 'white'}}>Save</Text>
              </View>
            }
            savePreference={() => {
              console.log('savingPrefernce');
              return {
                folder: true ? 'RNSketchCanvas' : null,
                filename:
                 true
                    ? String(Math.ceil(Math.random() * 100000000))
                    : null,
                transparent: false,
                imageType: 'png',
                // transparent: true,
                // imageType: 'jpg',
                // includeImage: true,
                // includeText: false,
                // cropToImageSize: true
              };
            }}
          />
        </View>
        <Input
        placeholder="Type Here..."
        style={{zIndex:10,backgroundColor:'#ddd',bottom:200}}
          value={this.state.textDesc}
          onChangeText={(textDesc) => this.setState({textDesc})}></Input>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39579A',
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30,
    width: 60,
    backgroundColor: '#39579A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    zIndex:5
  },
});
