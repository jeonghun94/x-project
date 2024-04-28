import Head from "next/head";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";
import useUser from "../../lib/client/useUser";

interface LayoutProps {
  children: React.ReactNode;
  isHome?: boolean;
}

export default function Layout({ children, isHome }: LayoutProps) {
  const router = useRouter();
  const locationName = isHome ? "Home" : "Tweet";
  const { user, isLoading } = useUser();
  const handleBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.push("/");
  };

  const handleLogout = () => {
    fetch("/api/logout").then(() => (window.location.href = "/"));
  };

  const title = `${locationName} / Twitter`;

  return (
    <div className="w-full min-h-screen flex">
      <Head>
        <title>{title}</title>
        <link
          rel="shortcut icon"
          href="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/850px-X_logo_2023.svg.png"
          type="image/x-icon"
        />
      </Head>
      <div className="flex flex-col  gap-7 border-r w-[14%]  p-1 py-3  items-center ">
        <img
          className="w-7 h-7 dark:bg-white"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/850px-X_logo_2023.svg.png"
        />
        <AiFillHome onClick={handleHome} className="w-7 h-7 cursor-pointer" />

        {user && (
          <div className="flex text-lg font-semibold justify-center items-center uppercase w-10 h-10 bg-red-500 text-white rounded-full">
            {user.name[0]}
          </div>
        )}

        {/* <IoLogOut
          onClick={handleLogout}
          className="ml-1 w-8 h-8 cursor-pointer"
        /> */}
      </div>

      <div className="w-[86%]">
        <div className="mb-3 px-4 py-3 flex">
          {!isHome && (
            <button className="mr-4" onClick={handleBack}>
              <FaArrowLeft />
            </button>
          )}
          <p className="font-semibold text-lg">{locationName}</p>
        </div>

        {isHome && (
          <div className="w-full flex border-b justify-between pb-3 ">
            <p className="w-full text-center text-sm">
              <span className="border-b-2 border-b-black pb-3"> For you</span>
            </p>
            <p className="w-full text-center text-sm text-gray-500">
              <span>Following</span>
            </p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
