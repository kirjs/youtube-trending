// @ts-nocheck
import * as functions from "firebase-functions";

const {google} = require('googleapis');
const admin = require('firebase-admin');
admin.initializeApp();

const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyC0wYP-4s0yGuy7gGxq_MFmRXSGsgjM2h8',
});

async function fetchTrending() {
  const result = await youtube.videos.list({
    part: 'snippet',
    chart: 'mostPopular',
    regionCode: 'RU',
    maxResults: '250',
  })

  const trending = result.data.items;

  await admin.firestore().collection('messages').doc('latest').set({
    trending: JSON.stringify(trending)
  });

  return trending;
}

export const helloWorld = functions.https.onRequest(async (request, response) => {
  const trending = await fetchTrending();
  response.json(`{"count": ${trending.length} }`);
});

export const scheduledFunction = functions.pubsub.schedule('every 60 minutes').onRun(async () => {
  await fetchTrending();
});
