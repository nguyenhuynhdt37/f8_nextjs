import React from 'react';

const ChildrentComment = ({
  onShowMoreComment,
  commentChild,
  rootParentId,
  moreComment,
  parentId,
  comment,
  handleHideComment,
  ProfileComment,
  feedback,
  lessonId,
  setFeedback,
}: any) => {
  // console.log('pareentId', parentId);

  return (
    <div
      className={'ml-1 border-l-[0.1rem] mt-5 p-5 pr-0'}
      key={commentChild?.id}
    >
      <ProfileComment
        parentId={parentId}
        lessonId={lessonId}
        data={commentChild}
        feedback={feedback}
        rootParentId={rootParentId}
        setFeedback={setFeedback}
      />
      {commentChild?.commentChildrent?.length > 0 &&
        commentChild?.commentChildrent.map((commentChild2: any) => (
          <ChildrentComment
            lessonId={lessonId}
            rootParentId={rootParentId}
            key={commentChild2?.id}
            commentChild={commentChild2}
            parentId={commentChild2?.id}
            comment={comment}
            moreComment={moreComment}
            handleHideComment={handleHideComment}
            onShowMoreComment={onShowMoreComment}
            feedback={feedback}
            setFeedback={setFeedback}
            ProfileComment={ProfileComment}
          />
        ))}
    </div>
  );
};

export default ChildrentComment;
