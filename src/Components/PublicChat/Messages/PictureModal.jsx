import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Image, Grid, Icon } from "semantic-ui-react";
import { userSelector } from "../../../features/userSlice";
import PreviewImages from "./PreviewImages";
import { publicChatSelector } from "../../../features/publicChatSlice";
import mime from "mime-types";
import firebaseApp from "../../../firebase";

// in MessageForm
function PictureModal({ modal, closeModal, scrollToBottom }) {
  const fileRef = useRef();

  const currentUser = useSelector(userSelector.currentUser);
  const currentRoom = useSelector(publicChatSelector.currentRoom);

  const [previewImages, setPreviewImages] = useState(null);
  const [imageTypes] = useState(["image/jpeg", "image/png", "image/gif"]);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (!modal) {
      setPreviewImages(null);
    }
  }, [modal]);

  const handleFile = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, [fileRef]);

  function isAuthorized(file) {
    return imageTypes.includes(mime.lookup(file.name));
  }

  const handleFileInput = useCallback(e => {
    let files = [];

    [].forEach.call(e.target.files, file => {
      if (isAuthorized(file, imageTypes)) {
        files.push(file);
      }
    });

    setPreviewImages(files);
  }, []);

  const cancelPicture = useCallback(lastModified => {
    setPreviewImages(prev =>
      prev.filter(image => image.lastModified !== lastModified)
    );
  }, []);

  const handleSendImages = useCallback(async () => {
    if (previewImages) {
      setUploadLoading(true);
      const imageURLs = previewImages.map(async image => {
        const metaData = { contentType: mime.lookup(image.name) };
        try {
          return await firebaseApp.sendImageFile(
            image,
            metaData,
            currentRoom.id,
            currentRoom
          );
        } catch (error) {
          console.error(error);
        }
      });

      const createdBy = {
        id: currentUser.id,
        nickname: currentUser.nickname
      };

      try {
        const totalImageURLs = await Promise.all(imageURLs);
        console.log("totalImageURLs", totalImageURLs);

        await firebaseApp.sendImageMessage(
          totalImageURLs,
          createdBy,
          currentRoom.id
        );
        setUploadLoading(false);
        // scrollToBottom({bahavior:'smooth'});
        closeModal();
      } catch (error) {
        console.error(error);
      }
    }
  }, [previewImages, currentRoom, currentUser]);

  return (
    <Modal open={modal} onClose={closeModal}>
      <Modal.Header style={{ backgroundColor: "#fffff0" }}>
        사진 전송 - <span style={{ fontSize: 16 }}>jpeg, png, gif</span>
      </Modal.Header>
      <Modal.Content style={{ backgroundColor: "#fffff0" }}>
        <input
          type="file"
          multiple
          hidden
          ref={fileRef}
          onChange={handleFileInput}
        />

        <PreviewImages
          previewImages={previewImages}
          cancelPicture={cancelPicture}
        />
      </Modal.Content>
      <Modal.Actions style={{ backgroundColor: "#f1f2f6" }}>
        <Button inverted onClick={handleFile} primary>
          사진 선택
        </Button>
        {previewImages && (
          <Button
            inverted
            onClick={handleFile}
            primary
            onClick={handleSendImages}
            loading={uploadLoading}
          >
            사진 전송
          </Button>
        )}

        <Button inverted onClick={closeModal} color="red">
          취소
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default PictureModal;
