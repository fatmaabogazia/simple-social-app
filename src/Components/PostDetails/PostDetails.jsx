
import { useParams } from 'react-router-dom';
import style from './PostDetails.module.css'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import img from "../../assets/images/personPhoto.webp"

export default function PostDetails() {

    let { id } = useParams()

    async function showPostDetails() {
        return await axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
            headers: {
                // token: localStorage.getItem("userToken")
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    async function getAllCommentsForPost() {
        return await axios.get(`https://route-posts.routemisr.com/posts/${id}/comments?page=1`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data, isError, error, isLoading } = useQuery({
        queryKey: ["showPost"],
        queryFn: showPostDetails,
        select: function (data) {
            return data?.data?.data.post
        }
    })

    let { data: comments, isLoading: isLoadingComments } = useQuery({
        queryKey: ["showComments"],
        queryFn: getAllCommentsForPost,
        select: function (comments) {
            return comments?.data?.data?.comments
        }
    })


    return (
        <>
            {isLoading == false ?
                <div className="w-full md:w-[60%] lg:w[40%] bg-slate-200 mx-auto p-5 my-5">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 mb-2">
                            <img src={data?.user.photo} alt="" className="rounded-full size-8 " />
                            <h2>{data?.user.name}</h2>
                        </div>
                        <div>
                            <p className="text-slate-500 text-medium">{data?.createdAt}</p>
                        </div>
                    </div>

                    <h3>{data?.body}</h3>
                    {data?.image && <img src={data?.image} alt={data?.body} className="w-full mt-2" />}

                    {!isLoadingComments && comments.map((comment) => {
                        return <>
                            <div className='flex items-center justify-between my-4'>
                                <div className='flex gap-3 items-center'>
                                    <img src={comment?.commentCreator.photo} alt="user" className='size-8 rounded-full' onError={(e) => { e.target.src = img; }} />
                                    <h3> {comment?.commentCreator?.name}</h3>
                                </div>
                                <div className="text-slate-500 text-medium">{comment?.createdAt}</div>
                            </div >
                            <div className='text-xl px-3'>{comment?.content}</div>

                        </>
                    })}

                </div> : <div className="container m-auto h-150 flex items-center ">
                    <div className="sk-chase m-auto">
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                    </div>
                </div>}


        </>
    )
}

