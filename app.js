//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;
 
var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording
 
// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext; //new audio context to help us record
var audioPlayer = document.getElementById("audioPlayer");
var recordButton = document.getElementById("recordButton");
 
//add events to those 3 buttons
$("#recordButton").attr("onclick", "startRecording();");


function startRecording() {
    console.log("recordButton clicked");
 
    /*
    Simple constraints object, for more advanced audio features see
    <div class="video-container"><blockquote class="wp-embedded-content" data-secret="vNsz0nPBL4"><a href="https://addpipe.com/blog/audio-constraints-getusermedia/">Supported Audio Constraints in getUserMedia()</a></blockquote><iframe class="wp-embedded-content" sandbox="allow-scripts" security="restricted" style="position: absolute; clip: rect(1px, 1px, 1px, 1px);" src="https://addpipe.com/blog/audio-constraints-getusermedia/embed/#?secret=vNsz0nPBL4" data-secret="vNsz0nPBL4" width="600" height="338" title="“Supported Audio Constraints in getUserMedia()” — Pipe Blog" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe></div>
    */
 
    var constraints = { audio: true, video:false }
 
    /*
    Disable the record button until we get a success or fail from getUserMedia()
    */
 	$("#recordButton").html("Đánh giá phát âm <i class='fa fa-pen-fancy'></i>");
 
    /*
    We're using the standard promise based getUserMedia()
    https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    $("#recordButton").attr("onclick", "stopRecording();");
 
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
 
        /* assign to gumStream for later use */
        gumStream = stream;
 
        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);
 
        /* 
        Create the Recorder object and configure to record mono sound (1 channel)
        Recording 2 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})
 
        //start the recording process
        rec.record()
 
        console.log("Recording started");
 
    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        $("#recordButton").attr("onclick", "stopRecording();");
    });
}

function stopRecording() {
    console.log("stopButton clicked");
 
    //reset button just in case the recording is stopped while paused
    $("#recordButton").html("Bắt đầu nói <i class='fa fa-microphone'>");

 
    //tell the recorder to stop the recording
    rec.stop();
 
    //stop microphone access
    gumStream.getAudioTracks()[0].stop();
 
    //create the wav blob and pass it on to 
    rec.exportWAV(executeEvaluation);

    $("#recordButton").attr("onclick", "startRecording();");
}

function executeEvaluation(blob) {
    var url = URL.createObjectURL(blob);
    audioPlayer.src = url;
    callEvaluationRequest(blob);
}

function callEvaluationRequest(blob){
	var bodyFormData = new FormData();
    bodyFormData.set('text', $('#sentence').val());
    bodyFormData.append('user_audio_file', blob); 
    bodyFormData.append('tokenized', "0"); 

    // Call with axios
    console.log('Start call request');

    var data = new FormData();
	data.append("text", "today I so sad");
	data.append("user_audio_file", blob);
	data.append("tokenized", "0");

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === 4) {
	    console.log(this.responseText);
	  }
	});

	xhr.open("POST", "https://app.speechace.co/placement/api/scoring_text/");
	xhr.setRequestHeader("Token", "f55673aeee6ca20daf45ddb3b901ae9e0e73d148");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "2cd639cb-76eb-4f30-b592-4cd6ebedc307");

	xhr.send(data);

    // axios({
	   //  method: 'post',
	   //  url: 'https://app.speechace.co/placement/api/scoring_text/',
	   //  data: bodyFormData,
	   //  config: { headers: {'Content-Type': 'multipart/form-data' , 'Token' : 'f55673aeee6ca20daf45ddb3b901ae9e0e73d148'}}
    // })
    // .then(function (response) {
    //     //handle success
    //     console.log(response);
    // })
    // .catch(function (response) {
    //     //handle error
    //     console.log(response);
    // });

}



