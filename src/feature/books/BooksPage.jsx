import TextCustom from "../../components/TextCustom";
import {Text, View, Image, TextInput, ActivityIndicator} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {
    getBooks,
    getSearchBooks,
    selectAll,
    selectLoadingGettingBooksChanged,
    selectLoadingLoginChanged
} from "./booksSlice";
import {ScrollView} from "react-native-gesture-handler";
import {colors} from "tailwindcss/colors";
import CardBook from "../../components/CardBook";
import useDebounce from "../../components/hooks/useDebounce";


export default function BooksPages({navigation}) {

    const dispatch = useDispatch();
    const loadingBooks = useSelector(selectLoadingGettingBooksChanged);
    const [value, setValue] = useState("");
    const debounceValue = useDebounce(value, 500);
    const books = useSelector(selectAll);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(debounceValue);
        if (debounceValue === "") {
            dispatch(getBooks());
        } else {
            dispatch(getSearchBooks(debounceValue));
        }
    }, [debounceValue]);

    useEffect(() => {
        dispatch(getBooks());
    }, []);

    //console.log(books);
    return (
        <View className="flex-1 bg-primary ">
            <TextInput
                onChangeText={(text) => setValue(text)}
                placeholder={"Buscar libro..."}
                className="p-3 h-12 border-secondary mb-4 mt-4 mr-8 ml-8 border-hairline rounded-lg font-nunito text-root text-secondary"
            />
            {loadingBooks === false && books.length === 0 &&
                <View className="flex flex-1 justify-center items-center">
                    <TextCustom text={"No hay libros"}/>
                </View>
            }
            {loadingBooks ?
                <ActivityIndicator size="large" className="flex-1 color-secondary border-header"/> :
                <ScrollView contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 40,
                    justifyContent: 'center',
                    marginVertical: 10,
                }}>

                    {books.map((book, index) => (
                        <CardBook book={book} key={index} uri={book.imageLinks.thumbnail}
                                  onPress={() => navigation.navigate('Details', {id: book.id, added: false})}/>
                    ))}
                    {books.length / 2 !== 0 && (<View style={{width: 140, height: 200}} className="bg-primary"/>)}

                </ScrollView>}
        </View>
    )
}
