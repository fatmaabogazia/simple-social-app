
import style from './ModalUpdatePost.module.css'

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
import { useForm } from "react-hook-form";
import axios from "axios";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";



export default function ModalUpdatePost({ postId }) {

    let queryClient = useQueryClient();

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    let form = useForm({
        defaultValues: {
            body: "",
            image: ""
        }
    })

    let { register, handleSubmit } = form

    function updatePost(values) {

        let formData = new FormData()

        formData.append("body", values.body);
        formData.append("image", values.image[0]);


        axios.put(`https://route-posts.routemisr.com/posts/${postId}`, formData, {
            headers: {
                // token: localStorage.getItem("userToken")
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }).then((res) => {
            if (res?.data?.success == true) {
                toast.success(res.data.message);
                form.reset()
                onClose();

                queryClient.invalidateQueries({
                    queryKey: ["postsUser"]
                })
            }
        }).catch((err) => {
            toast.error(err.message);
        })
    }

    return (
        <>
            <Button color="primary" onPress={onOpen} className="my-3">
                Update Post
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Update Post</ModalHeader>
                            <ModalBody>
                                <Input
                                    className="my-3"
                                    label="Content"
                                    placeholder="Enter your Content"
                                    type="text"
                                    {...register("body")}
                                />
                                <Input
                                    className="my-3"
                                    label="Image"
                                    placeholder="Enter your Photo"
                                    type="file"
                                    {...register("image")}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={handleSubmit(updatePost)}>
                                    Update
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </>
    )
}

