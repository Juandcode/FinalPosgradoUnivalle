import {StatusBar} from 'expo-status-bar';
import {Appearance, StyleSheet, Text, View} from 'react-native';
import './global.css'
import colors from "tailwindcss/colors";
import {useFonts} from 'expo-font';
import {vars, useColorScheme} from 'nativewind';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useEffect} from "react";
import AppNavigator from "./src/app/Navigation/AppNavigator";
import {Provider} from "react-redux";
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import store from './src/app/store';
import * as SplashScreen from "expo-splash-screen";
import {themes} from "./src/theme";

// 2. Componente Theme que aplica las variables
function Theme({name, children}) {
    const {colorScheme, setColorScheme, toggleColorScheme} = useColorScheme();
    useEffect(() => {
        setColorScheme("system");
    }, []);


    return (
        <SafeAreaProvider className="color-primary">
            <SafeAreaView className="flex flex-1 bg-header" style={[themes[name][colorScheme]]}>
                {children}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
    duration: 2000,
    fade: true,
});

// 4. Uso en la app
export default function App() {
    const [loaded, error] = useFonts({
        "Nunito-Bold": require('./assets/fonts/Nunito-Bold.ttf'),
        "Nunito-ExtraBold": require('./assets/fonts/Nunito-ExtraBold.ttf'),
        "Nunito-ExtraLight": require('./assets/fonts/Nunito-ExtraLight.ttf'),
        "Nunito-Light": require('./assets/fonts/Nunito-Light.ttf'),
        "Nunito-Regular": require('./assets/fonts/Nunito-Regular.ttf'),
    });


    return (
        <Provider store={store}>
        <Theme name="brand">
            <GestureHandlerRootView>
                <AppNavigator/>
            </GestureHandlerRootView>
        </Theme>
        </Provider>
    );
}

