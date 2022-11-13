// @ts-nocheck
import * as functions from "firebase-functions";
const {google} = require('googleapis');

const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyC0wYP-4s0yGuy7gGxq_MFmRXSGsgjM2h8',
});

export const helloWorld = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  const r = await youtube.videos.list({
    part: 'snippet',
    chart: 'mostPopular',
    regionCode: 'RU',
    maxResults: '250',
  })



  response.json(r);
});


