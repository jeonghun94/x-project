import Link from "next/link";
import { convertTime } from "../../lib/client/utils";
import { ITweets } from "../../pages";
import TweetImage from "./Image";

export default function Tweets({ tweets }: ITweets) {
  return tweets?.length > 0 ? (
    <>
      {tweets.map((tweet, idx) => (
        <Link href={`/tweet/${tweet.id}`} key={idx}>
          <div className="w-full px-4 py-3 border-b cursor-pointer dark:border-b-[#181818] ">
            <div className="flex items-start gap-3 ">
              <div className="w-10 h-10 aspect-square rounded-full bg-blue-800 flex justify-center items-center text-white">
                <p className="text-lg font-semibold uppercase">
                  {tweet.user.name[0]}
                </p>
              </div>

              <div className="w-full flex flex-col">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm">{tweet.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {convertTime(tweet.createdAt.toString())}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-2">{tweet.text}</p>
                {tweet.imageUrl && <TweetImage imageUrl={tweet.imageUrl} />}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  ) : null;
}
