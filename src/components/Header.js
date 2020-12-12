import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../util/colors';

class CustomHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onPressLeftButton = this.onPressLeftButton.bind(this);
    this.onPressRightButton = this.onPressRightButton.bind(this);
    this.shouldLeftButtonDisabled = this.shouldLeftButtonDisabled.bind(this);
  }

  onPressLeftButton() {
    this.props.onPressLeftButton(this.props.month, this.props.addMonth);
  }

  onPressRightButton() {
    this.props.onPressRightButton(this.props.month, this.props.addMonth);
  }

  shouldLeftButtonDisabled() {
    // const selectedDate = moment(this.props.month.getTime());
    // return selectedDate.isSame(now, 'month');
  }

  render() {
    return (
      <View>
        <View style={[styles.CustomHeader, this.props.containerStyle,Platform.OS==='ios'?{paddingTop:30,paddingBottom:10,height:70}:null]}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => this.onPressLeftButton()}
            // disabled={this.shouldLeftButtonDisabled()}
          >
            {this.props.leftIcon || null}
            {/* <Image
              style={[styles.icon, styles.leftIcon]}
              source={require('../images/arrow.png') || this.props.leftIcon}
            /> */}
          </TouchableOpacity>
          <Text style={styles.title}>
            {/* {moment(this.props.month.getTime()).format('MMM, YYYY')} */}
            {this.props.title || 'TITLE'}
          </Text>

          <TouchableOpacity
            style={styles.iconContainer}
            onPress={this.onPressRightButton}>
            {this.props.rightIcon || null}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

CustomHeader.propTypes = {
  CustomHeaderData: PropTypes.object,
  horizontal: PropTypes.bool,
  onPressRightButton: PropTypes.func.isRequired,
  onPressLeftButton: PropTypes.func.isRequired,
  onPressListView: PropTypes.func.isRequired,
  onPressGridView: PropTypes.func.isRequired,
  addMonth: PropTypes.func,
  month: PropTypes.object,
};

const styles = StyleSheet.create({
  CustomHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 20,
    backgroundColor: COLORS.blue,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 4,
    marginTop: -2,
  },
  leftIcon: {
    transform: [{rotate: '180deg'}],
  },
  icon: {
    width: 24,
    height: 24,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default CustomHeader;
