import { Outlet } from "react-router-dom";

import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";

function MainLayout() {
    return (
        <div className="app">
            <NavBar />

            <main className="app-content flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default MainLayout;