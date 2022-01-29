import React from "react"; 

import { StyleSheet, Text, View, Image} from "react-native";
// import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreens from "./screens/LoginScreens";
import ActivityRegisterScreen from "./screens/ActivityRegisterScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import FindScreen from "./screens/FindScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { UserContext } from "./context/UserContext";
import { TouchableOpacity } from "react-native";
import { ConfigContext } from "./context/ConfigContext";
import { db } from './firebase';	

import { collection, getDocs, doc, setDoc } from "firebase/firestore/lite";
import { ListUserContext } from "./context/ListUserContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthent, setIsAuthent] = React.useState(false);
  const [data, setData] = React.useState({});
  const [dataUser, setDataUsers] = React.useState({});

  const Tab = createBottomTabNavigator();

  const getData = async () => {
    console.log('se ejecuto')
    const confs = collection(db,'configuraciones');
    const confsSnap = await getDocs(confs);
    const data = confsSnap.docs.map(doc=>doc.data());
    setData(data[0].tipos.map(conf=>conf));
  }
  const getDataUsers = async () => {
    console.log('se ejecuto usuarios lista')
    const confs = collection(db,'users');
    const confsSnap = await getDocs(confs);
    const data = confsSnap.docs.map(doc=>doc.data());
    setDataUsers(data);
  }
  
  React.useEffect(() => {
    getDataUsers();
  }, []);

  React.useEffect(() => {
    getData();
  }, []);

  const CustomTabBarButton = ({children, onPress})=>(
    <TouchableOpacity
      style={{
        top:-20,
        justifyContent: 'center',
        alignItems: 'center',
        ... styles.shadow
      }}
      onPress={onPress}
    >

      <View
        style={{
          width: 65,
          height: 65,
          borderRadius: 35,
          backgroundColor: '#e32f45',
        }}
      >{children}</View>
    </TouchableOpacity>
  );
  const Tabs = () => {
    return (
      <Tab.Navigator
      screenOptions={{ 
        tabBarShowLabel: false,
        tabBarStyle: {
         position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          borderRadius: 15,
          height: 60,
         backgroundColor: '#fff',
         ... styles.shadow
          
        } }}
      >
        <Tab.Screen name="Buscar" component={FindScreen} 
          backgroundColor={'red'}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
                <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
                  <Image
                    source={require("./assets/icons/find.png")}
                    resizeMode='contain'
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: focused ? "#332f45" : "#748c94"
                    }}
                  />
                  <Text></Text>
                </View>
              ),
          }}
        />
        <Tab.Screen name="Proyectos" component={ActivityRegisterScreen} 
          onPress={{getData, getDataUsers}}
          options={{
            tabBarIcon: ({ focused }) => (
            <Image
              source={require("./assets/icons/plus.png")}
              resizeMode='contain'
              style={{
                width: 30,
                height: 30,
                tintColor:'#fff' 
              }}
            />
              ),
              tabBarButton: (props) => (
                <CustomTabBarButton {...props} />
              )
          }}
        />
        <Tab.Screen name="Cuenta" component={ProfileScreen} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
              <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
                <Image
                  source={require("./assets/icons/account.png")}
                  resizeMode='contain'
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? "#332f45" : "#748c94"
                  }}
                />
                <Text></Text>
              </View>
            ),
        }}/>
      </Tab.Navigator>
    );
  };

  return (
    
    <UserContext.Provider value={{isAuthent, setIsAuthent}}>
        <ConfigContext.Provider value={{data,setData}}>
        <ListUserContext.Provider value={{dataUser,setDataUsers}}>
      <NavigationContainer>
        {isAuthent === false ? (
          <Stack.Navigator>
              <Stack.Screen
                screenOptions={{
                  headerStyle: { height: 100, backgroundColor: "black" },
                }}
                options={{ headerShown: false }}
                name="Login"
                component={LoginScreens}
              />

            <Stack.Screen
              options={{ headerShown: false }}
              name="RegisterScreen"
              component={RegisterScreen}
            />
          </Stack.Navigator>
        ) : (
          <Tabs />
        )}
      </NavigationContainer>
      </ListUserContext.Provider>
      </ConfigContext.Provider>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  }
});