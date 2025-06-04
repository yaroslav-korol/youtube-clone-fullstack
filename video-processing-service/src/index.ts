import express from 'express';
import {
  convertVideo,
  createLocalDirectories,
  deleteProcessedVideo,
  deleteRawVideo,
  downloadRawVideo,
  uploadProcessedVideo
} from './gcp-storage';
import { isVideoNew, setVideo } from './firestore';


// Create local directories for videos
createLocalDirectories();

const app = express();
app.use(express.json());

// Test route to check if the server is running
app.get('/', (req, res) => {
  res.send('Video processing service is running');
});

// Process a video file from Cloud Storage into 360p
app.post('/process-video', async (req: any, res: any) => {

  // Get the bucket and file names from the Cloud Pub/Sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf-8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload: name is required');
    }

  } catch (error) {
    console.error(error);
    return res.status(400).send('Bad Request: Missing file name');
  }

  const inputFileName = data.name;  // Format of <UID>-<DATE>.<EXTENSION>
  const outputFileName = `processed-${inputFileName}`;
  const videoId = inputFileName.split('.')[0];

  if (!isVideoNew(videoId)) {
    return res.status(400).send('Bad Request: Video already processing or processed');
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split('-')[0],
      status: 'processing'
    });
  }

  // Download the raw video from Cloud Storage
  await downloadRawVideo(inputFileName);
  console.log(`Downloaded raw video: ${inputFileName}`);
  
  // Convert the video to 360p
  try {
    await convertVideo(inputFileName, outputFileName)
  } catch (err) {
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);
    return res.status(500).send('Processing failed');
  }

  // Upload the processed video to Cloud Storage
  await uploadProcessedVideo(outputFileName);

  await setVideo(videoId, {
    status: 'processed',
    filename: outputFileName
  });

  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ]);

  return res.status(200).send('Video processed successfully');
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `Video processing service listening at http://localhost:${port}`
  );
});
