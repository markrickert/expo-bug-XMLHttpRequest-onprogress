const express = require("express"),
  app = express(),
  formidable = require("formidable"),
  throttle = require("express-throttle-bandwidth");

const port = process.env.PORT || 3000;

app.set("port", port);
app.use(throttle(1024 * 512));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/upload", (req, res) => {
  const form = new formidable.IncomingForm();

  form.on("progress", (bytesReceived, bytesExpected) => {
    const barLength = 40;
    const percent = bytesExpected ? bytesReceived / bytesExpected : 0;
    const complete = Math.round(barLength * percent);
    const incomplete = barLength - complete;
    const progressBar = `[${"#".repeat(complete)}${"-".repeat(incomplete)}]`;

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Uploading ${progressBar} ${Math.round(percent * 100)}%`);
  });

  form.on("end", () => {
    console.log("\nUpload complete!");
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing the file:", err);
      return res.status(500).send("Upload error");
    }
    console.log("\n-----------");
    console.log("Fields", fields);
    console.log("Received:", Object.keys(files));
    res.send("Thank you");
  });
});

app.listen(port, () => {
  console.log("\nUpload server running on http://localhost:" + port + "/upload");
});
