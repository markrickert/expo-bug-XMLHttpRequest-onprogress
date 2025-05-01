import { useAssets } from "expo-asset";
import React from "react";
import { Button, StyleSheet, View, Text } from "react-native";

const url = "http://127.0.0.1:3000/upload";

export default function App() {
  const [assets, error] = useAssets([require("./assets/image.png")]);
  const [log, setLog] = React.useState("press it ⬆️");

  const setStatus = (message: string) => {
    setLog((oldMessage) => oldMessage + "\n" + message);
  };

  const progressHandler = (progressEvent: ProgressEvent) => {
    if (progressEvent.lengthComputable) {
      const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
      setStatus(`Upload progress: ${percentComplete.toFixed(2)}%`);
    } else {
      setStatus("Upload progress: Unknown");
    }
  };

  const upload = () => {
    setLog("Uploading...");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.addEventListener("progress", progressHandler);
    xhr.upload.onprogress = progressHandler;
    // xhr.onprogress = progressHandler; // this only fires once at the end

    // Other events:
    xhr.onload = () => setStatus("Loaded");
    xhr.onerror = () => setStatus("Error");
    xhr.onabort = () => setStatus("Aborted");
    xhr.onloadend = () => setStatus("Completed");
    xhr.ontimeout = () => setStatus("Timeout");
    xhr.onreadystatechange = (event) => {
      console.log("State changed", event);
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          setStatus("Success");
        } else {
          setStatus("Error");
        }
      }
    };

    let formData = new FormData();
    formData.append("file", {
      name: "file.png",
      uri: assets && assets[0].localUri,
      type: "image/png",
    });

    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(formData);
  };
  return (
    <View style={styles.container}>
      <Button title="Test" onPress={upload} disabled={!assets || !assets[0]} />
      <Text>{error ? error.message : log}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
