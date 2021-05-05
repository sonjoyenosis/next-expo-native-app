import React, { useState, useEffect } from "react";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { ImageType } from "expo-camera/build/Camera.types";

export default function CameraTest() {
  const [hasPermission, setHasPermission] = useState<boolean>();
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [images, setImages] = useState<CameraCapturedPicture[]>([]);

  let camRef = React.useRef<Camera | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <h1> Waiting For Camera Permissions </h1>;
  }

  if (hasPermission === false) {
    return <h1>No access to camera</h1>;
  }

  return (
    <div style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        pictureSize={"1920x1080"}
        autoFocus={"on"}
        focusable
        ref={(ref) => {
          camRef.current = ref;
        }}
      />
      <div>
        <button
          style={styles.button}
          onClick={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <span style={styles.text}> Flip </span>
        </button>

        <button
          style={styles.button}
          onClick={async () => {
            if (camRef.current) {
              console.log("camera found! taking picture....");

              const ratios = ["1:1", "4:3", "16.9"];
              console.log(ratios);

              await ratios.map(async (r) => {
                const picSize = await camRef.current?.getAvailablePictureSizesAsync(
                  r
                );
                console.log("ratio = ", r, "size =", picSize);
              });

              const capturedPhoto = await camRef.current.takePictureAsync({
                imageType: ImageType.png,
                quality: 1.0,
                scale: 1,

                skipProcessing: true,
              });

              console.log({ capturedPhoto });
              setImages([...images, capturedPhoto]);
              console.log("images =", images);
            } else {
              console.log("Camera ref is not found");
              alert("Camera ref is not found");
            }
          }}
        >
          <span style={styles.text}> Capture </span>
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {images.map((image, idx) => {
          console.log("image index =", idx);
          return (
            <img
              src={image.uri}
              height={image.height / 5}
              width={image.width / 5}
            />
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    height: "240px",
    width: "320px",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "purple",
  },
};
