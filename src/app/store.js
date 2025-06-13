import {configureStore} from "@reduxjs/toolkit";
import booksReducer from "../feature/books/booksSlice";
import collectionReducer from "../feature/books/CollectionSlice";


export default configureStore({
    reducer: {
        books: booksReducer,
        collection: collectionReducer
    }
})
