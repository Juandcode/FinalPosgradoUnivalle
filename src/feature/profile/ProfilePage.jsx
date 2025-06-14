import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View, Image} from "react-native";
import {ErrorMessage, Formik} from "formik";
import TextTile from "../../components/TextTitle";
import TextError from "../../components/TextError";
import {MaterialIcons} from "@expo/vector-icons";
import {object, string} from "yup";
import Button from "../../components/Button";
import {updatePassword, EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";
import {auth, db, storage} from "../../config/firebase";
import {doc, getDoc, setDoc, runTransaction} from 'firebase/firestore';
import {useEffect, useState} from "react";
import {ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage';
import TextCustom from "../../components/TextCustom";
import Ionicons from "@expo/vector-icons/Ionicons";
import {BaseButton, BorderlessButton, RectButton, ScrollView} from "react-native-gesture-handler";
import {useColorScheme} from "nativewind";
import {colorsName} from "../../theme";
import * as ImagePicker from "expo-image-picker";

export default function ProfilePage() {

    const [profile, setProfile] = useState({nombre: '', apellido: ''});

    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

    const {colorScheme, setColorScheme, toggleColorScheme} = useColorScheme();

    const selectAndUploadImage = async () => {
        try {
            // const testBlob = new Blob(['Hola Firebase'], {type: 'text/plain'});
            // const testRef = ref(storage, 'prueba.txt');
            // await uploadBytes(testRef, testBlob);

            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert(
                    'Permisos necesarios',
                    'La app necesita permisos para acceder a tus fotos'
                );
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'videos'], // Solo imágenes
                allowsEditing: true,   // Permitir edición/recorte
                aspect: [1, 1],        // Aspecto cuadrado
                quality: 0.8,          // Calidad de imagen (80%)
            });

            if (result.canceled) {
                return;
            }

            const selectedImage = result.assets[0];

            const response = await fetch(selectedImage.uri);
            const blob = await response.blob();
            console.log(blob);

            await deleteObject(storageRef);

            const fileName = `images/demo_image_${auth.currentUser.uid}.jpg`;
            const storageRef = ref(storage, fileName);

            console.log(storageRef);

            const snapshot = await uploadBytes(storageRef, blob);

            console.log(snapshot);

            const downloadURL = await getDownloadURL(storageRef);

            console.log(downloadURL);

            setUploadedImageUrl(downloadURL);

        } catch (err) {
            console.log('❌ Error en el proceso:', error);

            Alert.alert(
                'Error',
                'Hubo un problema al cargar la imagen. Verifica que el emulador esté funcionando.',
                [{text: 'OK'}]
            );
        }
    }

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
        <View className="flex-1 justify-center bg-primary">
            <ScrollView showsVerticalScrollIndicator={false} className="p-12">
                <TextTile title={'Perfil1'}/>
                <View style={{width: '100%', height: 'auto', marginBottom: 32, alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress={selectAndUploadImage}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 80,
                            marginBottom: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderStyle: 'dashed',
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                            borderWidth: 1,
                            borderColor: colorScheme === "light" ? colorsName.primaryLightBrand : colorsName.primaryDarkBrand,
                        }}
                        className="border-secondary border-hairline">
                        {uploadedImageUrl ? <Image style={{width: '100%', height: '100%', borderRadius: 80}}
                                                   source={{uri: uploadedImageUrl}}/> :
                            <Ionicons name="camera" size={32} color={colorScheme === "light" ? "gray" : "white"}/>}
                    </TouchableOpacity>
                </View>
                <Formik
                    initialValues={{
                        nombre: profile.nombre,
                        apellido: profile.apellido,
                        currentPassword: '',
                        password: ''
                    }}
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
                            <View className="mb-8"/>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </View>
    )
}
