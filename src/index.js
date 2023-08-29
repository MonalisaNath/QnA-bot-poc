/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0

ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3.

Purpose:
index.js is part of a tutorial demonstrating how to:
- Transcribe speech in real-time using Amazon Transcribe
- Detect the language of the transcription using Amazon Comprehend
- Translate the transcription using Amazon Translate
- Send the transcription and translation by email using Amazon Simple Email Service (Amazon SES)
*/

// snippet-start:[transcribe.JavaScript.streaming.indexv3]
import * as TranscribeClient from "./libs/transcribeClient.js";
//import * as TranslateClient from "./libs/translateClient.js";
//import * as EmailClient from "./libs/emailClient.js";
import * as SagemakerClient from "./libs/sagemakerClient.js";


import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import {
    fromCognitoIdentityPool,
} from "@aws-sdk/credential-provider-cognito-identity";

import { Polly } from "@aws-sdk/client-polly";
import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner";

const recordButton = document.getElementById("record");
const inputLanguageList = document.getElementById("inputLanguageList");
const transcribedText = document.getElementById("transcribedText");
const translatedText = document.getElementById("translatedText");

const client = new Polly({
  region: "your region",//add the region where you want to deploy
  credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: " "}),//add the region where you want to deploy
      identityPoolId: "id" // IDENTITY_POOL_ID
  }),
});

const speechParams = {
  OutputFormat: "mp3", // For example, 'mp3'
  SampleRate: "22050", // For example, '16000
  Text: "", // The 'speakText' function supplies this value
  TextType: "text", // For example, "text"
  VoiceId: "Ivy" // For example, "Matthew"
};
//const translationLanguageList = document.getElementById("translationLanguageList");
//const email = document.getElementById("email");

window.onRecordPress = () => {
  if (recordButton.getAttribute("class") === "recordInactive") {
    startRecording();
  } else {
    stopRecording();
  }
};

const startRecording = async() => {
  window.clearTranscription();
  const selectedLanguage = inputLanguageList.value;
  if (selectedLanguage === "nan") {
    alert("Please select a language");
    return;
  }
  inputLanguageList.disabled = true;
  recordButton.setAttribute("class", "recordActive");
  try {
    await TranscribeClient.startRecording(selectedLanguage, onTranscriptionDataReceived);
  } catch(error) {
    alert("An error occurred while recording: " + error.message);
    stopRecording();
  }

  const sourceText = transcribedText.innerHTML;
  const payload = {
    "inputs": [[
        {"role": "user", "content":sourceText},
    ]],
    "parameters": {"max_new_tokens": 200, "top_p": 0.9, "temperature": 0.1}// Change these parameters according to your usecase
    }
  if (sourceText.length === 0) {
    alert("No text to answer!");
    return;
  }

const endpoint= '';// your endpoint name
   try {
     const answer = await SagemakerClient.queryEndpoint( endpoint,payload);
     if (answer) {
       //translatedText.innerHTML = JSON.stringify(answer);
       translatedText.innerHTML = answer;
     }
   } catch (error) {
     alert("There was an error translating the text: " + error.message);
   }

   speechParams.Text = translatedText.innerHTML;
   //speechParams.Text = "hello how are you";
   //speechParams.Text = document.getElementById("textEntry").value;
   try{
       let url = await getSynthesizeSpeechUrl({
           client, params: speechParams
       });
       console.log(url);
       // Load the URL of the voice recording into the browser
       document.getElementById('audioSource').src = url;
       document.getElementById('audioPlayback').load();
       document.getElementById('result').innerHTML = "Speech ready to play.";
   } catch (err) {
       console.log("Error", err);
       document.getElementById('result').innerHTML = err;
   }

};

const onTranscriptionDataReceived = (data) => {
  transcribedText.insertAdjacentHTML("beforeend", data);
}


const stopRecording = function () {
  inputLanguageList.disabled = false;
  recordButton.setAttribute("class", "recordInactive");
  TranscribeClient.stopRecording();
};

  


window.clearTranscription = () => {
  transcribedText.innerHTML = "";
  translatedText.innerHTML = "";
};





