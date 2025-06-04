import { credential } from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();

// Note: This requires setting an env variable in Cloud Run
/** if (process.env.NODE_ENV !== 'production') {
  firestore.settings({
      host: "localhost:8080", // Default port for Firestore emulator
      ssl: false
  });
} */



const videoCollectionId = 'videos'

// Define the Video interface
export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string
}

/**
 * Fetch a video document by its ID from Firestore.
 * @param VideoId - The ID of the video to retrieve.
 * @returns A promise that resolves to the video data or an empty object if not found.
 */
async function getVideo(VideoId: string) {
    const snapshot = await firestore.collection(videoCollectionId).doc(VideoId).get();
    return (snapshot.data() as Video) ?? {};
}

/**
 * Save a video document to Firestore.
 * @param VideoId - The ID of the video to save.
 * @param video - The video data to save.
 * @returns A promise that resolves when the video is saved.
*/
export function setVideo(VideoId: string, video: Video) {
    return firestore
        .collection(videoCollectionId)
        .doc(VideoId)
        .set(video, { merge: true})
}

/**
 * Check if a video is new by verifying if it has no status field.
 * @param VideoId - The ID of the video to check.
 * @returns A promise that resolves to true if the video is new, false otherwise.
*/
export async function isVideoNew(VideoId: string) {
    const video = await getVideo(VideoId);
    return video?.status === undefined;
}
