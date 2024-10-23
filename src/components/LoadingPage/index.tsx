const LoadingPage = () => {
  return (
    <div
      className={`fixed z-50 opacity-70 top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-[#8a8a8b]`}
    >
      <img className="w-20" src={"/images/loading-new.gif"} alt="" />
    </div>
  );
};

export default LoadingPage;
