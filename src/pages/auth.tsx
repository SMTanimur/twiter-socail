import { useRouter } from "next/router";
import { useState } from "react";
import { Login, Register } from "components/index";
import Image from "next/image";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { push } = useRouter();
  return (
    <div className="grid h-screen grid-cols-8 text-white">
      {/* left part */}
      <div className="hidden col-span-3 p-4 bg-blue-700 md:grid place-items-center">
        <h1 className="mb-5 text-3xl font-semibold">
          Tweety helps you connect and share with the people in your life.{" "}
        </h1>
        <div className="w-full h-full ">
          <Image
            loading="eager"
            width={200}
            height={200}
            layout="responsive"
            src="/image_3d.png"
          />
        </div>
      </div>

      {/* right part */}
      <div className="grid col-span-8 p-2 bg-dark-700 md:col-span-5 place-items-center">
        {isLogin ? <Login large /> : <Register />}
        <div>
          <p className="text-lg tracking-wide text-center text-white">
            {!isLogin ? "Already a member?" : " Don't have an account yet?"}
            <span
              className="font-semibold text-white cursor-pointer"
              onClick={() => setIsLogin((value) => !value)}
            >
              {!isLogin ? " Sign In" : " Sign Up"}
            </span>
          </p>

          <p
            className="p-1 mt-2 text-sm tracking-wide text-center text-white border-2 border-blue-500 cursor-pointer md:text-base"
            onClick={() => push("/")}
          >
            Skip Auth for now
          </p>
        </div>
      </div>
    </div>
  );
}
