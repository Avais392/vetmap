import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';


class Spacer extends React.Component {
  static defaultProps = {
    horizontal: 0,
    vertical: 0,
    disable:false
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[this.props.disable?null:styles.mainContainer,{
          marginVertical: this.props.vertical?this.props.vertical*10:null,
          marginHorizontal: this.props.horizontal?this.props.horizontal*10:null,
        },this.props.style?this.props.style:null]}>{this.props.children}</View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    //   flex:0,
    // height: '100%',
    width: '100%',
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  imageView: {
    width: '50%',
  },
});

export default Spacer;
