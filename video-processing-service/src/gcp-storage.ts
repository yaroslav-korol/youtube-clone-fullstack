import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { rejects } from 'assert';


const storage = new Storage();

const rawVideoBucket = "yk-youtube-raw-videos";
const processedVideoBucket = "yk-youtube-processed-videos";

const localRawVideoPath = "./raw-videos/";
const localProcessedVideoPath = "./processed-videos/";


/**
 * Create local directories for raw and processed videos if they do not exist
 */
export function createLocalDirectories() {
	ensureDirectoryExists(localRawVideoPath);
	ensureDirectoryExists(localProcessedVideoPath);
}


/**
 * Ensure a directory exists, creating it if it does not
 * @param {string} dirPath - The path to the directory
 */
function ensureDirectoryExists(dirPath: string) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true }); // recursive: true enables creating nested directories
		console.log(`Directory created at: ${dirPath}`);
	}
}


/**
 * Convert video with ffmpeg library
 * @param rawVideoName  - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns {Promise<void>} - A promise that resolves when the video is converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string): Promise<void> {
	return new Promise((resolve, reject) => {
		ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
			.outputOptions("-vf", "scale=-1:360") // Resize video to 360p
			// .outputOptions('-preset', 'fast') // Use fast preset for encoding
			.on('end', function() {
					console.log('Video processing finished successfully');
					resolve();
			})
			.on('error', function(err: any) {
					console.error('Error processing video: ' + err.message);
					reject(err);
			})
			.save(`${localProcessedVideoPath}/${processedVideoName}`);
	})
}


/**
 * Download a raw video from Google Cloud Storage
 * @param {string} downloadFileName - The name of the video file to download
 * {@link rawVideoBucket} bucket into {@link localRawVideoPath} directory.
 * @returns {Promise<void>} - A promise that resolves when the file is downloaded.
 */
export async function downloadRawVideo(downloadFileName: string): Promise<void> {
	await storage.bucket(rawVideoBucket)
		.file(downloadFileName)
		.download({ destination: `${localRawVideoPath}/${downloadFileName}` });
	
	console.log(
		`gs://${rawVideoBucket}/${downloadFileName} downloaded to ${localRawVideoPath}/${downloadFileName}`
	);
}


/**
 * Upload a processed video to Google Cloud Storage
 * @param {string} uploadFileName - The name of the video file to upload
 * {@link localProcessedVideoPath} directory into {@link processedVideoBucket} bucket.
 * @returns {Promise<void>} - A promise that resolves when the file is uploaded.
 */
export async function uploadProcessedVideo(uploadFileName: string): Promise<void> {
	const bucket = storage.bucket(processedVideoBucket);

	// Upload the file to the bucket
	await bucket.upload(`${localProcessedVideoPath}/${uploadFileName}`, {
		destination: uploadFileName,
		});
	console.log(
		`${localProcessedVideoPath}/${uploadFileName} uploaded to gs://${processedVideoBucket}/${uploadFileName}`
	);

	// Set the file to be publicly accessible
	await bucket.file(uploadFileName).makePublic();
	console.log(
		`gs://${processedVideoBucket}/${uploadFileName} is now publicly accessible`
	);
}


/** 
 * Delete a raw video from local storage
 * @param {string} rawFileName - The name of the video file to delete
 * {@link localRawVideoPath} directory.
 * @returns {Promise<void>} - A promise that resolves when the file is deleted.
 */
export function deleteRawVideo(rawFileName: string): Promise<void> {
	return deleteFile(`${localRawVideoPath}/${rawFileName}`);
}


/**
 * Delete a processed video from local storage
 * @param {string} processedFileName - The name of the video file to delete
 * {@link localProcessedVideoPath} directory.
 * @returns {Promise<void>} - A promise that resolves when the file is deleted.
 */
export function deleteProcessedVideo(processedFileName: string): Promise<void> {
	return deleteFile(`${localProcessedVideoPath}/${processedFileName}`);
}


/**
 * Delete a file from local storage
 * @param {string} filePath - The path to the file to delete
 * @returns {Promise<void>} - A promise that resolves when the file is deleted.
 */
function deleteFile(filePath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(filePath)) {
			console.log(`File not found at ${filePath}, skipping deletion`);
			resolve();
		}
		fs.unlink(filePath, (err) => {
			if (err) {
          console.error(`Failed to delete file at ${filePath}`, err);
          reject(err);
			} else {
          console.log(`File deleted at ${filePath}`);
          resolve();
			}
		});
	});
}
