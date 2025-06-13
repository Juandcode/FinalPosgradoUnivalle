import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";


export const getSearchBooks = createAsyncThunk("books/searchBook", async (search, {dispatch, getState}) => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'hola');

    const response = await fetch("https://reactnd-books-api.udacity.com/search", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({query: search})
    });
    return (await response.json()).books;
})

export const getBooks = createAsyncThunk('books/getBooks', async (_, {dispatch, getState}) => {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'hola');

    const response = await fetch("https://reactnd-books-api.udacity.com/books", {
        method: "GET",
        headers: headers
    });
    return (await response.json()).books;
});

const booksAdapter = createEntityAdapter({
    selectId: book => book.id,
    sortComparer: (a, b) => a.title.localeCompare(b.title),
})

const initialState = booksAdapter.getInitialState({
    loading: false,
    currentBookId: null,
    loadingLogin: true,
    user: null,
    loadingGettingBooks: false,
})

const booksSlice = createSlice({
    name: "books",
    initialState,
    reducers: {
        bookAdded: (state, {payload}) => {
            booksAdapter.addOne(state, payload)
        },
        bookRemoved: (state, {payload}) => {
            booksAdapter.removeOne(state, payload)
        },
        booksAdded: (state, {payload}) => {
            booksAdapter.addMany(state, payload)
        },
        loadingLoginChanged: (state, {payload}) => {
            state.loadingLogin = payload
        },
        userChanged: (state, {payload}) => {
            state.user = payload
        },
        infoBook: (state, {payload}) => {

        }
    },
    extraReducers: (builder) => {
        builder.addCase(getBooks.fulfilled, (state, {payload}) => {
            //console.log("books")
            //console.log(payload);
            booksAdapter.setAll(state, payload)
            state.loadingGettingBooks = false;
        })
        builder.addCase(getBooks.rejected, (state, {payload}) => {

        })
        builder.addCase(getBooks.pending, (state, {payload}) => {
            state.loadingGettingBooks = true;
        })
        builder.addCase(getSearchBooks.fulfilled, (state, {payload}) => {
            //console.log(payload);
            if (payload.error) {
                console.log("ocurrio error");
                booksAdapter.setAll(state, []);
            } else {
                booksAdapter.setAll(state, payload)
            }

            state.loadingGettingBooks = false;
        })
        builder.addCase(getSearchBooks.pending, (state, {payload}) => {
            state.loadingGettingBooks = true;
        })
        builder.addCase(getSearchBooks.rejected, (state, {payload}) => {
            state.loadingGettingBooks = false;
        })
    },
});

export const {bookAdded, bookRemoved, booksAdded, loadingLoginChanged, userChanged} = booksSlice.actions;
export const {selectAll, selectById} = booksAdapter.getSelectors(state => state.books);
export const selectUserChanged = (state => state.books.user);
export const selectLoadingLoginChanged = (state => state.books.loadingLogin);
export const selectLoadingGettingBooksChanged = (state) => state.books.loadingGettingBooks;

export default booksSlice.reducer;

