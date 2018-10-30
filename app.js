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

    text = $('#sentence').val();

    if (text == "") {
		errorModal(error="error_no_text")
	} else {
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
	bodyFormData.set('text', text);
    bodyFormData.append('audio', blob, 'test.wav'); 

    // Call with axios
    console.log('Start call request');


    axios({
	    method: 'post',
	    url: 'http://192.168.6.61:8001/api/english_mp',
	    data: bodyFormData
    })
    .then(function (response) {
        //handle success
        console.log(response)

        drawResult(response)

    })
    .catch(function (response) {
        //handle error
        console.log(response);
    });
}

function errorModal(error){
	var map_error = {}
		map_error["error_no_speech"] = "Không nhận được âm thanh. Vui lòng thay đổi âm lượng hoặc kiểm tra lại micro"
		map_error["error_no_text"] = "Không nhận được câu mẫu. Vui lòng nhập câu mẫu"
	
	swal({
		type: 'error',
		title: 'Cảnh báo...',
		text: map_error[error],
	})
};


function drawResult(response){
	data = response['data']
	status = data['results']['status']
	if (status == "error") {
		errorModal(error=data['results']['short_message'])
	} else {
		drawGraph(data['results']['text_score'])
	}
}

function getScoreColor(score) {
	if (score < 25) {
		return '#FF3333'
	} else if (score < 60) {
		return '#FF8633'
	} else if (score < 80) {
		return '#FFD433'
	} else if (score <= 100) {
		return '#3DEA00'
	} 
}

function getMessageScore(score) {
	if (score < 25) {
		return  '<strong>Cần cố gắng rất nhiều!</strong> Phát âm tiếng anh của bạn còn quá nhiều thiếu sót. Hãy cố gắng luyện tập theo những chỉ dẫn trên biểu đồ để cải thiện hơn nhé.'
	} else if (score < 60) {
		return  '<strong>Cần cố gắng!</strong> Phát âm của bạn vẫn còn nhiều thiếu sót. Hãy tập sửa theo những chỉ dẫn trên biểu đồ nhé.'
	} else if (score < 80) {
		return  '<strong>Khá lắm!</strong> Bạn phát âm khá giống với người bản xứ rồi. Hãy cố gắng hơn nữa để đạt điểm cao hơn nhé.'
	} else if (score <= 100) {
		return  '<strong>Thật tuyệt!</strong> Bạn phát âm rất tốt. Hãy cố gắng phát huy nhé.'
	} 
}


function getMessageClass(score) {
	if (score < 25) {
		return 'alert alert-danger'
	} else if (score < 60) {
		return 'alert alert-warning'
	} else if (score < 80) {
		return 'alert alert-info'
	} else if (score <= 100) {
		return 'alert alert-success'
	} 
}

function drawPhonemeGraph(words, phonemes, phonemes_score, phonemes_most_like) {
	$('#resultPhonemeChart').empty();

	for (let [i, val] of words.entries()) {
		var phonemeCanvas = $('<canvas/>',{'id':'canvas_' + i}).width("100%", height="15");
		$('#resultPhonemeChart').append(phonemeCanvas);
        var ctx = document.getElementById("canvas_" + i).getContext('2d');
        var myChart = new Chart(ctx, {
		    type: 'line',
		    data: {
		        labels: phonemes[i],
		        datasets: [{
		            label: 'Phát âm chi tiết từ ' + val,
		            data: phonemes_score[i], 
		            backgroundColor: [
		                'rgba(255, 206, 86, 0.2)',
		            ],
		            borderColor: [
		                'rgba(255, 206, 86, 1)',
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true,
		                    suggestedMax : 100
		                }
		            }]
		        }
		    }
		});
		
	}
}

function drawGraph(data){
	var ctx = document.getElementById("resultChart").getContext('2d');
	scores = []
	words = []
	phonemes = []
	phonemes_score = []
	phonemes_most_like = []

	let score = data['quality_score']
	let colorCode = getScoreColor(score)
	let messageScore = getMessageScore(score)
	let messageClass = getMessageClass(score)

	$("#resultScore").html(`Điểm phát âm : <i style="color : ${colorCode}">${score}</i> / 100`)
	$('#messageScore').attr('class', messageClass).html(messageScore)

	data['word_score_list'].forEach(function(elm){
		scores.push(elm['quality_score'])
		words.push(elm['word'])
		phoneme = []
		phoneme_score = []
		phoneme_most_like = []
		elm['phone_score_list'].forEach(function(word) {
			phoneme.push(word['phone'])
			phoneme_score.push(word['quality_score'])
			phoneme_most_like.push(word['sound_most_like'])
		})
		phonemes_score.push(phoneme_score)
		phonemes.push(phoneme)
		phonemes_most_like.push(phoneme_most_like)
	})

	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: words,
	        datasets: [{
	            label: 'Điểm phát âm',
	            data: scores,
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                'rgba(255, 206, 86, 0.2)',
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	            ],
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true,
	                    suggestedMax : 100
	                }
	            }]
	        }
	    }
	});
	drawPhonemeGraph(words, phonemes, phonemes_score, phonemes_most_like)
}



