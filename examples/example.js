var YoutubeHero = require("../index.js");

// Insert your youtube key here:
var key = "<INSERT_KEY_HERE>"
var username = "TheYoungTurks"
youtubeHero = new YoutubeHero({key: key})

youtubeHero.fetchUploadsForUser(username, {
  onResult: function(err, videoId) {
    // console.log(videoId);
  },
  onDone: function(err) {
    console.log("woooo it's done");
  }
})
.then(() => {
  console.log("Complete")
})
.catch((error) => {
  console.log(error)
})
