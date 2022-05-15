import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@material-ui/core";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";

import Webcam from "react-webcam";
import * as cvstfjs from "@microsoft/customvision-tfjs";

function App() {
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));
  const classes = useStyles();

  // const [start, setStart] = useState(false);
  const webcamRef = React.useRef(null);

  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
    async function predictionFunction() {
      setVideoHeight(webcamRef.current.video.videoHeight);
      setVideoWidth(webcamRef.current.video.videoWidth);
      //testing azure vision api
      const model = new cvstfjs.ObjectDetectionModel();
      // Load the model.json file from the modelPath defined in the Dynamic Properties above
      await model.loadModelAsync("http://localhost:81/model.json");
      const predictions = await model.executeAsync(
        document.getElementById("img")
      );
      var cnvs = document.getElementById("myCanvas");
      cnvs.style.position = "absolute";
      var ctx = cnvs.getContext("2d");
      ctx.clearRect(0, 0, cnvs.width, cnvs.height);
      console.log(predictions[0]);
      if (predictions[0].length > 0) {
        for (let n = 0; n < predictions[0].length; n++) {
    // Check scores
          if (predictions[1][n] > 0.5) {
            const p = document.createElement("p");
            p.innerText = "Dent" + ": " + Math.round(parseFloat(predictions[1][n]) * 100) + "%";
            let bboxLeft = predictions[0][n][0] * webcamRef.current.video.videoWidth;
            let bboxTop = predictions[0][n][1] * webcamRef.current.video.videoHeight;
            let bboxWidth = predictions[0][n][2] * webcamRef.current.video.videoWidth - bboxLeft;
            let bboxHeight = predictions[0][n][3] * webcamRef.current.video.videoHeight - bboxTop;
            ctx.beginPath();
            ctx.font = "28px Arial";
            ctx.fillStyle = "red";
            // eslint-disable-next-line no-useless-concat
            //"Scratch" + ": " +
            ctx.fillText( "Dent" + ": " + Math.round(parseFloat(predictions[1][n]) * 100) + "%", bboxLeft, bboxTop + 70 );
            ctx.rect(bboxLeft, bboxTop + 80, bboxWidth, bboxHeight);
            ctx.strokeStyle = "#FF0000";
            ctx.lineWidth = 3;
            ctx.stroke();
          }}
          setTimeout(() => predictionFunction(), 500);
    }}

  // useEffect(() => {
  //   //prevent initial triggering
  //   if (mounted.current) {
  //     console.log("hello");
  //     predictionFunction();
  //   } else {
  //     mounted.current = true;
  //   }
  // }, [start]);


  const videoConstraints = {
    height: 520,
    width: 1000,
    // height: 120,
    facingMode: "environment",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        marginTop: -8,
        backgroundImage:
          "radial-gradient( circle 993px at 0.5% 50.5%,  rgba(192,192,192,0.3) 0%, rgba(192,192,192,0.3) 100.2% )",
      }}
    >
      <AppBar position="static">
        <Toolbar>
            <img src = "AI-Sees white.png" width="250px" height="80px"/>
        </Toolbar>
      </AppBar>
      <Box mt={1} />
      <Grid
        container
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          padding: 10,
        }}
      >
        <Grid
          item
          xs={12}
          md={12}
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <>
            {" "}
            <Box mt={15} />
            <Box mt={2} />
            {
              <Button
                variant={"contained"}
                style={{
                  color: "white",
                  backgroundColor: "blue",
                  width: "50%",
                  maxWidth: "250px",
                }}
                onClick={() => {
                  predictionFunction();
                }}
              >
                Start Detect
              </Button>
            }
            <Box mt={2} />{" "}
          </>
          <canvas
            id="myCanvas"
            width={videoWidth}
            height={videoHeight}
            style={{ backgroundColor: "transparent" }}
          />
          <Webcam
            audio={false}
            id="img"
            ref={webcamRef}
            //  width={640}
            screenshotQuality={1}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
          {/* <img
          style={{ width: "100%", objectFit: "fill" }}
          id="img"
          src={imageData}
        ></img>  */}
        </Grid>
        <Grid item xs={12} md={12}></Grid>
      </Grid>
    </div>
  );
}

export default App;
