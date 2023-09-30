document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    let mediaRecorder;
    let recordedChunks = [];

    startButton.addEventListener('click', async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen' }
        });

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
            recordedChunks.push(event.data);
        };
        mediaRecorder.start();

        startButton.disabled = true;
        stopButton.disabled = false;
    });

    stopButton.addEventListener('click', () => {
        mediaRecorder.stop();

        stopButton.disabled = true;
        startButton.disabled = false;

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const formData = new FormData();
            formData.append('video', blob, 'recorded.webm');

            fetch('https://video-api-5wh1.onrender.com/api', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Video uploaded successfully:', data);
                })
                .catch(error => {
                    console.error('Error uploading video:', error);
                });

            recordedChunks = [];
        };
    });
});