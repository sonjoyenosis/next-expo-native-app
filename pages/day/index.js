import React, { useState, useEffect } from "react";
import { Camera } from "expo-camera";
import { StyleSheet, Text, View } from "react-native-web";

export default function CameraTest() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View> Waiting For Camera Permissions </View>;
  }

  if (hasPermission === false) {
    return <View>No access to camera</View>;
  }

  return (
    <div style={styles.container}>
      <Camera style={styles.camera} type={type}>
        <div style={styles.buttonContainer}>
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
        </div>
      </Camera>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center"
  },
  text: {
    fontSize: 18,
    color: "white"
  }
});
