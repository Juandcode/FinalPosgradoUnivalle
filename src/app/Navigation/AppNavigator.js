import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import Login from "../../feature/Login";
import BooksPages from "../../feature/books/BooksPage";
import {auth} from "../../config/firebase";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {
    loadingLoginChanged,
    selectLoadingLoginChanged,
    selectUserChanged,
    userChanged
} from "../../feature/books/booksSlice";
import {
    getAuth,
    setPersistence,
    signInWithEmailAndPassword,
    browserSessionPersistence,
    onAuthStateChanged,
    browserLocalPersistence
} from 'firebase/auth';
import * as SplashScreen from "expo-splash-screen/build/index";
import {useColorScheme} from "nativewind";
import Button from "../../components/Button";
import {signOut} from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import Register from "../../feature/Register";
import BookPage from "../../feature/books/BookPage";
import TabNavigator from "./TabNavigator";
import {Dimensions} from "react-native";
import {CollectionsRemovedAll} from "../../feature/books/CollectionSlice";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

    const dispatch = useDispatch();
    const currentUser = useSelector(selectUserChanged);
    const loading = useSelector(selectLoadingLoginChanged);

    const {colorScheme, setColorScheme, toggleColorScheme} = useColorScheme();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("---------user------------");
                console.log(user);
                dispatch(userChanged(user.email));
            }
            console.log("cambio");
            SplashScreen.hide();
            dispatch(loadingLoginChanged(false));
        });

        return () => unsubscribe();
    }, [dispatch]);


    if (loading) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator id="RootStack" initialRouteName={currentUser ? "Books" : "Login"}
                             screenOptions={{
                                 headerShown: false,
                                 headerStyle: {
                                     backgroundColor: 'transparent',
                                     width: Dimensions.get('window').width,
                                 },
                                 headerTitleStyle: {
                                     fontSize: 20,
                                     fontFamily: 'Nunito-Bold',
                                     color: colorScheme === "light" ? "black" : "white"
                                 },
                             }}>
                {!currentUser ? (
                        <>
                            <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                            <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
                        </>
                    )
                    :
                    <>
                        <Stack.Screen name="Books" component={TabNavigator} options={{
                            headerRight: () => (
                                <Ionicons style={{marginRight: 0}} name="exit-outline" size={22} color={colorScheme === "light" ? "gray" : "white"}
                                          onPress={async () => {
                                              dispatch(CollectionsRemovedAll());
                                              await signOut(auth);
                                              dispatch(userChanged(null));
                                          }}/>
                            ),
                            headerShown: true,
                        }}/>
                        <Stack.Screen name="Details" component={BookPage} options={{
                            headerShown: true,
                        }}/>
                    </>}
            </Stack.Navigator>
        </NavigationContainer>
    )
}
