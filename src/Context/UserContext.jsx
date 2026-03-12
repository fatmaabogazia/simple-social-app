import { createContext, useState } from "react";


export let UserContext = createContext();

export default function UserContextProvider(props) {

    let [userLogin, setUserLogin] = useState(localStorage.getItem("userToken"));

    return <UserContext.Provider value={{ userLogin, setUserLogin }}>
        {props.children}
    </UserContext.Provider>

}


