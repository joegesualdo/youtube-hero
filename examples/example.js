var YoutubeHero = require("../index.js");

// Insert your youtube key here:
var key = "<INSERT_KEY_HERE>"
var username = "TheYoungTurks"
youtubeHero = new YoutubeHero({key: key})

youtubeHero.fetchUploadsForUser(username, {
  onResult: function(err, videoId) {
    console.log(videoId);
  }
}).then(function(){
  console.log("Complete")
}).catch(function(error){
  console.log(error)
})
