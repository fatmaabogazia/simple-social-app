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
import axios from "axios";
import { useForm } from 'react-hook-form'
import style from './ModalUploadPhoto.module.css'
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function ModalUploadPhoto() {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    let queryClient = useQueryClient()

    let form = useForm({
        defaultValues: {
            // هو مستني مني الداتا علي شكل form data مش json  علشان انا كنت ببعتها json بس المره دي لاا 
            photo: ""
        }
    })

    let { register, handleSubmit } = form

    function uploadProfilePhoto(values) {
        // // داا هيطلعلي اوبجكت بس انا عاوزاها في form data   
        // console.log(values.photo[0]);

        // هاخد منه نسخه 
        let imageData = new FormData();
        // هنحط فيه الاسم اللي الباك مستنيه وvalue اللي عاوزه احلولهاا
        imageData.append("photo", values.photo[0]);

        axios.put("https://route-posts.routemsr.com/users/upload-photo", imageData, {
            headers: {
                // token: localStorage.getItem("userToken")
                Authorization:`Bearer ${localStorage.getItem("userToken")}`
            }
        }).then((res) => {
            if (res.data.success == true) {
                toast.success(res.data.message);

                // داا علشان اول اما اغير الصوره تتغير مش لازم ريفريش  اديتهاا نفس الاسم بتاع صفحه البروفيل علشان اعرفها ان حصل تغيير
                queryClient.invalidateQueries({
                    queryKey: ["profileData"]
                })
                
                onClose()
            }
        }).catch((err) => {
            toast.error(err.message)
        })
    }

    return (
        <>
            <Button color="primary" onPress={onOpen} className="my-3">
                Upload Photo
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Upload Photo</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Photo"
                                    variant="bordered"
                                    type="file"
                                    {...register("photo")}
                                />

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={handleSubmit(uploadProfilePhoto)}>
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>



        </>
    )
}

