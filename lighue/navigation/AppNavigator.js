import { createAppContainer, createStackNavigator } from 'react-navigation';
import ControlBulbScreen from '../screens/Lights/NewControlBulb';
import AddRoomScreen from '../screens/Rooms/AddRoomScreen';
import EditRoomScreen from '../screens/Rooms/EditRoomScreen';
import DefaultScreen from '../screens/Rooms/DefaultScreen';
import TestScreen from '../screens/TestScreen';
import LightDemo from '../screens/LightDemoMode';
import SettingsScreen from '../screens/Setting';
import AddSchedulesScreen from '../screens/Schedules/AddSchedules';
import CategoryScreen from '../screens/Schedules/CategoryList';
import ScheduleLocationScreen from '../screens/Schedules/LocationList';
import AddSceneScreen from '../screens/Scenes/AddScenes';
import PostUpdateScreen from '../screens/Miscellaneous/PostUpdateScreen';
import SceneLocationScreen from '../screens/Scenes/SceneLocationList';
import ControlRoomScreen from '../screens/Rooms/ControlRoomScreen';
import BridgeInfoScreen from '../screens/BridgeInfo';
import LightInfo from '../screens/Lights/BulbInfo';
import EditBulbScreen from '../screens/Lights/EditBulb';
import RoomTypeList from '../screens/Rooms/RoomTypeList';
import SearchScreen from '../screens/Lights/SearchBulb';
import ControlLightAdvanced from '../screens/Lights/ControlBulbAdvanced';
import { theme } from '../constants';
import {fromRight} from 'react-navigation-transitions';
const SetupNavigatorApp = createStackNavigator(
  {
    ListRoom: {
      screen: DefaultScreen
    },
    ControlBulb: {
      screen: ControlBulbScreen
    },
    AddRoom: {
      screen: AddRoomScreen
    },
    EditRoom: {
      screen: EditRoomScreen
    },
    TestScreen: {
      screen: TestScreen
    },
    SearchBulbScreen: {
      screen: SearchScreen
    },
    LightDemo: {
      screen: LightDemo
    },
    Settings: {
      screen: SettingsScreen
    },
    AddSchedules: {
      screen: AddSchedulesScreen
    },
    ControlBulbAdvanced : {
      screen : ControlLightAdvanced
    },
    ScheduleLocationListScreen: {
      screen: ScheduleLocationScreen
    },
    CategoryListScreen: {
      screen: CategoryScreen
    },
    RoomType : {
      screen : RoomTypeList
    },
    AddScenes: {
      screen: AddSceneScreen
    },
    SceneLocationListScreen : {
      screen : SceneLocationScreen
    },
    BridgeInfo : {
      screen : BridgeInfoScreen
    },
    PostUpdate: {
      screen: PostUpdateScreen
    },
    ControlRoom : {
      screen : ControlRoomScreen
    },
    BulbInfo : {
      screen : LightInfo
    },
    EditBulb : {
      screen : EditBulbScreen
  }
},
  {
    initialRouteName: "ListRoom",
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'transparent',
        opacity: 1,
        borderBottomColor: "transparent",
        elevation: 0, // for android
      },
      headerTransparent: true,
      headerBackTitle: null,
      headerLeftContainerStyle: {
        alignItems: 'center',
        marginLeft: theme.sizes.base * 2,
      },
      gesturesEnabled: false,
    },
  }
);

const SetupNavigator = createAppContainer(SetupNavigatorApp);

export default SetupNavigator;
