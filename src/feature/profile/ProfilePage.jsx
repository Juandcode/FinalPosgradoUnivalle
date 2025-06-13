import {ActivityIndicator, Alert, Text, TextInput, View} from "react-native";
import {ErrorMessage, Formik} from "formik";
import TextTile from "../../components/TextTitle";
import TextError from "../../components/TextError";
import {MaterialIcons} from "@expo/vector-icons";
import {object, ref, string} from "yup";
import Button from "../../components/Button";
import {updatePassword, EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";
import {auth, db} from "../../config/firebase";
import {doc, getDoc, setDoc, runTransaction} from 'firebase/firestore';
import {useEffect, useState} from "react";

export default function ProfilePage() {

    const [profile, setProfile] = useState({nombre: '', apellido: ''});

    useEffect(() => {
        const getUserData = async () => {
            const docRef = doc(db, 'usuarios', auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log(docSnap.data());
                setProfile(docSnap.data());
            }
        }
        getUserData();
    }, []);

    return (
        <View className="flex-1 p-12 justify-center bg-primary">
            <Formik initialValues={{nombre: profile.nombre, apellido: profile.apellido, currentPassword: '', password: ''}}
                    validationSchema={object({
                        nombre: string().required("Nombre requerido."),
                        currentPassword: string().required("Contraseña actual requerida"),
                        password: string().min(8, "Minimo 6 caracteres")
                            .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=.*\d)/, "La contraseña tiene que tener una letra minuscula, una mayuscula y un simbolo.")
                            .required("Password requerido."),
                        apellido: string().required("Apellido requerido."),
                    })}
                    onSubmit={async (values, {resetForm}) => {
                        try {

                            await setDoc(doc(db, 'usuarios', auth.currentUser.uid), {
                                nombre: values.nombre,
                                apellido: values.apellido,
                            });

                            const credential = EmailAuthProvider.credential(
                                auth.currentUser.email,
                                values.currentPassword,
                            );
                            await reauthenticateWithCredential(auth.currentUser, credential);

                            await updatePassword(auth.currentUser, values.password);

                            resetForm({
                                values: {
                                    ...values,
                                    password: '',
                                    currentPassword: ''
                                }
                            });

                            Alert.alert('Perfil', 'Perfil actualizado con exito.', [
                                {
                                    text: 'OK', onPress: () => {
                                    }
                                },
                            ]);
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Perfil', 'Error al actualizar el perfil.', [
                                {
                                    text: 'OK', onPress: () => {
                                    }
                                },
                            ]);
                        }
                    }}>
                {({isSubmitting, values, handleSubmit, handleChange, errors, handleBlur, touched}) => (
                    <View>
                        <TextTile title={'Perfil'}/>
                        <View className="flex-row items-center mb-8 rounded-lg border-hairline border-secondary">
                            <TextInput
                                className="flex-1 p-3 text-secondary font-nunito text-root"
                                value={profile.nombre}
                                onChangeText={handleChange('nombre')}
                                onBlur={handleBlur('nombre')}
                                placeholder="Nombre"
                                autoCapitalize="none"
                                keyboardType="default"
                                autoCorrect={false}
                            />
                            {touched.nombre && <MaterialIcons style={{width: 24, marginRight: 10}}
                                                              name={errors.nombre ? "close" : "gpp-good"}
                                                              size={24}
                                                              color={errors.nombre ? "red" : "green"}/>
                            }
                        </View>
                        <View className="flex-row items-center mb-8 rounded-lg border-hairline border-secondary">
                            <TextInput
                                className="flex-1 p-3 text-secondary font-nunito text-root"
                                value={values.apellido || profile.apellido}
                                onChangeText={handleChange('apellido')}
                                onBlur={handleBlur('apellido')}
                                placeholder="Apellido"
                                autoCapitalize="none"
                                keyboardType="default"
                                autoCorrect={false}
                            />
                            {touched.apellido && <MaterialIcons style={{width: 24, marginRight: 10}}
                                                                name={errors.apellido ? "close" : "gpp-good"}
                                                                size={24}
                                                                color={errors.apellido ? "red" : "green"}/>
                            }
                        </View>
                        <View className="flex-row items-center mb-8 rounded-lg border-hairline border-secondary">
                            <TextInput
                                className="flex-1 p-3 text-secondary font-nunito text-root"
                                value={values.currentPassword}
                                onChangeText={handleChange('currentPassword')}
                                onBlur={handleBlur('currentPassword')}
                                placeholder="Contraseña actual"
                                autoCapitalize="none"
                                textContentType="password"
                                autoCorrect={false}
                                secureTextEntry={true}
                            />
                            {touched.currentPassword && <MaterialIcons style={{width: 24, marginRight: 10}}
                                                                       name={errors.currentPassword ? "close" : "gpp-good"}
                                                                       size={24}
                                                                       color={errors.currentPassword ? "red" : "green"}/>
                            }
                        </View>
                        <View className="flex-row items-center mb-8 rounded-lg border-hairline border-secondary">
                            <TextInput
                                className="flex-1 p-3 text-secondary font-nunito text-root"
                                value={values.password}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                placeholder="Nueva contraseña"
                                autoCapitalize="none"
                                textContentType="password"
                                autoCorrect={false}
                                secureTextEntry={true}
                            />
                            {touched.password && <MaterialIcons style={{width: 24, marginRight: 10}}
                                                                name={errors.password ? "close" : "gpp-good"}
                                                                size={24}
                                                                color={errors.password ? "red" : "green"}/>
                            }
                        </View>
                        {errors.nombre && <TextError text={<ErrorMessage name="nombre"/>}/>}
                        {errors.apellido && <TextError text={<ErrorMessage name="apellido"/>}/>}
                        {errors.currentPassword && <TextError text={<ErrorMessage name="currentPassword"/>}/>}
                        {errors.password && <TextError text={<ErrorMessage name="password"/>}/>}
                        <View className="mb-4"/>
                        {
                            isSubmitting ? <ActivityIndicator size="large" className="color-secondary"/> :
                                <View>
                                    <Button onPress={() => handleSubmit()} text={"Actualizar"}/>
                                </View>
                        }
                    </View>
                )}
            </Formik>
        </View>
    )
}
