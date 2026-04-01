
// import style from './Navbar.module.css'

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
} from "@heroui/react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ChangePassword from "../ChangePassword/ChangePassword";


export default function NavBar() {

    let { userLogin, setUserLogin } = useContext(UserContext);

    let navigate = useNavigate();

    function signout() {
        localStorage.removeItem("userToken");
        navigate("/login");
        setUserLogin(null);
    }


    async function profileDetails() {
        return await axios.get("https://route-posts.routemisr.com/users/profile-data", {
            headers: {
                // token: localStorage.getItem("userToken")
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data } = useQuery({
        queryKey: ["profileData"],
        queryFn: profileDetails,
        select: function (data) {
            return data?.data?.data.user
        }
    })

    return (
        <>
            <Navbar className='text-white bg-slate-800'>
                <NavbarBrand>
                    <p className="font-bold text-inherit"><Link to={"/"}>Social App</Link></p>
                </NavbarBrand>

                <NavbarContent as="div" justify="end" className='text-white'>
                    {userLogin != null ? <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="secondary"
                                name="Jason Hughes"
                                size="sm"
                                src={data?.photo}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="userName" className=" " textValue=" ">
                                <p className="font-semibold capitalize">{data?.name}</p>
                            </DropdownItem>
                            <DropdownItem key="profileData" className="h-14 gap-2" textValue=" ">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">{data?.email}</p>
                            </DropdownItem>
                            <DropdownItem key="profile" textValue=" "><NavbarItem as={Link} to={"/profile"}>Profile</NavbarItem></DropdownItem>
                            <DropdownItem key="signout" textValue=" " onClick={() => {
                                signout()
                            }}>Sign out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                        :
                        <ul className='flex gap-3 text-white'>
                            <NavbarItem as={Link} to={"/login"}> Login </NavbarItem>
                            <NavbarItem as={Link} to={"/register"}> Register </NavbarItem>
                        </ul>}

                </NavbarContent>

            </Navbar>

        </>


    )
}

