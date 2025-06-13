import {SafeAreaView} from "react-native-safe-area-context";
import {View, Text, TextInput, StyleSheet, Alert, ActivityIndicator} from "react-native";
import {ErrorMessage, Formik} from "formik";
import * as Yup from "yup";
import {MaterialIcons} from "@expo/vector-icons";
import {RectButton} from "react-native-gesture-handler";
import Button from "../components/Button";
import {useDispatch} from "react-redux";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithRedirect,
    OAuthProvider,
    FacebookAuthProvider
} from 'firebase/auth';
import {auth} from "../config/firebase";
import {userChanged} from "./books/booksSlice";
import TextTile from "../components/TextTitle";
import TextCustom from "../components/TextCustom";
import TextError from "../components/TextError";


export default function Login({navigation}) {

    const dispatch = useDispatch();

    //console.log(auth.currentUser);
    const submit = async (user, pass) => {
        try {
            const login = await signInWithEmailAndPassword(auth, user, pass);
        } catch (err) {
            Alert.alert('Login', 'Error al loguearse, intente nuevamente.', [
                {
                    text: 'OK', onPress: () => {
                    }
                },
            ]);
        }
    }

    const googleLogin = async () => {
        console.log("googleLogin");
        //const result = await signInWithPopup(auth, new GoogleAuthProvider());

        signInWithPopup(auth, new FacebookAuthProvider())
            .then((result) => {
                console.log(result);
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
            console.log(error);
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    return (
        <View className="flex-1 bg-header justify-center p-12">
            <Formik initialValues={{email: '', password: ''}}
                    validationSchema={Yup.object({
                        email: Yup.string().email("Email invalido").required('Email requerido'),
                        password: Yup.string().required('Contraseña requerida'),
                    })}
                    onSubmit={async (values, {setErrors}) => {
                        await submit(values.email, values.password);
                    }}
            >
                {({isSubmitting, handleSubmit, handleChange, errors, touched, values, handleBlur}) => (
                    <View>
                        <TextTile title={'Bienvenido'}/>
                        <View
                            className="flex-row items-center mb-8 rounded-lg border-hairline border-secondary">
                            <TextInput className="flex-1 text-secondary p-4 font-nunito text-root"
                                       placeholder="Email"
                                       autoCapitalize="none"
                                       keyboardType="email-address"
                                       autoCorrect={false}
                                       onChangeText={handleChange('email')}
                                       value={values.email}
                                       onBlur={handleBlur('email')}
                                       textContentType="emailAddress"/>
                            {touched.email && <MaterialIcons style={{width: 24, marginRight: 10}}
                                                             name={errors.email ? "close" : "gpp-good"}
                                                             size={24}
                                                             color={errors.email ? "red" : "green"}
                            />}

                        </View>
                        <View
                            className="flex-row items-center mb-8 rounded-lg border-hairline border-secondary">
                            <TextInput className="flex-1 text-secondary p-4 text-root"
                                       placeholder="Password"
                                       autoCapitalize="none"
                                       secureTextEntry
                                       autoCorrect={false}
                                       value={values.password}
                                       onChangeText={handleChange('password')}
                                       onBlur={handleBlur('password')}
                                       textContentType="Password"/>
                            {touched.password && <MaterialIcons style={{width: 24, marginRight: 10}}
                                                                name={errors.password ? "close" : "gpp-good"}
                                                                size={24}
                                                                color={errors.password ? "red" : "green"}
                            />}
                        </View>
                        {errors.email && <TextError text={<ErrorMessage name="email"/>}/>}
                        {errors.password && <TextError text={<ErrorMessage name="password"/>}/>}
                        <View className="mb-4"/>
                        {isSubmitting ? <ActivityIndicator size="large" className="color-secondary"/> : <View>
                            <Button onPress={() => handleSubmit()} text={"Login"}/>
                            <View className="mb-4"/>
                            <Button onPress={() => navigation.navigate("Register")} text={"Register"}/>
                        </View>}
                    </View>
                )}
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: "bold",
        fontSize: 18,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
    },
    icon: {
        marginRight: 10, // Espacio entre ícono y input
        width: 24,       // Ancho fijo para alinear inputs
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 16,

    },
    button: {
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        elevation: 2,
        backgroundColor: "#2f95dc",
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },

})
