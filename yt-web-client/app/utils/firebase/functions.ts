import { getFunctions, httpsCallable } from "firebase/functions";


const functions = getFunctions();
const generateUploadUrlFunction = httpsCallable(functions, 'generateUploadUrl');


export async function uploadVideo(file: File) {
    const response: any = await generateUploadUrlFunction({
        fileExtension: file.name.split('.').pop()
    });

    // Upload the file to the signed URL
    const uploadResult = await fetch(response?.data?.url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-type': file.type,
        },
    });

    return uploadResult;
}