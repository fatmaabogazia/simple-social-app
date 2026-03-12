
// import style from './Home.module.css'

import { useContext, useEffect, useState } from "react"
import { CounterContext } from "../../Context/CounterContext"
import { PostsContext } from "../../Context/PostsContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Comment from "../Comment/Comment";
import { Link } from "react-router-dom";
import ModalCreateComment from "../ModalCreateComment/ModalCreateComment";

import { Form, Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ModalUpdatePost from "../ModalUpdatePost/ModalUpdatePost";

import img from "../../assets/images/personPhoto.webp"


export default function Home() {

    // State Management (redux / context)
    // context ==> هو عباره عن مخزن بيكون  علي المشروع كله واخزن فيه اللي عاوزاه 

    // Context ==> client State Managment ==> local
    // tan stack qury ==> server State Managment ==> 
    // بنستخدمه لما يكون جاي عندي حاجه من الباك اند يعني مش local

    // هنعمل ديستركت علطول علشان دا useContext(CounterContext)  كداا كداا بيديني اوبجكت
    let { count, setCount, test } = useContext(CounterContext);


    // let [posts, setPosts] = useState([])

    // let { getPosts } = useContext(PostsContext);

    // async function getAllPosts() {
    //     let res = await getPosts();
    //     if (res.length > 0) {
    //         setPosts(res);
    //     }
    //     // console.log(res);
    // }

    // useEffect(() => {
    //     getAllPosts()
    // }, [])


    async function getAllPosts() {
        return await axios.get("https://route-posts.routemisr.com/posts", {
            headers: {
                // token: localStorage.getItem("userToken")
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data, isError, isLoading, error } = useQuery({
        // لازم يكون اسم مفيش زيه unique
        queryKey: ["getPosts"],
        queryFn: getAllPosts,

        // // يعني الداتا هتبقي فريش 20 ثانيه وبعدين وهترجع stale ولو الداتا فريش ورحت ف صفحه ورجعت تاني مش هيحصل refetch لكن لو هي خلصت وبقت في ال stale ودخلنا اي صفحه ورجعنا تاني هتعمل refetch 
        // staleTime: 20000,

        // // دي عدد المرات اللي لما يكون في مشكله هيقعد يجرب قبل اما يطلع الايرور لليوذر == والديفولت ب 3 ==
        // retry: 5,
        // // داا الوقت اللي هيقعده بين كل ريكوست وريكوست لما يكون في ايرور 
        // retryDelay: 2000,

        // // دا الوقت اللي هيستني وبعدين يعمل refetch وبعدين الداتا تكون stale وبعدين يستني ال 3 ثواني وبعدين يعمل refetch بس احنا مش هنحس بس علشان ال component  مش هيحصله rerendere غير لما يحصل تغير في الداتا 
        // refetchInterval: 3000,
        // // يعني انا لو مش ف الويب وبره برضو بيعمل ريكوست و refetch علي حسب الوقت اللي عطيهوله
        // refetchIntervalInBackground: true,

        // // دا يعني اول اما اعمل فوكس علي الويب افتحه يعني يعمل refetch يعمل ريكوست
        // refetchOnWindowFocus: true,

        // // داا يعني هيستني تلت ثواني ويمسح الريكوست كله لو رحت ف اي صفحه تانيه ولما ارجع يعمل ريكوست جديد وكل حاجه من الاول علشان المساحه
        // gcTime: 3000,

        // // الفنكشن بتاخد الداتا اللي فوق تلقاءي وهتشيلهل وتحط مكانها الاراي بس اللي هو راجع من الريترن 
        // // وممكن اقدر احطها تحت واللوب عليها علطول اللي هي data  
        // select: function (data) {
        //     return data.data.posts
        // }
    })


    // علشان هي ف الاول هتطلع undefined 
    let posts = data?.data?.data?.posts;
    // console.log(data?.data?.data.posts);
    // console.log(isLoading);
    // console.log(posts?.length > 0);

    if (isError) {
        return <h3 className="text-red-400 text-center ">{error.message} </h3>
    }

    // //  دي بدل اما اعمل ternary operator تحت علشان هو هيقف عند اول return 
    // if (isLoading) {
    //     return <div className="container m-auto h-150 flex items-center ">
    //         <div className="sk-chase m-auto">
    //             <div className="sk-chase-dot"></div>
    //             <div className="sk-chase-dot"></div>
    //             <div className="sk-chase-dot"></div>
    //             <div className="sk-chase-dot"></div>
    //             <div className="sk-chase-dot"></div>
    //             <div className="sk-chase-dot"></div>
    //         </div>
    //     </div>
    // }


    let form = useForm({
        defaultValues: {
            body: "",
            image: "",
        }
    })

    let { register, handleSubmit } = form;

    function createNewPost(values) {
        let formData = new FormData();
        formData.append("body", values.body);
        formData.append("image", values.image[0]);

        axios.post("https://route-posts.routemisr.com/posts", formData, {
            headers: {
                // token: localStorage.getItem("userToken")
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }).then((res) => {
            if (res.data.success == true) {
                toast.success(res.data.message);
                form.reset();
            }
        }).catch((err) => {
            toast.error(err.message);
        })
    }


    function deletePost() {
        axios.delete(`https://linked-posts.routemisr.com/posts/${potsId}`, {
            headers: {
                token: localStorage.getItem("userToken")
            }
        })
    }


    return (
        <>
            <div className="container sm:w-[85%] md:w-[70%] lg:w-[50%] xl:w-[40%] mx-auto p-4 my-3 bg-slate-200 rounded-xl">
                <h2 className="py-3">Create Post </h2>
                <Form onSubmit={handleSubmit(createNewPost)}>
                    <Input
                        className="my-3"
                        label="Content"
                        // labelPlacement="outside"
                        placeholder="Enter your Content"
                        type="text"
                        {...register("body")}
                    />
                    <Input
                        className="my-3"
                        label="Image"
                        // labelPlacement="outside"
                        placeholder="Enter your Photo"
                        type="file"
                        {...register("image")}
                    />
                    <Button type="submit" variant="bordered" className="bg-slate-500 text-white block ms-auto">
                        Create
                    </Button>
                </Form>
            </div>

            {/* posts?.length > 0  OR  res.isLoading == false */}
            {posts?.length > 0 ? <div className="container m-auto ">
                {posts?.map((post) => {
                    return <>
                        {post.body && <div className="container sm:w-[85%] md:w-[70%] lg:w-[50%] xl:w-[40%] bg-slate-200 mx-auto p-4 my-5">
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
                                    {post.image && <img src={post.image} alt={post.body} className="w-full mt-2" />}
                                </div>
                            </Link>

                            {post.topComment && <div className='bg-slate-300 p-2 mb-2 mt-4'>
                                <div className='flex items-center justify-between my-4 '>
                                    <div className='flex gap-3 items-center'>
                                        <img src={post?.topComment?.commentCreator?.photo} alt="user" className='size-8 rounded-full' onError={(e) => { e.target.src = img }} />
                                        <h3> {post?.topComment?.commentCreator?.name}</h3>
                                    </div>
                                    <div className="text-slate-500 text-medium">{post?.topComment?.createdAt}</div>
                                </div >
                                <div className='text-xl px-3'>{post?.topComment?.content}</div>
                            </div>}


                            {/* علشان كان بيظهر زرار الابديت والديليت للكومنت وانا مش عاوزاهم ف الهوم */}
                            {/* <Comment comment={post?.comments[0]} /> */}

                            <div className="flex gap-3 items-center">
                                <ModalCreateComment postId={post?._id} />
                            </div>
                        </div>}
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



