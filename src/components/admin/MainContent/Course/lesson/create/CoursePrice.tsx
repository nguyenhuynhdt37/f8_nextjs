const CoursePrice = ({ data, setData, error, setError }: any) => {
  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError({
      ...error,
      [e.target.name]: "",
    });
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setData((prevData: any) => ({
        ...prevData,
        [e.target.name]: newValue,
      }));
    }
  };
  const handleSetErrror = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(name);

    if (name === "price" && value.length === 0) {
      setError({
        ...error,
        [name]: "Giá không được bỏ trống",
      });
    }
    if (name === "priceOld" && value.length === 0) {
      setError({
        ...error,
        [name]: "Giá cũ không được bỏ trống",
      });
    }
  };
  return (
    <div className="mt-10 relative ps-4 ">
      <div className="p-10 bg-[#fff] rounded-lg shadow-lg">
        <div className="text-[1.6rem] font-medium">Giá cả</div>
        <div className="flex mt-10">
          <div
            onClick={() =>
              setData({
                ...data,
                isFree: true,
                price: undefined,
                priceOld: undefined,
              })
            }
            className="mr-10 cursor-pointer text-[1.4rem]"
          >
            <input
              type="radio"
              className="mr-5 cursor-pointer"
              checked={data?.isFree}
            />
            Miễn phí
          </div>

          <div
            className=" cursor-pointer text-[1.4rem]"
            onClick={() =>
              setData({
                ...data,
                isFree: false,
              })
            }
          >
            <input
              type="radio"
              className="mr-5 cursor-pointer"
              checked={!data?.isFree}
            />
            Trả phí
          </div>
        </div>
        {data?.isFree === false && (
          <>
            <div className="pt-4 text-[#e79d9d]">
              Lưu ý giá hiện tại là giá chính xác khi khách hàng thanh toán, giá
              hiện tại phải bé hơn hoặc bằng giá cũ
            </div>
            <div className="text-[1.4rem] font-medium pt-4">Giá hiện tại</div>
            <input
              type="text"
              name="price"
              value={data.price || ""}
              onBlur={handleSetErrror}
              onChange={handleOnchange}
              placeholder="Giá Hiện tại (VNĐ) ...."
              className="w-full mt-4 rounded-xl placeholder-[#908e8e] text-[1.4rem] py-4 px-10 border-[#edecec] border-2 focus:border-[#609fd6] text-[#000] focus:outline-none bg-[#fff]"
            />
            <div className="text-[1.2rem] mt-4 ps-4 text-[#d98888]">
              {error?.price}
            </div>
            <div className="text-[1.4rem] pt-4 font-medium">Giá cũ</div>
            <input
              value={data?.priceOld || ""}
              name="priceOld"
              placeholder="Nhập giá (VND) ..."
              type="text"
              onBlur={handleSetErrror}
              onChange={handleOnchange}
              className="w-full mt-4 rounded-xl placeholder-[#908e8e] text-[1.4rem] py-4 px-10 border-[#edecec] border-2 focus:border-[#609fd6] text-[#000] focus:outline-none bg-[#fff]"
            />
            <div className="text-[1.2rem] mt-4 ps-4 text-[#d98888]">
              {error?.priceOld}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoursePrice;
