import {View, Text, Image, Alert, ActivityIndicator} from "react-native";
import {useEffect, useReducer, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectAll, selectById} from "./booksSlice";
import TextCustom from "../../components/TextCustom";
import {ScrollView} from "react-native-gesture-handler";
import TextTile from "../../components/TextTitle";
import Button from "../../components/Button";
import {doc, getDoc, setDoc, deleteDoc} from "firebase/firestore";
import {auth, db} from "../../config/firebase";
import {bookAddedCollection, bookRemovedCollection} from "./CollectionSlice";

export default function BookPage({route, navigation}) {
    const {id, added} = route.params;
    const dispatch = useDispatch();
    const book = useSelector((state) => selectById(state, id));
    const [alreadyAddedToCollection, setAlreadyAddedToCollection] = useState(true);
    const [loadingAdded, setLoadingAdded] = useState(false);

    const eliminarBookLibreria = async() => {
        const bookRef = doc(db, 'usuarios', auth.currentUser.uid, 'books', book.id);
        await deleteDoc(bookRef);
        dispatch(bookRemovedCollection(book.id));
        navigation.pop();
    }

    useEffect(() =>
        console.log(book), [book]);

    useEffect(() => {
        const verifyAlreadyAddedtoCollection = async () => {
            setLoadingAdded(true);
            const docRef = doc(db, 'usuarios', auth.currentUser.uid, 'books', book.id);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                setAlreadyAddedToCollection(false);
            }
            setLoadingAdded(false);
        }
        verifyAlreadyAddedtoCollection();
    }, []);

    const addFavorite = async () => {
        //const docRef = doc(db, 'libraries', auth.currentUser.uid, 'books');
        //const docSnap = await getDoc(docRef);
        setLoadingAdded(true);
        try {
            const libro = {
                titulo: book.title,
                descripcion: book.description,
                autor: book.authors[0],
                portadaUrl: book.imageLinks.thumbnail,
            }
            await setDoc(doc(db, 'usuarios', auth.currentUser.uid, 'books', book.id), libro);

            dispatch(bookAddedCollection({...libro, id: book.id}))
            setAlreadyAddedToCollection(true);
            Alert.alert('Exito', 'Libro agregado a la coleccion.', [
                {
                    text: 'OK', onPress: () => {
                    }
                },
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Error al agregar libro a la coleccion.', [
                {
                    text: 'OK', onPress: () => {
                    }
                },
            ]);
        }
        setLoadingAdded(false);
    }

    return (
        <View className="flex flex-1 bg-primary items-center justify-center p-4">
            <TextCustom text={`Nombre Libro: ${book.title} `}/>
            <View className="mb-4"/>
            <Image style={{opacity: 1, height: 200, width: 200}}
                   source={{uri: book.imageLinks.thumbnail}}/>
            <ScrollView showsVerticalScrollIndicator={true} style={{opacity: 1, height: 50}}>
                <TextCustom text={book.description}/>
            </ScrollView>
            <View className="mb-4"/>
            {added ? <Button onPress={eliminarBookLibreria} text={'Eliminar libro'}/> : (loadingAdded ?
                <ActivityIndicator size="large" className="color-secondary"/> : (!alreadyAddedToCollection &&
                    <Button onPress={addFavorite} text={'Agregar a libreria'}/>))}
        </View>
    )
}
