import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";


const collectionAdapter = createEntityAdapter({
    selectId: book => book.id,
    sortComparer: (a, b) => a.titulo.localeCompare(b.titulo),
})

const initialState = collectionAdapter.getInitialState({
    loading: false,
})

const collectionSlice = createSlice({
    name: "collections",
    initialState,
    reducers: {
        bookAddedCollection: (state, {payload}) => {
            collectionAdapter.addOne(state, payload)
        },
        bookRemovedCollection: (state, {payload}) => {
            collectionAdapter.removeOne(state, payload)
        },
        CollectionsAdded: (state, {payload}) => {
            collectionAdapter.addMany(state, payload)
        },
        CollectionsRemovedAll: (state) => {
            collectionAdapter.setAll(state, []);
        }
    },
});


export const {
    bookAddedCollection,
    bookRemovedCollection,
    CollectionsAdded,
    CollectionsRemovedAll
} = collectionSlice.actions;
export const {
    selectAll: SelectCollections,
    selectById: SelectByIdCollection
} = collectionAdapter.getSelectors(state => state.collection);

export default collectionSlice.reducer;
