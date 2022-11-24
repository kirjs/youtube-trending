// @ts-nocheck
import * as functions from "firebase-functions";

const {google} = require('googleapis');
const admin = require('firebase-admin');
admin.initializeApp();

const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyC0wYP-4s0yGuy7gGxq_MFmRXSGsgjM2h8',
});

async function fetchTrendingByLang(lang) {
  const result = await youtube.videos.list({
    part: 'snippet',
    chart: 'mostPopular',
    regionCode: lang,
    maxResults: '250',
  })

  const trending = result.data.items;

  await admin.firestore().collection('messages').doc(lang).set({
    trending: JSON.stringify(trending)
  });

  return trending;
}

async function fetchTrending() {
  return await Promise.all(
    await fetchTrendingByLang('RU'),
    await fetchTrendingByLang('DE'),
    await fetchTrendingByLang('US'),
  );
}


export const helloWorld = functions.https.onRequest(async (request, response) => {
  const trending = await fetchTrending();
  response.json(`{"count2": ${trending.length} }`);
});

export const scheduledFunction = functions.pubsub.schedule('every 60 minutes').onRun(async () => {
  await fetchTrending();
});
