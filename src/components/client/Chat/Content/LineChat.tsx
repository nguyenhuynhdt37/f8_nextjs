import Tippy from '@tippyjs/react';
import React from 'react';

const LineChat = ({ placement }: any) => {
  return (
    <Tippy
      trigger="mouseenter"
      className="tippy-custom"
      arrow={false}
      content={<div className="bg-black">ihihi</div>}
      interactive={true}
      placement={placement}
    >
      <div
        className={`${placement === 'left' ? 'bg-[#0866ff] text-[#fff]' : 'bg-[#f0f0f0]'} font-light max-w-[34rem] text-start mt-3 px-7 py-3 rounded-full `}
      >
        h-[6.614rem] bg-[#fff] justify-between p-5 flex border-b-[0.1rem] flex
        items-center
      </div>
    </Tippy>
  );
};

export default LineChat;
