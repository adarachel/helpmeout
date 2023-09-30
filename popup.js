let mediaRecorder;
let recordedChunks = [];

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

function handleStop() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('video', blob, 'screen-recording.webm');

    fetch('https://video-api-5wh1.onrender.com/api', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                console.log('Screen recording uploaded successfully!');
            } else {
                console.error('Failed to upload screen recording.');
            }
        })
        .catch(error => {
            console.error('Error occurred while uploading screen recording:', error);
        });

    recordedChunks = [];
    mediaRecorder = null;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
}

document.getElementById('startBtn').addEventListener('click', () => {
    chrome.desktopCapture.chooseDesktopMedia(['screen'], (streamId) => {
        navigator.webkitGetUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId
                }
            }
        }, (stream) => {
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.onstop = handleStop;
            mediaRecorder.start();

            document.getElementById('startBtn').disabled = true;
            document.getElementById('stopBtn').disabled = false;
        }, (error) => {
            console.error('Error occurred while accessing screen media:', error);
        });
    });
});

document.getElementById('stopBtn').addEventListener('click', () => {
    mediaRecorder.stop();
});