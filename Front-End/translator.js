const videoElement = document.getElementById('camera');
const webcam = new Webcam(videoElement, 'user');

// Start the webcam automatically when the page loads
webcam.start()
    .then(result => {
        console.log("webcam started");
    })
    .catch(err => {
        console.log(err);
    });

function home () {
    fetch()
}
