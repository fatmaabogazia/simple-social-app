// import style from './Register.module.css'

import { Button, Input, Select, SelectItem } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

export default function Register() {

    let [errorMessage, setErrorMessage] = useState("");

    let [isLoadingFlag, setIsLoadingFlag] = useState(false);

    let navigate = useNavigate();

    let schema = z.object({
        name: z.string().min(1, "Name is in valid").max(15, "Name must less than 15 char"),
        email: z.email("invalid mail"),
        password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "password must contain about at leatest 8 char and small and capital and numbers and special char"),
        rePassword: z.string(),
        //                 refine دي بتاخد فنكشن و سترينج ولازم ترجع شرط يا اما بتروو او فلس 
        dateOfBirth: z.string().refine((dateValue) => {
            // علشان نخلي الفورمات اللي اليوزر هيدخلهاا نفس فورمات الDate 
            let userDate = new Date(dateValue);
            let nowDate = new Date();
            //  علشان يجيب الشهر مش الايام
            nowDate.setHours(0, 0, 0);
            return nowDate > userDate
        }, "date is can't valid"),
        gender: z.enum(["male", "female"], "gender is not valid")
    }).refine((object) => {
        return object.password === object.rePassword
    }, {
        error: "rePassword and password are not match",
        path: ["rePassword"]
    })


    let form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            rePassword: "",
            dateOfBirth: "",
            gender: "",
        },
        resolver: zodResolver(schema)
    })

    // console.log(form);

    let { register, handleSubmit, formState } = form;

    function handleRegister(values) {
        setIsLoadingFlag(true);
        // call api 
        axios.post("https://route-posts.routemisr.com/users/signup", values).then((res) => {
            if (res.data.success === true) {
                navigate("/login")
                setIsLoadingFlag(false);
                toast.success("Account Created")
            }
        }).catch((err) => {
            setErrorMessage(err.response.data.message);
            setIsLoadingFlag(false);
            // toast.error(err.response.data.message)
        })
    }


    const genders = [
        { key: "male", label: "Male" },
        { key: "female", label: "Female" },
    ];

    return (
        <>
            <h1 className="text-center font-semibold text-2xl pt-3 ">
                Register Form
            </h1>

            {/* conditional rendering */}
            {errorMessage && <h2 className="text-red-400 text-center text-2xl">{errorMessage}</h2>}

            <div className="container w-[80%] m-auto">
                <div className="row">
                    <div className="w-full lg:w-1/2 m-auto">
                        <form onSubmit={handleSubmit(handleRegister)}>
                            <Input {...register("name")} label="Enter Your Name" labelPlacement={"outside"} type="text" className="py-2" />
                            {formState.errors.name && formState.touchedFields.name ? <p className="text-center text-red-400">{formState.errors.name.message}</p> : ""}

                            <Input {...register("email")} label="Enter Your Email" labelPlacement={"outside"} type="email" className="py-2" />
                            {formState.errors.email && formState.touchedFields.email ? <p className="text-center text-red-400">{formState.errors.email.message}</p> : ""}

                            <Input {...register("password")} label="Enter Your Password" labelPlacement={"outside"} type="password" className="py-2" />
                            {formState.errors.password && formState.touchedFields.password ? <p className="text-center text-red-400">{formState.errors.password.message}</p> : ""}

                            <Input {...register("rePassword")} label="Enter Your Repassword" labelPlacement={"outside"} type="password" className="py-2" />
                            {formState.errors.rePassword && formState.touchedFields.rePassword ? <p className="text-center text-red-400">{formState.errors.rePassword.message}</p> : ""}

                            <Input {...register("dateOfBirth")} label="Enter Your Date" labelPlacement={"outside"} type="date" className="py-4" />
                            {formState.errors.dateOfBirth && formState.touchedFields.dateOfBirth ? <p className="text-center text-red-400">{formState.errors.dateOfBirth.message}</p> : ""}

                            <Select label="Select Your Gender" labelPlacement={"outside"} {...register("gender")}>
                                {genders.map((gender) => (
                                    <SelectItem key={gender.key} textValue={`${gender.key}`}>
                                        {gender.label}
                                    </SelectItem>
                                ))}
                            </Select>
                            {formState.errors.gender && formState.touchedFields.gender ? <p className="text-center text-red-400">{formState.errors.gender.message}</p> : ""}

                            <Button isLoading={isLoadingFlag} type="submit" color="primary" variant="ghost" className="block ms-auto my-3">
                                Submit
                            </Button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
