import React from 'react';
import ReactQuill from 'react-quill';

const EditorComment = ({ value, onChange }: any) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      className="text-[3rem] border-[0.1rem] border-[#1d8388] block   w-full  overflow-hidden  rounded-lg scrollbar-custom"
      theme="snow"
      style={{ padding: '0px', width: '100% !impotant' }}
      placeholder="Viết văn bản ở đây..."
      modules={{
        toolbar: [
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ align: ['center', 'right', 'justify'] }],
          [{ color: [] }, { background: [] }],
          ['image'],
          ['code-block'],
        ],
      }}
      formats={[
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'color',
        'background',
        'align',
        'code-block',
      ]}
    />
  );
};

export default EditorComment;
