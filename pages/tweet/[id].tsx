import { NextPageContext } from "next";
import { Reply, Tweet, User } from "@prisma/client";
import client from "../../lib/server/db";
import Layout from "../../components/tweet/Layout";
import { set, useForm } from "react-hook-form";
import TweetImage from "../../components/tweet/Image";
import useMutation from "../../lib/client/useMutation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { convertTime, intlDate } from "../../lib/client/utils";
import { IForm, MutationResult } from "@/pages";

interface TweetWithUser extends Tweet {
  user: User;
  replys: Reply[];
  _count: {
    likes: number;
    replys: number;
  };
}

interface ITweet {
  ok?: boolean;
  tweet: TweetWithUser;
}

export default function TweetDetail({ tweet }: ITweet) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IForm>();

  const [replies, setReplies] = useState<Reply[]>(tweet.replys || []);

  const [createdAt, setCreatedAt] = useState<string>("");

  const [reply, { data, loading }] = useMutation<MutationResult>("/api/reply");
  const { data: replyData, mutate } = useSWR<any>(
    `/api/reply?tweetId=${tweet.id}`
  );

  const time = `${createdAt.split(":")[0]}:${createdAt.split(":")[1]} ${
    createdAt.split(" ")[4]
  }`;

  const onSubmit = ({ text }: { text: string }) => {
    reply({
      text,
      tweetId: tweet.id,
    });
  };

  useEffect(() => {
    if (tweet.createdAt) {
      setCreatedAt(intlDate(tweet.createdAt));
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    if (data) {
      setValue("text", "");
      mutate();
      setReplies(replyData?.replies);
    }
  });

  return (
    <Layout>
      <div className=" border-b  p-3 ">
        {tweet.user && (
          <>
            <div className="flex w-full  items-center gap-3">
              <div
                className={`w-10 h-10 aspect-square rounded-full flex justify-center items-center text-white  ${
                  tweet.user ? `bg-red-500` : "bg-blue-800"
                } `}
              >
                <p className="text-lg font-semibold uppercase text-white ">
                  {tweet.user.name[0]}
                </p>
              </div>
              <p className="place-self-start">{tweet.user.name}</p>
            </div>

            <div className="flex flex-col px-1">
              <p className="  py-3">{tweet.text}</p>

              {tweet.imageUrl && (
                <TweetImage imageUrl={tweet.imageUrl} height={320} />
              )}

              <div className="border-b py-3 flex items-center gap-3 ">
                <p className="text-gray-500 text-sm">
                  {`${time.split(" ")[3]} ${time.split(" ")[4]} · ${
                    createdAt.split(",")[0]
                  }, ${createdAt.split(",")[1]} · `}
                  <span className="font-semibold text-black dark:text-white mx-1">
                    {tweet.views}
                  </span>
                  Views
                </p>
              </div>
              <div className="border-b py-3 flex items-center gap-3 ">
                <p className="text-gray-500 text-sm">
                  <span className="mr-1 text-black font-semibold dark:text-white">
                    {tweet._count.likes}
                  </span>
                  Likes
                </p>
                <p className="text-gray-500 text-sm">
                  <span className="mr-1 text-black font-semibold dark:text-white">
                    {replies.length}
                  </span>
                  Replys
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col"
            >
              <input
                {...register("text", {
                  required: {
                    value: true,
                    message: "Please enter your text",
                  },
                })}
                type="text"
                className="w-full p-2 bg-transparent outline-none placeholder:text-gray-500 border-transparent"
                placeholder="Tweet Your reply?"
              />
              {errors.text && (
                <p className="text-blue-400 text-sm">{errors.text.message}</p>
              )}
              <button
                className={`place-self-end px-4 py-2 text-sm  text-white rounded-3xl bg-black  dark:bg-white dark:text-black`}
              >
                Reply
              </button>
            </form>

            {replies.map((reply: any) => (
              <div
                key={reply.id}
                className="flex gap-3 py-2 flex-col w-full border-b "
              >
                <div className="flex w-full  items-center gap-3">
                  <div
                    className={`w-10 h-10 aspect-square rounded-full flex justify-center items-center text-white  ${
                      reply.user ? `bg-red-500` : "bg-blue-800"
                    } `}
                  >
                    <p className="text-lg font-semibold uppercase text-white ">
                      {reply.user.name[0]}
                    </p>
                  </div>
                  <div className="flex justify-between -mt-4 w-full">
                    <p className="place-self-start">{reply.user.name}</p>
                    <p className="place-self-end text-gray-500 text-sm">
                      {convertTime(reply.createdAt.toString())}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col px-1">
                  <p className=" ">{reply.text}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (context: NextPageContext) => {
  const tweet = await client.tweet.findUnique({
    where: {
      id: Number(context.query?.id),
    },
    include: {
      user: true,
      _count: {
        select: {
          likes: true,
          replys: true,
        },
      },
      replys: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  await client.tweet.update({
    where: {
      id: tweet?.id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  return {
    props: {
      tweet: JSON.parse(JSON.stringify(tweet)),
    },
  };
};
