import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Footer from "../Components/footer";
import HomeScreen from "../screens/home";
import ProfileScreen from "../screens/profile";
import DocumentsScreen from "../screens/documents";
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      tabBar={(props) => <Footer {...props} />}
    >
      <Tab.Screen name="home" component={HomeScreen} options={{headerShown:false}}/>
      <Tab.Screen name="profile" component={ProfileScreen} options={{headerShown:false}}/>
      <Tab.Screen name="documents" component={DocumentsScreen} options={{headerShown:false}}/>
      {/* Add more Tab.Screen components as needed */}
    </Tab.Navigator>
  );
}
export default MainTabs;
