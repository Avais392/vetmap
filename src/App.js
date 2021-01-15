import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import GlobalFont from 'react-native-global-font';
// import Firebase from './Firebase';
import {createStore, applyMiddleware} from 'redux';

import Router from './Router';
console.disableYellowBox = true;
class App extends Component {
  async componentDidMount() {
    // let fontName = 'TrajanPro-Regular';
    // GlobalFont.applyGlobal(fontName);
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}
export default App;
