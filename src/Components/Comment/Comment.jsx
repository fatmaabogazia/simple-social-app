// import style from './Comment.module.css';
import img from "../../assets/images/personPhoto.webp"
import ModalUpdateComment from '../ModalUpdateComment/ModalUpdateComment';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@heroui/react';

export default function Comment({ comment, postId }) {

    let queryClient = useQueryClient()

    function deleteComment(id) {
        axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${id}`, {
            headers: {
                // token: localStorage.getItem("userToken")
                Authorization:`Bearer ${localStorage.getItem("userToken")}`
            }
        }).then((res) => {
            if (res?.data?.success == true) {
                toast.success(res.data.message);
                queryClient.invalidateQueries({
                    queryKey: ["postsUser"]
                })
            }
        }).catch((err) => {
            toast.error(err?.message)
        })
    }
    
    return (

        <>
            <div className='bg-slate-300 p-2 mb-2 mt-4'>
                <div className='flex items-center justify-between my-4 '>
                    <div className='flex gap-3 items-center'>
                        <img src={comment?.commentCreator.photo} alt="user" className='size-8 rounded-full' onError={(e) => { e.target.src = img }} />
                        <h3> {comment?.commentCreator?.name}</h3>
                    </div>
                    <div className="text-slate-500 text-medium">{comment?.createdAt}</div>
                </div >
                <div className='text-xl px-3'>{comment?.content}</div>
                <div className='flex gap-2 items-center'>
                    <ModalUpdateComment commentId={comment?._id} postId={postId} />
                    <Button color="danger" onPress={() => {
                        deleteComment(comment?._id)
                    }}>Delete Comment</Button>
                </div>
            </div>

        </>


    )
}

