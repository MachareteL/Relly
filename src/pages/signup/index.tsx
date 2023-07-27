import Image from "next/image";
import bkg from "public/hero-illustration.svg";
import Link from "next/link";
import LoginForm from "~/components/LoginForm";
import { NextPage } from "next";

interface Props {}

const Index: NextPage<Props> = ({}) => {
  return (
    <div className="h-screen">
      <span className="absolute right-0 top-0 -z-30 h-screen w-full overflow-x-hidden">
        <Image src={bkg} alt="" className="block max-w-none" />
      </span>
      <div className="container m-auto grid h-full grid-cols-1 items-center px-4 sm:grid-cols-2">
        <div className="pb-8 sm:block sm:pb-32">
          <svg
            className="h-32 w-32"
            viewBox="0 0 32 32"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs>
              <radialGradient
                cx="50%"
                cy="89.845%"
                fx="50%"
                fy="89.845%"
                r="108.567%"
                gradientTransform="matrix(-.00915 -.82755 .99996 -.00757 -.394 1.319)"
                id="logo1-b"
              >
                <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%"></stop>
                <stop
                  stopColor="#F472B6"
                  stopOpacity=".876"
                  offset="100%"
                ></stop>
              </radialGradient>
              <radialGradient
                cx="50%"
                cy="89.845%"
                fx="50%"
                fy="89.845%"
                r="108.567%"
                gradientTransform="matrix(-.00915 -.82755 .99996 -.00757 -.394 1.319)"
                id="logo1-d"
              >
                <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%"></stop>
                <stop
                  stopColor="#D375C2"
                  stopOpacity=".833"
                  offset="50.358%"
                ></stop>
                <stop
                  stopColor="#FBCFE8"
                  stopOpacity=".876"
                  offset="100%"
                ></stop>
              </radialGradient>
              <path
                d="M12 32c8-6.915 12-12.582 12-17 0-6.627-5.373-12-12-12S0 8.373 0 15c0 4.418 4 10.085 12 17Z"
                id="logo1-a"
              ></path>
              <path
                d="M20 29c8-6.915 12-12.582 12-17 0-6.627-5.373-12-12-12S8 5.373 8 12c0 4.418 4 10.085 12 17Z"
                id="logo1-c"
              ></path>
            </defs>
            <g fill="none" fillRule="evenodd">
              <use
                fill="url(#logo1-b)"
                opacity=".64"
                transform="matrix(1 0 0 -1 0 35)"
                xlinkHref="#logo1-a"
              ></use>
              <use
                fill="url(#logo1-d)"
                opacity=".961"
                xlinkHref="#logo1-c"
              ></use>
            </g>
          </svg>
          <h1 className="font-sans text-6xl font-bold">Conecte-se.</h1>
          <h1 className="font-sans text-6xl font-bold">Crie.</h1>
          <h1 className="font-sans text-6xl font-bold">Compartilhe.</h1>
        </div>

        <div className="relative hidden h-5/6 rounded-xl bg-[rgba(100,116,139,0.5)] sm:block">
          <div className="absolute hidden h-full w-full rounded-xl backdrop-blur-lg sm:block">
            <LoginForm />
          </div>
        </div>

        <div className="block pb-16 sm:hidden">
          <div className="rounded-md bg-slate-500 py-3 text-center font-sans font-bold uppercase text-white">
            <Link
              href={"/"}
              className="font-sans font-bold uppercase text-white"
            >
              Inscreva-se
            </Link>
          </div>
          <p className="py-2 text-end">
            Já tem uma conta?{" "}
            <Link
              href={"/"}
              className="font-semibold text-purple-600 underline decoration-slate-100 underline-offset-2"
            >
              Faça Login
            </Link>
          </p>
        </div>
      </div>
      <span className="absolute bottom-0 -z-30 hidden h-1/3 w-full bg-gradient-to-t from-slate-700 sm:block"></span>
    </div>
  );
};
export default Index;
