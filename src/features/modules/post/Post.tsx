import React, { useState } from "react";
import styles from "./Post.module.scss";

import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Divider, Checkbox } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";

import AvatarGroup from "@material-ui/lab/AvatarGroup";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";

import {
  selectProfile,
  selectProfiles,
  setOpenSignUp,
} from "../../slices/authSlice";

import { BsTrash } from "react-icons/bs";

import {
  selectComments,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncGetPosts,
  fetchAsyncPostComment,
  fetchAsyncGetComments,
  fetchAsyncPatchLiked,
  fetchAsyncDeletePost,
  fetchAsyncDeleteComment,
} from "../../slices/postSlice";

import { PROPS_POST } from "../../types/PostType";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));

const Post: React.FC<PROPS_POST> = ({
  postId,
  loginId,
  userPost,
  title,
  imageUrl,
  liked,
}) => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const profiles = useSelector(selectProfiles);
  const myProf = useSelector(selectProfile);
  const comments = useSelector(selectComments);
  const [text, setText] = useState("");

  const commentsOnPost = comments.filter((com) => {
    return com.post === postId;
  });

  const prof = profiles.filter((prof) => {
    return prof.userProfile === userPost;
  });

  const postComment = async (e: React.MouseEvent<HTMLElement>) => {
    if (loginId !== 0) {
      e.preventDefault();
      const packet = { text: text, post: postId };
      await dispatch(fetchPostStart());
      await dispatch(fetchAsyncPostComment(packet));
      await dispatch(fetchPostEnd());
      setText("");
    } else {
      setText("");
      dispatch(setOpenSignUp());
    }
  };

  const handlerLiked = async () => {
    if (loginId !== 0) {
      const packet = {
        id: postId,
        title: title,
        current: liked,
        new: loginId,
      };
      await dispatch(fetchPostStart());
      await dispatch(fetchAsyncPatchLiked(packet));
      await dispatch(fetchPostEnd());
    } else {
      dispatch(setOpenSignUp());
    }
  };

  const deleteOwnPost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const postId = e.currentTarget.value;
    await dispatch(fetchAsyncDeletePost(postId));
    await dispatch(fetchAsyncGetPosts());
  };

  const deleteOwnComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const commentId = e.currentTarget.value;
    await dispatch(fetchAsyncDeleteComment(commentId));
    await dispatch(fetchAsyncGetComments());
  };

  if (title) {
    return (
      <div className={styles.post}>
        <div className={styles.post_header}>
          <Avatar className={styles.post_avatar} src={prof[0]?.img} />
          <h3>{prof[0]?.nickName}</h3>
          {myProf.userProfile === userPost ? (
            <button
              className={styles.taskIcon}
              onClick={deleteOwnPost}
              value={postId}
            >
              <BsTrash />
            </button>
          ) : (
            ""
          )}
        </div>
        <img className={styles.post_image} src={imageUrl} alt="" />
        <h4 className={styles.post_text}>
          <Checkbox
            className={styles.post_checkBox}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            checked={liked.some((like) => like === loginId)}
            onChange={handlerLiked}
          />
          <strong> {prof[0]?.nickName}</strong> {title}
          <AvatarGroup max={7}>
            {liked.map((like) => (
              <Avatar
                className={styles.post_avatarGroup}
                key={like}
                src={profiles.find((prof) => prof.userProfile === like)?.img}
              />
            ))}
          </AvatarGroup>
        </h4>

        <Divider />
        <div className={styles.post_comments}>
          {commentsOnPost.map((comment) => (
            <div key={comment.id} className={styles.post_comment}>
              <Avatar
                src={
                  profiles.find(
                    (prof) => prof.userProfile === comment.userComment
                  )?.img
                }
                className={classes.small}
              />
              <p>
                <strong className={styles.post_strong}>
                  {
                    profiles.find(
                      (prof) => prof.userProfile === comment.userComment
                    )?.nickName
                  }
                </strong>
                {comment.text}
              </p>
              {myProf.userProfile === comment.userComment ? (
                <button
                  className={styles.commentTrash}
                  onClick={deleteOwnComment}
                  value={comment.id}
                >
                  <BsTrash />
                </button>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>

        <form className={styles.post_commentBox}>
          <input
            className={styles.post_input}
            type="text"
            placeholder="add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            disabled={!text.length}
            className={styles.post_button}
            type={loginId !== 0 ? "submit" : "button"}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      </div>
    );
  }
  return null;
};

export default Post;
