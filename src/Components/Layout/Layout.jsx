
import { Outlet } from 'react-router-dom'
// import style from './Layout.module.css';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';

export default function Layout() {
    return (
        <>
            <NavBar />
            <Outlet />
            {/* <Footer/> */}
        </>

    )
}

