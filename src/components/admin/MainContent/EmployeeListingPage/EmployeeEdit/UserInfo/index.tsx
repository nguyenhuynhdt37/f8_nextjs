import React from "react";

const UserInfo = ({ editorValue, setEditorValue }: any) => {
  return (
    <div className="mb-3 mt-10 rounded-xl border-2 border-[#e5bda7] p-5">
      <div className="flex-1 pb-5">
        <div className="mb-2 text-[#605f5f]">Link GitHub</div>
        <input
          value={editorValue.githubLink}
          name={"githubLink"}
          type="text"
          className="w-full rounded-lg border-[0.1rem] border-[#e5bda7] bg-[#e6e3e1] px-5 py-2 focus:outline-none"
          onChange={(e) =>
            setEditorValue({
              ...editorValue,
              githubLink: e.target.value,
            })
          }
        />
        <div className="mb-2 pt-4 text-[#605f5f]">Link Facebook</div>
        <input
          value={editorValue.facebookLink}
          className="w-full rounded-lg border-[0.1rem] border-[#e5bda7] bg-[#e6e3e1] px-5 py-2 focus:outline-none"
          onChange={(e) =>
            setEditorValue({
              ...editorValue,
              facebookLink: e.target.value,
            })
          }
        />
        <div className="mb-2 pt-4 text-[#605f5f]">Link Youtube</div>
        <input
          value={editorValue.youtubeLink}
          className="w-full rounded-lg border-[0.1rem] border-[#e5bda7] bg-[#e6e3e1] px-5 py-2 focus:outline-none"
          onChange={(e) =>
            setEditorValue({
              ...editorValue,
              youtubeLink: e.target.value,
            })
          }
        />
        <div className="mb-2 pt-4 text-[#605f5f]">Tên người dùng</div>
        <input
          value={editorValue.userName}
          className="w-full rounded-lg border-[0.1rem] border-[#e5bda7] bg-[#e6e3e1] px-5 py-2 focus:outline-none"
          onChange={(e) =>
            setEditorValue({
              ...editorValue,
              userName: e.target.value,
            })
          }
        />
        <div className="mb-2 pt-4 text-[#605f5f]">Link website cá nhân</div>
        <input
          value={editorValue.personalWebsite}
          className="w-full rounded-lg border-[0.1rem] border-[#e5bda7] bg-[#e6e3e1] px-5 py-2 focus:outline-none"
          onChange={(e) =>
            setEditorValue({
              ...editorValue,
              personalWebsite: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};

export default UserInfo;
