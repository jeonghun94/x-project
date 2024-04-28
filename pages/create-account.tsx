import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../lib/client/useMutation";
import Layout from "../components/Layout";

interface IForm {
  name: string;
  email: string;
}
interface MutationResult {
  ok: boolean;
  error: string;
}

const CreateAccount = () => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>();

  const [res, { loading, data }] = useMutation<MutationResult>("/api/register");
  const submitting = (validData: IForm) => {
    if (loading) return;
    res(validData);
  };

  useEffect(() => {
    if (data?.ok) {
      router.push("/log-in");
    } else {
      if (data?.error) setError(data.error);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [data]);

  return (
    <Layout error={error}>
      <form onSubmit={handleSubmit(submitting)} className="w-full">
        <div>
          <label htmlFor="name">
            <input
              {...register("name", {
                required: {
                  value: true,
                  message: "사용자명을 입력하세요. ",
                },
              })}
              className="border border-gray-300 rounded-md px-2 py-3 w-full placeholder:text-gray-600 focus:outline-none focus:border-[#1C9BEF] focus:ring-1 focus:ring-[#1C9BEF] ${error && `border-red-500`} "
              placeholder="사용자명"
              type="text"
              name="name"
              id="name"
            />
          </label>{" "}
          {errors.name?.message}
        </div>
        <br />
        <div>
          <label htmlFor="email">
            <input
              {...register("email", {
                required: {
                  value: true,
                  message: "이메일을 입력하세요.",
                },
              })}
              className="border border-gray-300 rounded-md px-2 py-3 w-full placeholder:text-gray-600 focus:outline-none focus:border-[#1C9BEF] focus:ring-1 focus:ring-[#1C9BEF] ${error && `border-red-500`} "
              placeholder="이메일"
              type="email"
              name="email"
              id="email"
            />
          </label>{" "}
          {errors.email?.message}
        </div>
        <button className="w-full p-2  my-8 rounded-3xl bg-black text-white font-bold text-md dark:bg-white dark:text-black">
          계정 만들기
        </button>
      </form>
    </Layout>
  );
};

export default CreateAccount;
