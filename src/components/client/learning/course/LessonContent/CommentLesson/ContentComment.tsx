import React from 'react';
import ProfileComment from './ProfileComment';
import ChildrentComment from './ChildrentComment';

const ContentComment = ({
  data,
  onShowMoreComment,
  lessonId,
  feedback,
  setFeedback,
  moreComment,
  handleHideComment,
}: any) => {
  return (
    <div>
      {data?.comments?.map((comment: any) => (
        <div key={comment?.id} className="my-10">
          <ProfileComment
            onShowMoreComment={onShowMoreComment}
            parentId={comment?.id}
            lessonId={lessonId}
            data={comment}
            feedback={feedback}
            setFeedback={setFeedback}
          />
          {comment?.commentChildrent?.length > 0 &&
            (moreComment.find((p: number) => p === comment?.id) ? (
              <>
                <button
                  onClick={() => handleHideComment(comment?.id)}
                  className="font-medium mt-5"
                >
                  Thu gọn
                </button>
                {comment?.commentChildrent?.map((commentChild: any) => (
                  <ChildrentComment
                    lessonId={lessonId}
                    rootParentId={comment?.id}
                    parentId={commentChild?.id}
                    key={commentChild?.id}
                    onShowMoreComment={onShowMoreComment}
                    commentChild={commentChild}
                    moreComment={moreComment}
                    comment={comment}
                    handleHideComment={handleHideComment}
                    ProfileComment={ProfileComment}
                    feedback={feedback}
                    setFeedback={setFeedback}
                  />
                ))}
              </>
            ) : (
              <div
                onClick={() => onShowMoreComment(comment?.id)}
                className="my-5 font-medium cursor-pointer hover:underline-offset-[0.2rem]"
              >
                Xem tất cả câu trả lời
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default ContentComment;
