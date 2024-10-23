import { CheckCodeActive, sendEmailAsync } from "@/api/api";
import Loading from "@/components/Loading";
import { RootState } from "@/redux/store";
import { error } from "console";
import { useSnackbar } from "notistack";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { TypedUseSelectorHook, useSelector } from "react-redux";

interface IFormSentEmail {
  email: string;
  code: string;
}
const SentEmail = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const { emailSentEmail } = useSelector((state: RootState) => state.auth);
  console.log("email", emailSentEmail);
  const ref = useRef(null);
  const [sendEmail, setSentEmail] = useState<number>(100);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [isDistable, setIsDistable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const [formSentEmail, setFormSentEmail] = useState<IFormSentEmail>({
    email: emailSentEmail,
    code: "",
  });
  const handleSetCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setFormSentEmail({ ...formSentEmail, code: newValue });
    }
  };

  const handleSentEmail = async (e: any) => {
    setLoading(true);
    setIsDistable(true);
    try {
      var result = await sendEmailAsync(emailSentEmail);
      console.log("result", result);
      setIsCounting(true);
      if (result?.statusCode === 400 || result?.statusCode === 401) {
        setIsDistable(true);
      }
    } catch (e) {
      console.log(e);
      setCodeError("Có lỗi xẩy ra, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isCounting) return;

    const interval = setInterval(() => {
      setSentEmail((prevSendEmail) => {
        if (prevSendEmail <= 1) {
          setIsCounting(false);
          setIsDistable(false);
          return 0;
        }
        return prevSendEmail - 1;
      });
    }, 1000);

    return () => {
      setSentEmail(100);
      clearInterval(interval);
    };
  }, [isCounting]);
  const handleBlur = () => {
    if (formSentEmail.code === "") {
      setCodeError("Mã xác nhận không được bỏ trống");
      return;
    }
    if (formSentEmail.code.length !== 6) {
      setCodeError("Mã xác nhận phải chứa 6 ký tự");
      return;
    }
    setCodeError("");
  };
  const handleSubmit = async () => {
    if (formSentEmail.code === "") {
      setCodeError("Mã xác nhận không được bỏ trống");
      return;
    }
    if (formSentEmail.email === "") {
      setCodeError("Email không được bỏ trống");
      return;
    }
    if (codeError) return;
    setLoadingAuth(true);
    var res = await CheckCodeActive({
      email: formSentEmail.email,
      codeID: formSentEmail.code,
    });
    if (res?.statusCode === 400 || res?.statusCode === 401) {
      setCodeError(res?.message?.message);
    }
    if (res?.statusCode === 200 || res?.statusCode === 201) {
      enqueueSnackbar("Xác thực thành công!", {
        variant: "success",
      });
      setStep(1);
    }

    setLoadingAuth(false);
  };
  return (
    <>
      <div className="text-start py-2 ps-2 font-medium">
        Xác nhận tài khoản Email của bạn!!
      </div>
      <div className="">
        <input
          type="text"
          className={`px-6 rounded-full border-[0.15rem] my-2 text-2xl focus:outline-none focus:border-[#1dbfaf] py-[1.2rem] w-full`}
          placeholder="Email của bạn"
          name="email"
          value={emailSentEmail}
          disabled
        />
      </div>

      <div className="text-start pt-2 ps-2 font-medium">Mã xác nhận</div>
      <div className="relative my-2">
        <input
          type="text"
          className={`${
            codeError && "border-[#f33a58] bg-[#eedce4]"
          } px-6 rounded-full border-[0.15rem]  text-2xl focus:outline-none focus:border-[#1dbfaf] py-[1.2rem] w-full`}
          placeholder="Mã xác nhận"
          // disabled={isDistable}
          name="code"
          value={formSentEmail.code}
          onChange={handleSetCode}
          onFocus={() => setCodeError("")}
          onBlur={handleBlur}
        />
        <button
          onClick={handleSentEmail}
          className={`${
            !isDistable
              ? "text-[#fff] bg-[#f97525]"
              : "text-[#757575] bg-[#cccccc]"
          } absolute py-[1rem] top-1/2 -translate-y-1/2 text-[1.4rem] font-medium w-44 right-[0.26rem] rounded-full `}
        >
          {loading && (
            <div className="flex justify-center">
              <span className="mr-2">Gửi mã</span>
              <Loading />
            </div>
          )}
          {!isCounting && !loading && <span>Gửi mã</span>}
          {isCounting && `Gửi lại mã ${sendEmail}`}
        </button>
      </div>
      <div className="py-1 text-[#f33a58] ps-4 text-start  font-medium">
        {codeError}
      </div>
      <button
        ref={ref}
        disabled={loadingAuth}
        onClick={handleSubmit}
        className={`w-full flex justify-center py-[1.2rem] bg-gradient-to-r from-[#8de0f9] to-[#88eae0] rounded-full mt-9 font-bold text-[#fff]`}
      >
        {!loadingAuth && "Xác thực"}
        {loadingAuth && <Loading />}
      </button>
    </>
  );
};

export default SentEmail;
