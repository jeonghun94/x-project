import { SWRConfig } from "swr";
import "../global.css";

export default function App({ Component, pageProps }: any) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className="w-full dark:bg-black">
        <div className="max-w-lg m-auto   dark:bg-black dark:text-white">
          <Component {...pageProps} />
        </div>
      </div>
    </SWRConfig>
  );
}
