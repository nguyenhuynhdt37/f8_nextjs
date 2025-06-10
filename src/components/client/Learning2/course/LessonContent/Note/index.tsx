'use client';
import { ViewNoteLesson } from '@/api/axios/api';
import confetti from 'canvas-confetti';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { GoHeartFill } from 'react-icons/go';

const Note = ({ id, isCompleteLesson, setIsCompletedLesson }: any) => {
  const [note, setNote] = useState<any>(null);
  const refTimeOut = React.useRef<any>(null);
  const router = useRouter();
  useEffect(() => {
    const getData = async () => {
      const data = await ViewNoteLesson(id);
      if (data?.statusCode === 200) {
        setNote(data?.data);
      } else {
        router.push('/404');
      }
    };
    getData();
  }, [id]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsCompletedLesson({
        ...isCompleteLesson,
        isCompleted: true,
      });
      if (!isCompleteLesson?.isOldCompleted) {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: {
            x: 0.7,
            y: 1,
          },
        });
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  console.log('note', note);

  return (
    <div className="container mx-auto px-[20rem] pt-[5rem] text-[1.4rem]">
      <div className="text-[2.5rem] font-medium">{note?.title}</div>
      <div className="text-[1.3rem] pt-3 text-[#6d6d6d]">
        Cập nhật tháng 11 năm 2023
      </div>
      {note?.tblnote?.description ? (
        <div
          className="custom-textview"
          dangerouslySetInnerHTML={{ __html: note?.tblnote?.description }}
        />
      ) : (
        <div className="font-medium text-center">Chưa cập nhật</div>
      )}
      <div className="flex items-center justify-center">
        Made with
        <GoHeartFill className="px-2 text-[2.5rem] text-[#d47171]" />· Powered
        by F8
      </div>
    </div>
  );
};

export default Note;
