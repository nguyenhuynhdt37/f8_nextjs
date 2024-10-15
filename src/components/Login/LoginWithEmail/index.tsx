import { login } from "@/apiAxios/api";
import Loading from "@/components/Loading";
import { useAppDispatch } from "@/redux/hook/hook";
import {
  GetUserInfoByTokenRedux,
  loginRedux,
  setEmailRedux,
  setToken,
} from "@/redux/reducers/slices/AuthSlice";
import { isValidEmail } from "@/Utils/functions";
import { message, notification } from "antd";
import { log } from "console";
import { useSnackbar } from "notistack";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface IError {
  email: string;
  password: string;
}
interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const LoginWithEmail = ({ setStep, setOpen }: IProps) => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showEye, setShowEye] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState<IError>({
    email: "",
    password: "",
  });
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.relatedTarget)
    ) {
      setShowEye(false);
    }
  };
  const handleInputBlur = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;
    if (value === "") {
      setError({ ...error, [e.target.name]: "Trường không được để trống" });
      return;
    }
    if (name === "email" && !isValidEmail(value))
      setError({ ...error, [e.target.name]: "Không đúng định dạng email" });
  };
  const handleSubmit = async () => {
    if (email === "" || password === "") return;

    if (error.email || error.password) return;
    if (error) setLoading(true);
    dispatch(loginRedux({ email, password }))
      .unwrap()
      .then((data: any) => {
        dispatch(GetUserInfoByTokenRedux(data?.token))
          .unwrap()
          .then((data1: any) => {
            enqueueSnackbar("Đăng nhập thành công", {
              variant: "success",
            });
            localStorage.setItem("token", data?.token);
            setOpen(false);
          })
          .catch(() => {
            enqueueSnackbar("Lỗi trong quá trình lấy thông tin người dùng", {
              variant: "success",
            });
          });
      })
      .catch((error: any) => {
        if (error?.statusCode === 401) {
          dispatch(setEmailRedux(email));
          setStep(2);
        }
        setError({ ...error, password: error?.message?.message });
      })
      .finally(() => {
        setLoading(false);
      });

  };

  return (
    <div className="text-start px-5">
      <div className="font-medium mb-4">Tên đăng nhập</div>
      <input
        type="text"
        className={`${
          error?.email && "border-[#f33a58] bg-[#eedce4]"
        } px-6 rounded-full border-[0.15rem] my-2 text-2xl focus:outline-none focus:border-[#1dbfaf] py-[1.2rem] w-full`}
        placeholder="Email của bạn"
        name="email"
        value={email}
        onFocus={(e) => setError({ ...error, [e.target.name]: "" })}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={handleInputBlur}
      />
      <div className="pb-2 text-[#f33a58] ps-4 font-medium">{error.email}</div>
      <div
        className="relative"
        onFocus={() => setShowEye(true)}
        onBlur={handleBlur}
        tabIndex={-1}
        ref={containerRef}
      >
        <input
          type={`${showPass ? "text" : "password"}`}
          className={`${
            error?.password && "border-[#f33a58] bg-[#eedce4]"
          } px-6 rounded-full border-[0.15rem] my-2 text-2xl focus:outline-none focus:border-[#1dbfaf] py-[1.2rem] w-full`}
          placeholder="Mật khẩu"
          value={password}
          name="password"
          onFocus={(e) => setError({ ...error, [e.target.name]: "" })}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={handleInputBlur}
        ></input>

        {showEye && (
          <>
            {!showPass && (
              <button
                className="absolute top-1/2 -translate-y-1/2 right-6 w-8 text-[#838383] cursor-pointer"
                onClick={() => setShowPass(true)}
              >
                <svg
                  className="svg-inline--fa fa-eye  "
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="eye"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path
                    fill="currentColor"
                    d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
                  ></path>
                </svg>
              </button>
            )}
            {showPass && (
              <button
                className="absolute top-1/2 -translate-y-1/2 right-6 w-8 text-[#838383] cursor-pointer"
                onClick={() => setShowPass(false)}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="eye-slash"
                  className="svg-inline--fa fa-eye-slash "
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path
                    fill="currentColor"
                    d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
                  ></path>
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      <div className="pb-2 text-[#f33a58] ps-4 font-medium">
        {error.password}
      </div>
      <button
        onClick={handleSubmit}
        className={`w-full flex justify-center py-[1.2rem] bg-gradient-to-r from-[#8de0f9] to-[#88eae0] rounded-full mt-9 font-bold text-[#fff]`}
      >
        {!loading && "Đăng nhập"}
        {loading && <Loading />}
      </button>
    </div>
  );
};

export default LoginWithEmail;
