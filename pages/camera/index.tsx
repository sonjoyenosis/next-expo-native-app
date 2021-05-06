import React, { useState, useEffect } from "react";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { ImageType } from "expo-camera/build/Camera.types";

export default function CameraTest() {
  const [hasPermission, setHasPermission] = useState<boolean>();
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraResolutionInfo, setCameraResolutionInfo] = useState<string[]>(
    []
  );
  const [images, setImages] = useState<CameraCapturedPicture[]>([]);

  let camRef = React.useRef<Camera | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const onCameraReady = () => {
    const ratios = ["1:1", "4:3", "16.9"];

    setCameraReady(true);

    Promise.all(
      ratios.map((r) => {
        return camRef.current
          ?.getAvailablePictureSizesAsync(r)
          .then((picSize) => {
            const camResInfo = `ratio: ${r}, size: ${picSize}\n`;
            return camResInfo;
          })
          .catch((err) => {
            console.log(
              "Err getting the camera resolution info, er =",
              err.message
            );
            return "";
          });
      })
    ).then((result) => {
      setCameraResolutionInfo(result as string[]);
    });
  };

  const handleCapture = async () => {
    if (!cameraReady) {
      console.log("Camera is not ready yet!");
      return;
    }

    if (camRef.current) {
      console.log("camera found! taking picture....");

      const capturedPhoto = await camRef.current.takePictureAsync({
        imageType: ImageType.png,
        quality: 1.0,
        scale: 1,

        skipProcessing: true,
      });

      console.log(capturedPhoto);
      setImages([...images, capturedPhoto]);
    } else {
      console.log("Camera ref is not found");
    }
  };

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
        onCameraReady={onCameraReady}
        ref={(ref) => {
          camRef.current = ref;
        }}
      />

      <div>
        {cameraResolutionInfo.map((camRes) => (
          <p> {camRes} </p>
        ))}
      </div>

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

        <button style={styles.button} onClick={handleCapture}>
          <span style={styles.text}> Capture </span>
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {images.map((image, idx) => {
          return (
            <div
              style={{
                height: `${image.height / 3 + 120}px`,
                width: `${image.width / 3}px`,
              }}
            >
              <img
                src={image.uri}
                height={image.height / 3}
                width={image.width / 3}
              />
              <p
                style={{
                  height: `${100}px`,
                  width: `${image.width / 3}px`,
                  overflowY: "visible",
                  overflowX: "scroll",
                }}
              >
                aspectRatio: {Number(image.exif.aspectRatio).toFixed(3)} <br />
                height: {image.exif.height} <br />
                width: {image.exif.width} <br />
                resizeMode: {image.exif.resizeMode} <br />
              </p>
            </div>
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
