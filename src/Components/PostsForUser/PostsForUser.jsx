
import { useQuery } from '@tanstack/react-query';
import style from './PostsForUser.module.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Comment from '../Comment/Comment';
import ModalCreateComment from '../ModalCreateComment/ModalCreateComment';
import ModalUpdatePost from '../ModalUpdatePost/ModalUpdatePost';
import { Button } from '@heroui/react'
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export default function PostsForUser({ userId }) {

    let queryClient = useQueryClient()

    async function getPostsUser() {
        return await axios.get(`https://route-posts.routemisr.com/users/${userId}/posts`, {
            headers: {
                // token: localStorage.getItem("userToken")
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data, isError, isLoading } = useQuery({
        queryKey: ["postsUser"],
        queryFn: getPostsUser,
        select: function (data) {
            return data?.data?.data?.posts
        }
    })

    function deletePost(id) {
        axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
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
            }
        }).catch((err) => {
            toast.error(err.message)
        })

    }

    return (
        <>
            {isLoading == false ? <div className="container m-auto">
                {data?.map((post) => {
                    return <>
                        <div className="w-full md:w-[90%] lg:w[70%] xl:w-[50%] bg-slate-200 mx-auto p-5 my-5">
                            <Link to={`/postDetails/${post._id}`}>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 mb-2">
                                            <img src={post.user.photo} alt="" className="rounded-full size-8 " />
                                            <h2>{post.user.name}</h2>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-medium">{post.createdAt}</p>
                                        </div>
                                    </div>

                                    <h3>{post.body}</h3>
                                    <img src={post.image} alt={post.body} className="w-full mt-2" />
                                </div>
                            </Link>
                            {post?.topComment && <Comment comment={post?.topComment} postId={post._id} />}
                            <div className="flex gap-3 items-center">
                                <ModalCreateComment postId={post?._id} />
                                <ModalUpdatePost postId={post?._id} />
                                <Button color="danger" onPress={() => {
                                    deletePost(post?._id)
                                }}>Delete Post</Button>
                            </div>
                        </div>
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

