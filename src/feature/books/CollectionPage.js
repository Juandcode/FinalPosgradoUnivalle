import {View} from "react-native";
import {useEffect} from "react";
import {collection, getDocs} from 'firebase/firestore';
import {db, auth} from "../../config/firebase";
import {useDispatch, useSelector} from "react-redux";
import {ScrollView} from "react-native-gesture-handler";
import CardBook from "../../components/CardBook";
import {CollectionsAdded, SelectCollections} from "./CollectionSlice";

export default function CollectionPage({navigation}) {

    const dispatch = useDispatch();
    const listaCollections = useSelector(SelectCollections);

    useEffect(() => {
        const getCollections = async () => {
            console.log("getCollections");
            const booksRef = collection(db, 'usuarios', auth.currentUser.uid, 'books')
            const querySnapshot = await getDocs(booksRef);

            // Mapear los documentos a un array de objetos
            const lista = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            dispatch(CollectionsAdded(lista));
            console.log(lista);
        }
        getCollections();
    }, []);
    return (
        <View className="flex flex-1 bg-primary items-center justify-center p-4">
            <ScrollView contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 40,
                justifyContent: 'center',
                marginVertical: 10,
            }}>

                {listaCollections.map((book, index) => (
                    <CardBook book={book} key={index} uri={book.portadaUrl}
                              onPress={() => navigation.navigate('Details', {id: book.id, added: true})}/>
                ))}
                {listaCollections.length / 2 !== 0 && (
                    <View style={{width: 140, height: 200}} className="bg-primary"/>)}

            </ScrollView>
        </View>
    )
}
