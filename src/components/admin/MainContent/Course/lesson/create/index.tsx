'use client';
import { useState } from 'react';
import OptionType from './OptionType';
import Lesson from './Lesson';
import Question from './Question';
import Note from './Note';

const LessonCreate = ({ courseId, grouplessons, lessonType }: any) => {
  const [lessonTypeIsChoise, setLessonTypeIsChoise] = useState(lessonType[0]);
  const [grouplessonIsChoise, setGrouplessonIsChoise] = useState(
    grouplessons[0],
  );
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string>('');
  const handleSetErrror = (e: any) => {
    if (!e.target.value) {
      setError('Tiêu đề không được bỏ trống');
    }
  };
  return (
    <div className="p-10">
      <input
        onBlur={handleSetErrror}
        type="text"
        name={'title'}
        value={title}
        onChange={e => {
          setError('');
          setTitle(e.target.value);
        }}
        className="w-full rounded-xl placeholder-[#cecdcd] text-[3rem] py-11 px-10 text-[#fff] focus:outline-none bg-[#1e75e5]"
        placeholder="Tiêu đề bài học ...."
      />
      <div className="text-[1.2rem] mt-4 ps-4 text-[#d98888]">{error}</div>
      <div className="mt-10 flex relative ps-4 text-[1.6rem] font-medium">
        <span className="absolute top-2 left-0 w-[0.3rem] h-[0.3rem] rounded-full bg-[#1e75e5]"></span>
        <div className="flex items-center">
          <div className="mr-5">Kiểu bài học</div>
          <OptionType
            data={lessonType}
            typeChoise={lessonTypeIsChoise}
            setTypeChoise={setLessonTypeIsChoise}
          />
        </div>
        <div className="ms-10 flex items-center">
          <div className="mr-5">Chương</div>
          <OptionType
            data={grouplessons}
            typeChoise={grouplessonIsChoise}
            setTypeChoise={setGrouplessonIsChoise}
          />
        </div>
      </div>
      {lessonTypeIsChoise?.id === 1 && (
        <Lesson
          courseId={courseId}
          titleError={error}
          setTitleErrror={setError}
          lessonType={lessonTypeIsChoise?.id}
          grouplesson={grouplessonIsChoise?.id}
          title={title}
        />
      )}
      {lessonTypeIsChoise?.id === 2 && <Lesson />}
      {lessonTypeIsChoise?.id === 3 && (
        <Question
          courseId={courseId}
          titleError={error}
          setTitleErrror={setError}
          lessonType={lessonTypeIsChoise?.id}
          grouplesson={grouplessonIsChoise?.id}
          title={title}
        />
      )}
      {lessonTypeIsChoise?.id === 4 && (
        <Note
          courseId={courseId}
          titleError={error}
          setTitleErrror={setError}
          lessonType={lessonTypeIsChoise?.id}
          grouplesson={grouplessonIsChoise?.id}
          title={title}
        />
      )}
    </div>
  );
};

export default LessonCreate;
