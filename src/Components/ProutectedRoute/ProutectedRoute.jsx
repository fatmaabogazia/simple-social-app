
import { Navigate } from 'react-router-dom'
import style from './ProutectedRoute.module.css'
import { useContext } from 'react'
import { UserContext } from '../../Context/UserContext'

export default function ProutectedRoute(props) {

    let { userLogin, setUserLogin } = useContext(UserContext)
    console.log(props.children);
    
    if (userLogin != null) {
        return props.children 
    } else {
        return <Navigate to={"/login"} /> 
    }



}

