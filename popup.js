// popup.js
document.addEventListener("DOMContentLoaded", function () {
    const startRecordingButton = document.getElementById("startRecording");
    const stopRecordingButton = document.getElementById("stopRecording");

    startRecordingButton.addEventListener("click", startRecording);
    stopRecordingButton.addEventListener("click", stopRecording);

    let mediaRecorder;
    let chunks = [];

    async function startRecording() {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const formData = new FormData();
            formData.append("video", blob, "recorded-screen.webm");

            fetch("https://video-api-5wh1.onrender.com/api/upload", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    // Handle the response from your backend as needed
                    console.log("Video uploaded:", data);
                })
                .catch((error) => {
                    console.error("Error uploading video:", error);
                });
        };

        mediaRecorder.start();
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
    }

    function stopRecording() {
        mediaRecorder.stop();
        startRecordingButton.disabled = false;
        stopRecordingButton.disabled = true;
    }
});  