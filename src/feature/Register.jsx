import {ErrorMessage, Formik} from "formik";
import {ActivityIndicator, Alert, Text, TextInput, View} from "react-native";
import {object, string, ref} from 'yup';
import TextTile from "../components/TextTitle";
import colors from "tailwindcss/colors";
import {MaterialIcons} from "@expo/vector-icons";
import Button from "../components/Button";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from "../config/firebase";
import TextCustom from "../components/TextCustom";
import TextError from "../components/TextError";

export default function Register({navigation}) {

    return (
        <View className="flex-1 bg-header justify-center p-12">
            <Formik
                initialValues={{email: '', password: '', password2: ''}}
                validationSchema={object({
                    email: string().email('Email invalido').required("Email requerido."),
                    password: string().min(8, "Minimo 6 caracteres")
                        .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=.*\d)/, "La contraseña tiene que tener una letra minuscula, una mayuscula y un simbolo.")
                        .required("Password requerido."),
                    password2: string().required("Repeticion de contraseña requerido.").oneOf([ref("password")], "Las contraseñas no coinciden"),
                })}
                onSubmit={async (values) => {
                    try {
                        await createUserWithEmailAndPassword(auth, values.email, values.password);
                        //navigation.pop();
                    } catch (error) {
                        Alert.alert('Login', 'Error al loguearse, intente nuevamente.', [
                            {
                                text: 'OK', onPress: () => {
                                }
                            },
                        ]);
                        console.log(error.message);
                    }

                }}>
                {({handleSubmit, handleBlur, touched, handleChange, values, errors, isSubmitting}) => (
                    <View>
                        <TextTile title={"Registro"}/>
                        <View className="flex-row items-center border-secondary border-hairline rounded-lg mb-4">
                            <TextInput
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoCorrect={false}
                                textContentType="emailAddress"
                                onBlur={handleBlur("email")}
                                onChangeText={handleChange("email")}
                                value={values.email}
                                placeholder="Email"
                                className="flex-1 p-4 text-secondary font-nunito text-root"/>
                            {touched.email &&
                                <MaterialIcons style={{width: 24, marginRight: 10}}
                                               name={errors.email ? "close" : "gpp-good"}
                                               size={24}
                                               color={errors.email ? "red" : "green"}
                                />
                            }
                        </View>
                        <View className="flex-row items-center border-secondary border-hairline rounded-lg mb-4">
                            <TextInput
                                autoCapitalize="none"
                                keyboardType="default"
                                autoCorrect={false}
                                secureTextEntry={true}
                                textContentType="password"
                                onBlur={handleBlur("password")}
                                onChangeText={handleChange("password")}
                                value={values.password}
                                placeholder="Contraseña"
                                className="flex-1 p-4 text-secondary font-nunito text-root"/>
                            {touched.password &&
                                <MaterialIcons style={{width: 24, marginRight: 10}}
                                               name={errors.password ? "close" : "gpp-good"}
                                               size={24}
                                               color={errors.password ? "red" : "green"}
                                />
                            }
                        </View>
                        <View className="flex-row items-center border-secondary border-hairline rounded-lg mb-4">
                            <TextInput
                                autoCapitalize="none"
                                keyboardType="default"
                                autoCorrect={false}
                                secureTextEntry={true}
                                textContentType="password"
                                onBlur={handleBlur("password2")}
                                onChangeText={handleChange("password2")}
                                value={values.password2}
                                placeholder="Contraseña"
                                className="flex-1 p-4 text-secondary font-nunito text-root"/>
                            {touched.password2 &&
                                <MaterialIcons style={{width: 24, marginRight: 10}}
                                               name={errors.password2 ? "close" : "gpp-good"}
                                               size={24}
                                               color={errors.password2 ? "red" : "green"}
                                />
                            }
                        </View>
                        {errors.email && <TextError text={<ErrorMessage name="email"/>}/>}
                        {errors.password && <TextError text={<ErrorMessage name="password"/>}/>}
                        {errors.password2 && <TextError text={<ErrorMessage name="password2"/>}/>}
                        <View className="mb-4"/>
                        {isSubmitting ? <ActivityIndicator size="large" className="color-secondary"/> : <View>
                            <Button onPress={() => handleSubmit()} text={"Registrarse"}/>
                            <View className="mb-4"/>
                            <Button onPress={() => navigation.pop()} text={"Login"}/>
                        </View>}
                    </View>)}
            < /Formik>
        </View>
    )
}
