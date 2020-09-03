import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Image, Grid, Icon } from "semantic-ui-react";
import AvatarEdit from "react-avatar-editor";
import firebaseApp from "../../firebase";
import { userActions, userSelector } from "../../features/userSlice";
import { publicChatActions } from "../../features/publicChatSlice";

// in Profile
function AvatarModal({ modal, closeModal }) {
  const fileRef = useRef();
  const avatarRef = useRef();
  const dispatch = useDispatch();

  const currentUser = useSelector(userSelector.currentUser);

  const [blob, setBlob] = useState(null);
  const [croppedImageURL, setCroppedImageURL] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!modal) {
      setBlob(null);
      setCroppedImageURL("");
      setPreviewImage(null);
      setScale(1);
    }
  }, [modal]);

  const handleScale = useCallback(e => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  }, []);

  const handleFile = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, [fileRef.current]);

  const handleFileInput = useCallback(e => {
    const file = e.target.files[0];
    const reader = new FileReader(file);

    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
  }, []);

  const handleCoppedImage = useCallback(() => {
    if (avatarRef.current) {
      avatarRef.current.getImageScaledToCanvas().toBlob(blob => {
        const imageURL = URL.createObjectURL(blob);
        setCroppedImageURL(imageURL);
        setBlob(blob);
      });
    }
  }, []);

  const handleAvatarUpdate = useCallback(async () => {
    try {
      setUpdateLoading(true);
      const avatarURL = await firebaseApp.updateAvatar(currentUser.id, blob);
      console.log("``avatarURL``", avatarURL);

      dispatch(
        userActions.setCurrentUser({
          ...currentUser,
          avatarURL
        })
      );
      closeModal();
      // dispatch(publicChatActions.callReload());
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateLoading(false);
    }
  }, [blob, currentUser]);

  return (
    <Modal open={modal} onClose={closeModal}>
      <Modal.Header style={{ backgroundColor: "#fffff0" }}>
        아바타 변경
      </Modal.Header>
      <Modal.Content style={{ backgroundColor: "#fffff0" }}>
        <span style={{ display: "inline-block", marginLeft: 50 }}>
          <AvatarEdit
            ref={avatarRef}
            width={200}
            height={200}
            image={previewImage}
            border={20}
            scale={scale}
          />
          <br />
          Zoom:
          <input
            type="range"
            max="2"
            min="1"
            step="0.01"
            defaultValue="1"
            onChange={handleScale}
          />
        </span>
        <span
          style={{ display: "inline-block", marginLeft: 150, marginBottom: 40 }}
        >
          {croppedImageURL && (
            <Image src={croppedImageURL} width={200} height={200} bordered />
          )}
        </span>
        <input type="file" hidden ref={fileRef} onChange={handleFileInput} />
      </Modal.Content>
      <Modal.Actions style={{ backgroundColor: "#f1f2f6" }}>
        <Button inverted onClick={handleFile} primary>
          사진선택
        </Button>
        {previewImage && (
          <Button onClick={handleCoppedImage} inverted primary>
            미리보기
          </Button>
        )}

        {croppedImageURL && (
          <Button
            inverted
            primary
            onClick={handleAvatarUpdate}
            loading={updateLoading}
          >
            아바타 변경
          </Button>
        )}

        <Button inverted onClick={closeModal} color="red">
          취소
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default AvatarModal;
