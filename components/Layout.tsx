import React from "react";
import Link from "next/link";
import ErrorText from "./ErrorText";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  error?: string | null;
  isLogin?: boolean;
  header?: boolean;
}

export default function Layout({
  children,
  isLogin,
  error,
  header,
}: LayoutProps) {
  return (
    <div className="w-full min-h-screen  flex justify-center">
      {!header && <Header />}
      <div className="w-full h-full  p-4 px-10 flex flex-col justify-center items-center mt-48">
        <h1 className="font-bold text-2xl place-self-start my-8 ">
          {isLogin ? "X에 로그인하기" : "지금 X에 가입하세요"}
        </h1>
        {children}

        <p className="text-md text-gray-400 place-self-start">
          {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
          <Link href={isLogin ? "/create-account" : "log-in"}>
            <button className="text-black font-semibold cursor-pointer dark:text-white">
              {isLogin ? "가입하기" : "로그인"}
            </button>
          </Link>
        </p>
        {error && <ErrorText error={error} />}
      </div>
    </div>
  );
}
