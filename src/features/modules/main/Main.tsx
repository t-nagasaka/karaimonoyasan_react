import React, { useEffect, useState } from "react";
import Auth from "../auth/Auth";

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

import { FaEdit } from "react-icons/fa";
import MediaQuery from "react-responsive";

import {
  editNickname,
  editUserProfile,
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
  const perPage: number = 6;

  let handlePageChange = (data: any) => {
    let pageNumber = data["selected"];
    setOffset(pageNumber * perPage);
    window.scroll({ top: 0, behavior: "smooth" });
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
    dispatch(fetchAsyncGetComments());
  }, []);

  return (
    <div>
      <Auth />
      <EditProfile />
      <NewPost />
      <MediaQuery query="(max-width: 420px)">
        <div className={styles.main_mobileHeader}>
          <button
            className={styles.main_app_name}
            onClick={() => {
              window.scroll({ top: 0, behavior: "smooth" });
            }}
          >
            karaimonoyasan
          </button>
          <div className={styles.main_test}>
            <button
              className={styles.main_mobileEditBtnModal}
              onClick={() => {
                if (profile?.userProfile !== 0) {
                  dispatch(setOpenNewPost());
                  dispatch(resetOpenProfile());
                } else {
                  dispatch(setOpenSignUp());
                }
              }}
            >
              <FaEdit />
            </button>
          </div>
          {profile?.userProfile !== 0 ? (
            <>
              <div className={styles.main_logout}>
                {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
                <Button
                  onClick={() => {
                    localStorage.removeItem("localJWT");
                    dispatch(editUserProfile());
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
      </MediaQuery>
      <MediaQuery query="(min-width: 420px)">
        <div className={styles.main_header}>
          <button
            className={styles.main_app_name}
            onClick={() => {
              window.scroll({ top: 0, behavior: "smooth" });
            }}
          >
            karaimonoyasan
          </button>
          <div className={styles.main_test}>
            <button
              className={styles.main_editBtnModal}
              onClick={() => {
                if (profile?.userProfile !== 0) {
                  dispatch(setOpenNewPost());
                  dispatch(resetOpenProfile());
                } else {
                  dispatch(setOpenSignUp());
                }
              }}
            >
              <FaEdit />
            </button>
          </div>
          {profile?.userProfile !== 0 ? (
            <>
              <div className={styles.main_logout}>
                {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
                <Button
                  onClick={() => {
                    localStorage.removeItem("localJWT");
                    dispatch(editUserProfile());
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
      </MediaQuery>

      <div className={styles.main_posts}>
        <Grid container spacing={2}>
          {posts
            .slice()
            .reverse()
            .slice(offset, offset + perPage)
            .map((post) => (
              <Grid key={post.id} item xs={12} sm={6} md={4} lg={3}>
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
        <ReactPaginate
          previousLabel="<" //前のページ番号に戻すリンクのテキスト
          nextLabel=">" //次のページに進むボタンのテキスト
          breakLabel="..." // ページがたくさんあるときに表示しない番号に当たる部分をどう表示するか
          pageCount={Math.ceil(posts.length / perPage)} // 全部のページ数。端数の場合も考えて切り上げに。
          marginPagesDisplayed={2} // 一番最初と最後を基準にして、そこからいくつページ数を表示するか
          pageRangeDisplayed={5} // アクティブなページを基準にして、そこからいくつページ数を表示するか
          onPageChange={handlePageChange} // クリック時のfunction
          containerClassName="pagination" //ページネーションリンクの親要素のクラス名
          // pageClassName="page-item" //各子要素(li要素)のクラス名
          // pageLinkClassName="page-link" //ページネーションのリンクのクラス名
          activeClassName="active" //今いるページ番号のクラス名。今いるページの番号だけ太字にしたりできます
          previousClassName="pagination__previous" // '<'の親要素(li)のクラス名
          nextClassName="pagination__next" //'>'の親要素(li)のクラス名
          previousLinkClassName="page-link" //'<'のリンクのクラス名
          // nextLinkClassName="page-link" //'>'のリンクのクラス名
          disabledClassName="pagination__disabled" //先頭 or 末尾に行ったときにそれ以上戻れ(進め)なくするためのクラス
          // breakClassName="page-item" // 上記の「…」のクラス名
          // breakLinkClassName="page-link" // 「…」の中のリンクにつけるクラス
        />
      </div>
    </div>
  );
};
export default Main;
