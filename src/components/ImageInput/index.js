import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import {Scene, Router, Actions} from 'react-native-router-flux';
import {request, checkMultiple, PERMISSIONS} from 'react-native-permissions';
import firebase from '../../firebase';

const {width, height} = Dimensions.get('window');

const ImageInput = (props) => {
  const {
    title,
    value,
    setValue,
    error,

    setError,
    validation,
    type = '',
    logo = false,
    children = null,
  } = props;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const uriToBlob = (uri) => {
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

  const uploadToFirebase = (blob) => {
    var storageRef = firebase.storage().ref();
    var id = firebase.database().ref(`/uploads`).push().key;
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
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
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
          console.log('File available at', downloadURL);
          setImageUrl(downloadURL);
          props.callback(downloadURL);
          Actions.push('Draw', {imageURL: downloadURL});
          // setValue([id, downloadURL]);
          // setError("");
          console.log('Uploaded');
          setLoading(false);
        });
      },
    );
  };

  const uploadImage = async () => {
    checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.ANDROID.CAMERA]).then(
      (statuses) => {
        console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
        console.log('FaceID', statuses[PERMISSIONS.ANDROID.CAMERA]);
      },
    );
    await request([PERMISSIONS.IOS.CAMERA, PERMISSIONS.ANDROID.CAMERA]);
    console.log('image picker');
    const options = {
      title: 'Select Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
    };

    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('succes', response);
        setLoading(true);
        const {height, width, type, uri} = response;
        // setImageUrl(uri);
        // props.callback(uri)
        // alert(String(uri).replace('file://','private/'))
        String(uri).replace('file://', 'private/');
        console.log('uriIn ImageInput', uri);
        props.callback(uri);
        // var blob = await uriToBlob(uri);
        Actions.push('Draw', {
          ...props,
          label: props.label,
          imageURL: 'data:image/jpeg;base64,' + response.data,
          response,
          // blob: blob,
          callback: (u) => props.callback(u),
        });

        // props.callback(blob)
        // await uploadToFirebase(blob);
        // props.callback(imageUrl);
        setLoading(false);
      }
    });
  };

  const removePhoto = () => {
    // var storageRef = firebase.storage().ref(`/uploads/${value[0]}.jpg`);
    // storageRef.delete();
    // console.log('val', storageRef);
    setImageUrl('');
    setValue([]);
    validation('', setError);
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator style={{width: 200, height: 200}} size="large" />
      ) : (
        <TouchableOpacity onPress={() => uploadImage()}>
          {children}
        </TouchableOpacity>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 20,
    borderTopLeftRadius: 20,
    marginVertical: 5,
    borderRadius: 10,
  },
  error: {
    fontSize: 13,
    color: 'red',
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'times',
    fontSize: 24,
  },
  image: {
    marginTop: 20,
    minWidth: 240,
    height: 240,
    paddingHorizontal: 10,
    resizeMode: 'contain',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 3,
    height: width / 3,
  },
  imageIcon: {height: 50, width: 50, resizeMode: 'contain'},
  imageIconLabel: {fontSize: 16, margin: 10},
});

export default ImageInput