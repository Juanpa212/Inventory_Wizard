import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/loginScreen";
import InventoryEditor from "./src/screens/InventoryEditor";
import generalStart from "./src/screens/generalStartScreen";

const navigator = createStackNavigator(
  {
    home: HomeScreen,
    login: LoginScreen,
    editor: InventoryEditor,
    start_1 : generalStart,
  },
  {
    initialRouteName: "home",
    defaultNavigationOptions: {
      title: "App",
    },
  }
);

export default createAppContainer(navigator);
