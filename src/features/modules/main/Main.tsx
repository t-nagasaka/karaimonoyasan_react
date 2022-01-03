import React, { useEffect, useState } from "react";
import Auth from "../auth/Auth";

import MuiPagination from "@material-ui/lab/Pagination";

import styles from "./Main.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";

import ReactPaginate from "react-paginate";

import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  Avatar,
  Badge,
  CircularProgress,
} from "@material-ui/core";

import { MdAddAPhoto } from "react-icons/md";

import {
  editNickname,
  selectProfile,
  selectIsLoadingAuth,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "../../slices/authSlice";

import {
  selectPosts,
  selectIsLoadingPost,
  setOpenNewPost,
  resetOpenNewPost,
  fetchAsyncGetPosts,
  fetchAsyncGetComments,
} from "../../slices/postSlice";

import Post from "../post/Post";
import EditProfile from "../edits/EditProfile";
import NewPost from "../post/NewPost";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const Main: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const posts = useSelector(selectPosts);
  const isLoadingPost = useSelector(selectIsLoadingPost);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const [offset, setOffset] = useState(0);
  const perPage: number = 3;

  //ページ番号
  const [page, setPage] = useState(1);

  const Pagination = withStyles({
    root: {
      display: "inline-block", //中央寄せのためインラインブロックに変更
    },
  })(MuiPagination);

  let handlePageChange = (data: any) => {
    let pageNumber = data["selected"];
    setOffset(pageNumber * perPage);
  };

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
        await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchAsyncGetProfs());
        await dispatch(fetchAsyncGetComments());
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAsyncGetPosts());
    dispatch(fetchAsyncGetProfs());
  }, []);

  return (
    <div>
      <Auth />
      <EditProfile />
      <NewPost />
      <div className={styles.main_header}>
        <h1 className={styles.main_title}>karaimonoyasan</h1>
        {profile?.nickName ? (
          <>
            <button
              className={styles.main_btnModal}
              onClick={() => {
                dispatch(setOpenNewPost());
                dispatch(resetOpenProfile());
              }}
            >
              <MdAddAPhoto />
            </button>
            <div className={styles.main_logout}>
              {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
              <Button
                onClick={() => {
                  localStorage.removeItem("localJWT");
                  dispatch(editNickname(""));
                  dispatch(resetOpenProfile());
                  dispatch(resetOpenNewPost());
                  dispatch(setOpenSignIn());
                }}
              >
                Logout
              </Button>
              <button
                className={styles.main_btnModal}
                onClick={() => {
                  dispatch(setOpenProfile());
                  dispatch(resetOpenNewPost());
                }}
              >
                <StyledBadge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  variant="dot"
                >
                  <Avatar alt="who?" src={profile.img} />
                  {""}
                </StyledBadge>
              </button>
            </div>
          </>
        ) : (
          <div>
            <Button
              onClick={() => {
                dispatch(setOpenSignIn());
                dispatch(resetOpenSignUp());
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                dispatch(setOpenSignUp());
                dispatch(resetOpenSignIn());
              }}
            >
              SignUp
            </Button>
          </div>
        )}
      </div>
      <>
        <div className={styles.main_posts}>
          <Grid container spacing={4}>
            {posts
              .slice(0)
              .reverse()
              .map((post) => (
                <Grid key={post.id} item xs={12} md={4}>
                  <Post
                    postId={post.id}
                    title={post.title}
                    loginId={profile.userProfile}
                    userPost={post.userPost}
                    imageUrl={post.img}
                    liked={post.liked}
                  />
                </Grid>
              ))}
          </Grid>
          <div
            style={{
              textAlign: "center",
              paddingTop: "50px",
              paddingBottom: "50px",
            }}
          >
            <Pagination
              count={Math.ceil(posts.length / perPage)} //総ページ数
              color="primary" //ページネーションの色
              onChange={handlePageChange} //変更されたときに走る関数。第2引数にページ番号が入る
              page={page} //現在のページ番号
            />
          </div>
        </div>
      </>
    </div>
  );
};

export default Main;
