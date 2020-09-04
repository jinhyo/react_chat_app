import React from "react";
import { Image } from "semantic-ui-react";

function PreviewImages({ previewImages, cancelPicture }) {
  return (
    <Image.Group>
      {previewImages &&
        previewImages.map(image => (
          <Image
            key={image.lastModified}
            src={URL.createObjectURL(image)}
            width={200}
            height={200}
            bordered
            label={{
              as: "a",
              size: "mini",
              floating: true,
              icon: "cancel",
              onClick: () => cancelPicture(image.lastModified)
            }}
          />
        ))}
    </Image.Group>
  );
}

export default PreviewImages;
