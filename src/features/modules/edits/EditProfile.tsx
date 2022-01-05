import React, { useState } from "react";
import Modal from "react-modal";
import styles from "../main/Main.module.scss";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";

import { File } from "../../types/editProfile";

import {
  editNickname,
  selectProfile,
  selectOpenProfile,
  resetOpenProfile,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncUpdateProf,
} from "../../slices/authSlice";

import { Button, TextField, IconButton } from "@material-ui/core";
import { MdAddAPhoto } from "react-icons/md";
import { string } from "yup";

const customStyles = {
  content: {
    top: "55%",
    left: "50%",

    width: 280,
    height: 220,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const EditProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openProfile = useSelector(selectOpenProfile);
  const profile = useSelector(selectProfile);
  const [image, setImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState<String>("");

  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = {
      id: profile.id,
      nickName: profile.nickName,
      spicyResist: profile.spicyResist,
      img: image,
    };

    await dispatch(fetchCredStart());
    await dispatch(fetchAsyncUpdateProf(packet));
    await dispatch(fetchCredEnd());
    await dispatch(resetOpenProfile());
  };

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };
  const handlerResetPicture = () => {
    setImage(null);
    setFileName("");
    dispatch(resetOpenProfile());
  };

  return (
    <>
      <Modal
        isOpen={openProfile}
        onRequestClose={async () => {
          await dispatch(resetOpenProfile());
        }}
        style={customStyles}
      >
        <form className={styles.main_signUp}>
          <h1 className={styles.main_title}>Profile Edit</h1>

          <br />
          <TextField
            placeholder="nickname"
            type="text"
            value={profile?.nickName}
            onChange={(e) => dispatch(editNickname(e.target.value))}
          />

          <input
            type="file"
            id="imageInput"
            hidden={true}
            onChange={(e) => {
              setImage(e.target.files![0]);
              setFileName(e.target.files![0].name);
            }}
          />
          <br />
          <IconButton onClick={handlerEditPicture}>
            <MdAddAPhoto />
          </IconButton>
          <p className={styles.main_profile_img}>{fileName}</p>
          <br />
          <Button
            disabled={!profile?.nickName}
            variant="contained"
            color="primary"
            type="submit"
            onClick={updateProfile}
          >
            Update
          </Button>
          <Button
            // disabled={!profile?.nickName}
            // variant="contained"
            color="secondary"
            type="reset"
            onClick={handlerResetPicture}
          >
            Cancel
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default EditProfile;
