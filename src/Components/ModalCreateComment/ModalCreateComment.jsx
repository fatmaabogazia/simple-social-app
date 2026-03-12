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
import style from './ModalCreateComment.module.css'
import { useForm } from "react-hook-form";
import axios from "axios";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function ModalCreateComment({ postId }) {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    let queryClient = useQueryClient()

    let schema = z.object({
        content: z.string().min(1, "Must Add Comment"),
        // post: z.string()
    })

    let form = useForm({
        defaultValues: {
            content: "",
            // post: postId,
            // image: ""
        },
        resolver: zodResolver(schema)
    })

    let { register, handleSubmit, formState } = form

    function addComment(value) {
        axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`, value, {
            headers: {
                // token: localStorage.getItem("userToken"),
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }).then((res) => {
            if (res?.data?.success == true) {
                toast.success("comment added Successefully", {
                    duration: 2000,
                    // icon: '👏'
                })
                onClose()

                // علشان ابديت الكومنت يسمع فالبروفيل والهوم كماان
                queryClient.invalidateQueries({
                    queryKey: ["postsUser"]
                })
                queryClient.invalidateQueries({
                    queryKey: ["getPosts"]
                })
            }

        }).catch((err) => {
            toast.error(err.response.data.error)
        })
    }

    return (
        <>
            <Button color="primary" onPress={onOpen} className="my-3">
                Add Comment
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add Comment</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="content"
                                    variant="bordered"
                                    {...register("content")}
                                />
                                {formState.errors.content ? <p className="text-red-400 text-center">{formState.errors.content.message}</p> : " "}
                                {/* <Input
                                    label="post"
                                    variant="bordered"
                                    type="hidden"
                                    value={postId}
                                    {...register("post")}
                                /> */}
                                {/* <Input
                                    label="image"
                                    variant="bordered"
                                    type="file"
                                    // value={postId}
                                    {...register("image")}
                                /> */}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={handleSubmit(addComment)}>
                                    Add
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </>
    )
}

