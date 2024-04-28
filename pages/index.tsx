import useSWR from "swr";
import useUser from "../lib/client/useUser";
import useMutation from "../lib/client/useMutation";
import { Tweet, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Tweets from "../components/tweet/Tweets";
import Layout from "../components/tweet/Layout";
import Image from "next/image";

export interface IForm {
  text: string;
  photo?: FileList;
}
export interface ITweets {
  ok?: boolean;
  tweets: TweetWithUser[];
}

export interface MutationResult {
  ok: boolean;
}

interface TweetWithUser extends Tweet {
  user: User;
}

const Home = () => {
  const { user, isLoading } = useUser();
  const { data: tweetData, mutate } = useSWR<ITweets>("/api/tweet");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<IForm>();

  const [tweet, { data, loading }] = useMutation<MutationResult>("/api/tweet");

  const onSubmit = async ({ text, photo }: IForm) => {
    if (loading) return;
    const photoIds = [];

    if (photo && photo.length > 0) {
      // setImageLoading(true);
      for (let i = 0; i < photo.length; i++) {
        const form = new FormData();
        const { uploadURL } = await (await fetch(`/api/files`)).json();
        form.append("file", photo[i], text);
        const {
          result: { id },
        } = await (
          await fetch(uploadURL, { method: "POST", body: form })
        ).json();
        photoIds.push(id);
        // setImageLoading(false);
      }
    }

    tweet({
      text,
      photoId: photoIds.join(","),
    });
  };

  useEffect(() => {
    if (loading) return;
    if (data?.ok) {
      setValue("text", "");
      mutate();
      photoPreview && setPhotoPreview("");
    }
  }, [data]);

  // const [imageLoading, setImageLoading] = useState(false);

  const photo = watch("photo");

  const [photos, setPhotos] = useState(0);
  const [photoPreview, setPhotoPreview] = useState("");
  const removePhoto = (idx: number) => {
    const newPhotoPreview = photoPreview.split(",");
    newPhotoPreview.splice(idx, 1);
    setPhotos(photos - 1);
    setPhotoPreview(newPhotoPreview.toString());
  };

  useEffect(() => {
    const files = [];
    if (photo && photo.length > 0) {
      for (let i = 0; i < photo.length; i++) {
        files.push(URL.createObjectURL(photo[i]));
      }
      setPhotos(photo.length);
      setPhotoPreview(files.toString());
    }
  }, [photo]);

  return isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <Layout isHome>
      <div className="w-full px-4 py-3  border-b ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-start gap-2 "
        >
          {user && (
            <div
              className={`w-10 h-10 aspect-square rounded-full flex justify-center items-center text-white  ${
                user ? `bg-red-500` : "bg-blue-800"
              } `}
            >
              <p className="text-lg font-semibold uppercase text-white">
                {user.name[0]}
              </p>
            </div>
          )}

          <div className="w-full flex flex-col">
            <input
              {...register("text", {
                required: {
                  value: true,
                  message: "Please enter your text",
                },
              })}
              type="text"
              className="w-full p-2 bg-transparent outline-none placeholder:text-gray-500 border-transparent"
              placeholder="What's happeing?"
            />
            {errors.text && (
              <p className="text-black text-sm">{errors.text.message}</p>
            )}
            <label className=" w-4 h-4 mt-2 cursor-pointer text-gray-600 flex items-center justify-center rounded-md">
              <div className="flex flex-col justify-center items-center gap-1">
                <svg
                  className="w-5 ml-2 text-[#1C9BEF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <input
                {...register("photo")}
                multiple
                accept="image/*"
                className="hidden"
                type="file"
              />
            </label>
            {photoPreview ? (
              <div className="flex mt-2 items-center ml-3 gap-3">
                {photoPreview.split(",").map((photo, idx) => (
                  <div className="w-28 h-28 relative" key={idx}>
                    <Image
                      alt="이미지를 불러올 수 없습니다:("
                      src={photo}
                      // fill="cover"
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                    {idx === 0 && (
                      <div className="absolute w-full h-6 bottom-0 flex justify-center items-center text-sm bg-black text-white rounded-bl-md rounded-br-md">
                        대표 사진
                      </div>
                    )}
                    <div
                      className="absolute w-6 h-6 flex justify-center items-center text-xs bg-white rounded-full -top-2 -right-3 border border-gray-300 cursor-pointer 
                    "
                      onClick={() => removePhoto(idx)}
                    >
                      <svg
                        className="w-5 h-5 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <button
              className={`place-self-end px-4 py-2 text-sm  text-white rounded-3xl bg-black dark:bg-white dark:text-black  hover:opacity-[0.8] ${
                loading ? "cursor-not-allowed opacity-2" : ""
              } `}
              disabled={loading}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
      {tweetData && tweetData.tweets?.length > 0 ? (
        <Tweets tweets={tweetData.tweets} />
      ) : (
        <h1 className="text-center text-sm m-5">No Tweets.</h1>
      )}
    </Layout>
  );
};

export default Home;
