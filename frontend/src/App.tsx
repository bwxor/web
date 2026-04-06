import './assets/js/fontawesome-all.js'

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";

import Menu from "./components/Menu.tsx";
import Home from "./components/Home.tsx";
import ItemList from "./components/item/ItemList.tsx";
import ItemView from "./components/item/ItemView.tsx";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import Register from "./components/auth/Register.tsx";
import SignIn from "./components/auth/SignIn.tsx";
import {AuthenticationContextProvider} from "./context/AuthenticationContext.tsx";
import Profile from "./components/profile/Profile.tsx";
import CreateItem from "./components/item/CreateItem.tsx";
import UpdateItem from "./components/item/UpdateItem.tsx";
import {SecurityContextProvider} from "./context/SecurityContext.tsx";
import Chat from "./components/chat/Chat.tsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Menu/>}>
                <Route index element={<Home/>}/>
                <Route path="projects" element={<ItemList category="projects"/>}/>
                <Route path="projects/:slug" element={<ItemView category="projects"/>}/>
                <Route path="docu" element={<ItemList category="docu"/>}/>
                <Route path="docu/:slug" element={<ItemView category="docu"/>}/>
                <Route path="register" element={<Register/>}/>
                <Route path="signin" element={<SignIn/>}/>
                <Route path="profile/:key" element={<Profile/>}/>
                <Route path="new/:category" element={<CreateItem/>}/>
                <Route path="update/:category/:oldSlug" element={<UpdateItem/>}/>
                <Route path="chat" element={<Chat/>}/>
            </Route>
        </>
    )
)

function App() {
    return (
        <AuthenticationContextProvider>
            <SecurityContextProvider>
                <ThemeProvider>
                    <RouterProvider router={router}/>
                </ThemeProvider>
            </SecurityContextProvider>
        </AuthenticationContextProvider>

    );
}

export default App;