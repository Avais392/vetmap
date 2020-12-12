import React from 'react';
import Snackbar from 'react-native-snackbar';
import {COLORS} from '../util/colors';

export default function (status, message) {
  let color = status === 'success' ? 'blue' : 'red';
  Snackbar.show({
    title: message,
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: COLORS.blue,
  });
}
