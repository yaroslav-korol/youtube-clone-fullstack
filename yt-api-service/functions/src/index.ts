import * as functions from "firebase-functions/v1";
import * as logger from "firebase-functions/logger";
import {Firestore} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin/app";
import {onCall} from "firebase-functions/https";
import {Storage} from "@google-cloud/storage";


initializeApp();

const firestore = new Firestore();
const storage = new Storage();
const rawVideoBucket = "yk-youtube-raw-videos";
const videoCollectionId = "videos";
const videosFetchLimit = 10; // Limit for fetching videos for rendering in UI


// Define the Video interface
export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string
}


export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});


export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  // Check if the user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(rawVideoBucket);

  // Generate a unique filename
  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

  // Get a v4 signed URL for uploading file
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  return {url, fileName};
});


export const getVideos = onCall({maxInstances: 1}, async () => {
  const querySnapshot =
    await firestore.collection(videoCollectionId).limit(videosFetchLimit).get();
  return querySnapshot.docs.map((doc) => doc.data());
});
