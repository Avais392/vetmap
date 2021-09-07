import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Scene, Router, Actions} from 'react-native-router-flux';

import HomeScreen from './screens/HomeScreen.js';
import Signup from './screens/Signup';
import Signin from './screens/Signin';
import AddPatient from './screens/AddPatient';
import Diagnose from './screens/Diagnose';
import SavedPatients from './screens/SavedPatients';
import ImageScreen from './screens/ImageScreen';
import Splash from './screens/Splash';
import Auth from './screens/Auth';
import Draw from './screens/Draw';
import Draw2 from './screens/Draw2'
// import AboutUsScreen from './screens/AboutUs'

// const InboxIcon = () => {
//   return (
//     <View style={{marginRight: 10}}>
//       <TouchableOpacity onPress={() => Actions.employeeCreate()}>
//         <Icon name="list" type="font-awesome" color="#f50" size={28} />
//       </TouchableOpacity>
//     </View>
//   );
// };

// import {Icon} from 'react-native-elements';
const RouterComponent = () => {
  return (
    <Router>
      <Scene key="root" headerMode="none">
        {/* <Scene
          // icon={<Icon name="list" type="font-awesome" color="#f50" size={15} />}
          renderRightButton={InboxIcon}
          // onRight={() => {
          //   Actions.employeeCreate();
          // }}
          // navBar={}
          navBar={navbar}
          key="home"
          component={ArticleScreen}
          renderTitle={() => <AppLogo style={{alignSelf: 'center', flex: 1}} />}
          titleStyle={{textAlign: 'center', flex: 1}}

        /> */}
        
        <Scene key="Splash"  component={Splash}  />
        <Scene key="Auth"  component={Auth} >

          
        </Scene>
        <Scene key="SavedPatients" component={SavedPatients} />
        <Scene key="Diagnose" component={Diagnose} />
        <Scene key="AddPatient" component={AddPatient} />
        <Scene key="Signin" component={Signin} />
        <Scene key="Signup" component={Signup} />
        <Scene key="Home" initial={true} component={HomeScreen} />
        <Scene key="Image" component={ImageScreen} />
        <Scene key="Draw" component={Draw} />
         {/* <Scene key="Draw2" component={Draw2} /> */}
      </Scene>
    </Router>
  );
};
export default RouterComponent;
