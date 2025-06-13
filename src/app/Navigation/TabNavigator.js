import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Register from "../../feature/Register";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProfilePage from "../../feature/profile/ProfilePage";
import BooksPages from "../../feature/books/BooksPage";
import {signOut} from "firebase/auth";
import {auth} from "../../config/firebase";
import {userChanged} from "../../feature/books/booksSlice";
import {useColorScheme, vars} from "nativewind";
import {View, StyleSheet} from "react-native";
import colors from "tailwindcss/colors";
import tailwindConfig from '../../../tailwind.config';
import {colorsName} from "../../theme";
import CollectionPage from "../../feature/books/CollectionPage";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {

    const {colorScheme, setColorScheme, toggleColorScheme} = useColorScheme();

    return (
        <Tab.Navigator id="TabNavigator" initialRouteName="Home" screenOptions={{
            tabBarStyle: {
                backgroundColor: colorScheme === "dark" ? colorsName.headerDarkBrand : colorsName.headerLightBrand, // Fondo blanco semitransparente
                height: 60,
                borderTopWidth: 0,
                elevation: 0,
            },
            tabBarLabelStyle: {
                fontFamily: 'Nunito-Bold',
            },
            headerShown: false,
            headerStyle: {
                height: 50,
                backgroundColor: colorsName.headerDarkBrand,
            },
            headerTitleStyle: {
                fontSize: 20,
                paddingBottom: 70,
                fontFamily: 'Nunito-Bold',
                color: colorScheme === "light" ? "black" : "white"
            },
            headerRight: () => (
                <Ionicons name="exit-outline" style={{marginRight: 10, paddingBottom: 70,}} size={27} color="white"
                          onPress={async () => {
                              await signOut(auth);
                              dispatch(userChanged(null));
                          }}/>
            ),
        }}>
            <Tab.Screen name="Home" component={BooksPages} options={{
                tabBarLabel: "Libros",
                tabBarIcon: ({color}) => (
                    <Ionicons name="home" size={22} color={color}/>
                )
            }}/>
            <Tab.Screen name="Collection" component={CollectionPage} options={{
                tabBarLabel: "Colleccion",
                tabBarIcon: ({color}) => (
                    <Ionicons name="book" size={22} color={color}/>
                )
            }}/>
            <Tab.Screen name="Profile" component={ProfilePage} options={{
                tabBarLabel: "Profile",
                tabBarIcon: ({color}) => (
                    <Ionicons name="person" size={22} color={color}/>
                )
            }}/>
        </Tab.Navigator>
    )
}
