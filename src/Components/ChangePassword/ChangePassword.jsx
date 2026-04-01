
import { useForm } from 'react-hook-form';

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
} from "@heroui/react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../Context/UserContext';

export default function ChangePassword() {
    // let query = useQueryClient()
    let route = useNavigate();
    let {setUserLogin} = useContext(UserContext)

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();


    let { register, handleSubmit } = useForm({
        defaultValues: {
            password: "",
            newPassword: ""
        }
    })


    async function changePassword(values) {
        // console.log(values);
        return await axios.patch("https://route-posts.routemisr.com/users/change-password", values, {
            headers: {
                // token: localStorage.getItem("userToken")
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }).then((res) => {
            if (res?.data?.success == true) {
                toast.success(res?.data?.message)
                // query.invalidateQueries({
                //     queryKey:[""]
                // })
                route("/login");
                setUserLogin(null)
                onClose()
            }
        }).catch((err) => {
            toast.error(err?.message) 
        })
    }


    return (
        <>
            <Button color='primary' onPress={onOpen}>
                Change Password
            </Button>

            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add Comment</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Old Password"
                                    variant="bordered"
                                    {...register("password")}
                                />
                                {/* {formState.errors.content ? <p className="text-red-400 text-center">{formState.errors.content.message}</p> : " "} */}
                                <Input
                                    label="New Password"
                                    variant="bordered"
                                    // value={postId}
                                    {...register("newPassword")}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={handleSubmit(changePassword)}>
                                    Change
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </>

    )
}

