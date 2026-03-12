
import style from './ModalUpdateComment.module.css'
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

export default function ModalUpdateComment({ commentId, postId }) {

    let queryClient = useQueryClient();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    let form = useForm({
        defaultValues: {
            content: "",
            // image: ""
        }
    })

    let { register, handleSubmit } = form;

    function updateComment(values) {

        axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`, values, {
            headers: {
                // token: localStorage.getItem("userToken")
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }).then((res) => {
            if (res.data.success == true) {
                toast.success(res.data.message)
                queryClient.invalidateQueries({
                    queryKey: ["postsUser"]
                })
                onClose()
            }

        }).catch((err) => {
            toast.error(err.response.data.message)
        })

    }

    return (
        <>
            <Button color="primary" onPress={onOpen} className="my-3">
                Update Comment
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Update Comment</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="content"
                                    variant="bordered"
                                    {...register("content")}
                                />
                                {/* {formState.errors.content ? <p className="text-red-400 text-center">{formState.errors.content.message}</p> : " "} */}
                                {/* <Input
                                    label="post"
                                    variant="bordered"
                                    type="hidden"
                                    value={postId}
                                    {...register("post")}
                                /> */}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={handleSubmit(updateComment)}>
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

