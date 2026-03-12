
import { Navigate } from 'react-router-dom'
import style from './ProutectedRoute.module.css'

export default function ProutectedRoute(props) {

    if (localStorage.getItem("userToken") != null) {
        return props.children
    } else {
        return <Navigate to={"/login"} />
    }

}

