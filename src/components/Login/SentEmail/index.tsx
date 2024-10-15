import Loading from "@/components/Loading";
import React, { useEffect, useState } from "react";

const SentEmail: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [sendEmail, setSentEmail] = useState<number>(100);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleSetCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setCode(newValue);
    }
  };

  const handleSentEmail = () => {
    setIsCounting(true);
  };

  useEffect(() => {
    if (!isCounting) return;

    const interval = setInterval(() => {
      setSentEmail((prevSendEmail) => {
        if (prevSendEmail <= 1) {
          setIsCounting(false);
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
          value={"nguyenhuynhdt37@gmail.com"}
          disabled
        />
      </div>

      <div className="text-start pt-2 ps-2 font-medium">Mã xác nhận</div>
      <div className="relative my-2">
        <input
          type="text"
          className={`px-6 rounded-full border-[0.15rem]  text-2xl focus:outline-none focus:border-[#1dbfaf] py-[1.2rem] w-full`}
          placeholder="Mã xác nhận"
          name="code"
          value={code}
          onChange={handleSetCode}
        />
        <button
          onClick={handleSentEmail}
          className={`${
            !isCounting
              ? "text-[#fff] bg-[#f97525]"
              : "text-[#757575] bg-[#cccccc]"
          } absolute py-[1rem] top-1/2 -translate-y-1/2 text-[1.4rem] font-medium w-44 right-[0.2rem] rounded-full `}
          disabled={isCounting}
        >
          {!isCounting ? "Gửi mã" : `Gửi lại mã ${sendEmail}`}
        </button>
      </div>
      <button
        // onClick={handleSubmit}
        className={`w-full flex justify-center py-[1.2rem] bg-gradient-to-r from-[#8de0f9] to-[#88eae0] rounded-full mt-9 font-bold text-[#fff]`}
      >
        {!loading && "Đăng nhập"}
        {loading && <Loading />}
      </button>
    </>
  );
};

export default SentEmail;
