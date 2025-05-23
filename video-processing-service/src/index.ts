import express from 'express';
import ffmpeg from 'fluent-ffmpeg';


const app = express();
app.use(express.json());

// Test route to check if the server is running
app.get('/', (req, res) => {
  res.send('Video processing service is running');
});

app.post('/process-video', (req: any, res: any) => {

  // Get the paths to the input and output video files from the request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  // Check if the input file path is provided
  if (!inputFilePath) {
    return res.status(400).send('Bad Request: inputFilePath is required');
  }
  // Check if the output file path is provided
  if (!outputFilePath) {
    return res.status(400).send('Bad Request: outputFilePath is required');
  }

  // Process the video file
  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-1:360") // Resize video to 360p
    // .outputOptions('-preset', 'fast') // Use fast preset for encoding
    .on('end', function() {
      console.log('Video processing finished successfully');
      res.status(200).send('Video processing finished successfully');
    })
    .on('error', function(err: any) {
      console.error('Error processing video: ' + err.message);
      res.status(500).send('Internal Server Error: ' + err.message);
    })
    .save(outputFilePath);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `Video processing service listening at http://localhost:${port}`
);
});