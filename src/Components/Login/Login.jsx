
// import style from './Login.module.css'
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { UserContext } from "../../Context/UserContext";

export default function Login() {

    let { userLogin, setUserLogin } = useContext(UserContext)

    let [errorMessage, setErrorMessage] = useState("");

    let [isLoadingFlag, setIsLoadingFlag] = useState(false);

    let navigate = useNavigate()

    let schema = z.object({
        email: z.email("in Valid email"),
        password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "in valid password must be at least 8 char and capitals , small , apecial chars")
    })

    let form = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(schema)
    });


    let { register, handleSubmit, formState } = form
    
    function handleLogin(values) {
        setIsLoadingFlag(true);

        axios.post("https://route-posts.routemisr.com/users/signin", values).then((res) => {
            if (res.data.success == true) {
                navigate("/");
                setIsLoadingFlag(false);
                localStorage.setItem("userToken", res.data.data.token);
                setUserLogin(res.data.token)
            }

        }).catch((err) => {
            setErrorMessage(err.response.data.message);
            setIsLoadingFlag(false);
        })
    }

    return (
        <>
            <h1 className="text-center text-2xl font-semibold my-3">Login Form</h1>

            <h2 className="text-center text-red-400 text-2xl">{errorMessage}</h2>

            <div className="container w-[80%] m-auto">
                <div className="row">
                    <div className="w-full lg:w-1/2 m-auto">
                        <form onSubmit={handleSubmit(handleLogin)}>

                            <Input {...register("email")} label="Enter Your Email" labelPlacement={"outside"} type="email" className="py-2" name="email" />
                            {formState.errors.email && formState.touchedFields.email ? <p className="text-center text-red-400">{formState.errors.email.message}</p> : ""}

                            <Input {...register("password")} label="Enter Your Password" labelPlacement={"outside"} type="password" className="py-2" />
                            {formState.errors.password && formState.touchedFields.password ? <p className="text-center text-red-400">{formState.errors.password.message}</p> : ""}

                            <Button isLoading={isLoadingFlag} type="submit" color="primary" variant="ghost" className="block w-full  my-4">
                                Login
                            </Button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

