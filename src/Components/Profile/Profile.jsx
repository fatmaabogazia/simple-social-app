
import axios from 'axios'
import style from './Profile.module.css'
import { useQuery } from '@tanstack/react-query';

import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import PostsForUser from '../PostsForUser/PostsForUser';
import ModalUploadPhoto from '../ModalUploadPhoto/ModalUploadPhoto';
import ChangePassword from '../ChangePassword/ChangePassword';

export default function Profile() {

    async function profileDetails() {
        return await axios.get("https://route-posts.routemisr.com/users/profile-data", {
            headers: {
                // token: localStorage.getItem("userToken"),
                Authorization:`Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data } = useQuery({
        queryKey: ["profileData"],
        queryFn: profileDetails,
        select: function (data) {
            return data?.data?.data?.user
        }
    })

    return (
        <>
            <div className=" gap-2 mx-auto container sm:w-[85%] md:w-[70%] lg:w-[50%] xl:w-[40%]  my-3 py-5">
                <Card className='m-auto bg-slate-100' shadow="sm">
                    <CardBody className="overflow-visible p-0 bg-slate-200">
                        <Image
                            alt={data?.name}
                            className="w-full max-h-60 object-fill"
                            radius="lg"
                            shadow="sm"
                            src={data?.photo}
                            width="100%"
                        />
                    </CardBody>
                    <div className='px-3'>
                        <CardFooter className="text-small py-1 ">
                            <p className='text-slate-600 text-xl text-nowrap'>User Name : </p>
                            <p className="text-black text-3xl capitalize">{data?.name}</p>
                        </CardFooter>
                        <CardFooter className="text-small py-1">
                            <p className='text-slate-600 text-xl text-nowrap'>User Email : </p>
                            <p className="text-black text-3xl capitalize">{data?.email}</p>
                        </CardFooter>
                        <CardFooter className="text-small py-1 ">
                            <p className='text-slate-600 text-xl text-nowrap'>User Date Of Birth : </p>
                            <p className="text-black text-2xl ">{data?.dateOfBirth}</p>
                        </CardFooter>
                        <CardFooter className="text-small py-1">
                            <p className='text-slate-600 text-xl text-nowrap'>User Gender : </p>
                            <p className="text-black text-3xl capitalize">{data?.gender}</p>
                        </CardFooter>
                        <CardFooter className="text-small py-1">
                            <p className='text-slate-600 text-xl text-nowrap'>Acount Created In : </p>
                            <p className="text-slate-400 text-2xl capitalize">{data?.createdAt}</p>
                        </CardFooter>

                        <CardFooter className='flex justify-center'>
                            <ModalUploadPhoto />
                        </CardFooter>
                        <CardFooter className='flex justify-center'>
                            <ChangePassword />
                        </CardFooter>

                    </div>

                </Card>
                <PostsForUser userId={data?._id} />

            </div>

        </>

    )
}

