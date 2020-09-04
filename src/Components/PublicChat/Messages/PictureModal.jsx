import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Image, Grid, Icon } from "semantic-ui-react";
import { userSelector } from "../../../features/userSlice";
import PreviewImages from "./PreviewImages";

// in MessageForm
function PictureModal({ modal, closeModal }) {
  const fileRef = useRef();
  const dispatch = useDispatch();

  const currentUser = useSelector(userSelector.currentUser);

  const [previewImages, setPreviewImages] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  console.log("previewImages", previewImages);

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

  const handleFileInput = useCallback(e => {
    const files = [].map.call(e.target.files, file => file);
    setPreviewImages(files);
  }, []);

  const cancelPicture = useCallback(lastModified => {
    setPreviewImages(prev =>
      prev.filter(image => image.lastModified !== lastModified)
    );
  }, []);

  const handleSendImages = useCallback(() => {
    if (previewImages) {
    }
  }, [previewImages]);

  return (
    <Modal open={modal} onClose={closeModal}>
      <Modal.Header style={{ backgroundColor: "#fffff0" }}>
        사진 전송
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
            color="olive"
            onClick={handleSendImages}
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
