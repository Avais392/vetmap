import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
const {width, height} = Dimensions.get('window');
class Button extends React.Component {
  static defaultProps = {
    width: width / 3,
    height: width / 8,
    title: 'Click Me',
    onPress: () => alert('Clicked'),
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      // <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => this.props.onPress()}
        disabled={this.props.disabled}>
        {this.props.small ? (
          <View
            style={[
              styles.button,
              {
                minWidth: 50,
                // maxWidth:'auto',
                width: '100%',
                paddingHorizontal: 20,
                height: 25,
                backgroundColor:
                  this.props.color ||
                  (this.props.disabled ? '#a0a0a0' : '#10589b'),
              },
              this.props.style,
            ]}>
            <Text
              style={{
                ...styles.title,
                fontSize: 8,
                ...this.props.titleStyle,
              }}>
              {this.props.title}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.button,
              {
                backgroundColor:
                  this.props.color ||
                  (this.props.disabled ? '#a0a0a0' : '#10589b'),
              },
              
              {width: 300},
              this.props.style,
            ]}>
            <Text style={{...styles.title, ...this.props.titleStyle}}>
              {this.props.title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    // borderWidth: 1,
    // borderColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    elevation: 1,
    margin: 10,
  },
  title: {
    color: 'white',
    fontSize: 16,
    alignSelf: 'center',
    // paddingHorizontal: 20,
    paddingBottom: 4,
  },
});

export default Button;
