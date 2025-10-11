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
import KerweiHome from "./components/kerwei/KerweiHome.tsx";
import Spy from "./components/spy/Spy.tsx";
import AudioEssentials from "./components/audioessentials/AudioEssentials.tsx";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import Register from "./components/auth/Register.tsx";
import SignIn from "./components/auth/SignIn.tsx";
import {AuthenticationContextProvider} from "./context/AuthenticationContext.tsx";
import Profile from "./components/profile/Profile.tsx";
import CreateItem from "./components/item/CreateItem.tsx";
import UpdateItem from "./components/item/UpdateItem.tsx";
import {SecurityContextProvider} from "./context/SecurityContext.tsx";
import KerweiProgrammbuch from "./components/kerwei/KerweiProgrammbuch.tsx";
import KerweiMassMedia from "./components/kerwei/KerweiMassMedia.tsx";
// import YouTube2Mp3 from "./components/yt2mp3/YouTube2Mp3.tsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/*bwxor.com*/}
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
            </Route>
            {/*Apps*/}
            <Route path="apps/spy" element={<Spy/>}/>
            <Route path="kerwei" element={<KerweiHome/>}/>
            <Route path="kerwei/programmbuch" element={<KerweiProgrammbuch/>}/>
            <Route path="kerwei/mass-media" element={<KerweiMassMedia/>}/>
            <Route path="apps/ae" element={<AudioEssentials/>}/>
            {/*<Route path="apps/yt2mp3" element={<YouTube2Mp3 />} />*/}
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