import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../lib/client/useMutation";
import Layout from "../components/Layout";

interface IForm {
  email: string;
}

interface MutationResult {
  ok: boolean;
  error: string;
}

const Login = () => {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const { register, handleSubmit } = useForm<IForm>();

  const [login, { loading, data }] = useMutation<MutationResult>("/api/login");
  const submitting = (validForm: IForm) => {
    if (loading) return;
    login(validForm);
  };

  useEffect(() => {
    if (data?.ok) {
      router.push("/");
    } else {
      if (data?.error) setError(data.error);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [data]);

  return (
    <Layout isLogin error={error}>
      <form onSubmit={handleSubmit(submitting)} className="w-full">
        <button
          type="button"
          className="cursor-not-allowed flex justify-center gap-2 border border-gray-300 rounded-3xl p-2 w-full  placeholder:text-gray-600 focus:outline-none  ${error && `border-red-500`}  "
          placeholder="이메일 주소"
        >
          <svg
            aria-hidden="true"
            className="octicon octicon-mark-github"
            height="24"
            version="1.1"
            viewBox="0 0 16 16"
            width="22"
          >
            <path
              fillRule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            ></path>
          </svg>
          Github 계정으로 로그인
        </button>
        <div className="w-full grid grid-cols-9 place-items-center  my-2">
          <div className="w-full col-span-4 h-1 border-b border-gray-300 divide-x-2"></div>
          <span className=" text-md text-center ">또는</span>
          <div className="w-full col-span-4 h-1 border-b border-gray-300 divide-x-2"></div>
        </div>
        <div className="w-full">
          <label htmlFor="email">
            <input
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
              })}
              className="border border-gray-300 rounded-md px-2 py-3 w-full placeholder:text-gray-600 focus:outline-none focus:border-[#1C9BEF] focus:ring-1 focus:ring-[#1C9BEF] ${error && `border-red-500`} "
              placeholder="이메일 주소"
              type="email"
              name="email"
              id="email"
            />
          </label>
        </div>
        <button className="w-full p-2  my-8 rounded-3xl bg-black text-white font-bold text-md dark:bg-white dark:text-black ">
          다음
        </button>
      </form>
    </Layout>
  );
};

export default Login;
