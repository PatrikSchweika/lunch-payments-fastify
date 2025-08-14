import {BrowserRouter, Route, Routes} from "react-router";
import {HomePage} from "./pages/HomePage.tsx";
import {AppLayout} from "./AppLayout.tsx";
import {LoginPage} from "./pages/auth/LoginPage.tsx";
import {UserPage} from "./pages/users/UserPage.tsx";

export const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="user/:userId" element={<UserPage />} />
            </Route>
        </Routes>
    </BrowserRouter>
)