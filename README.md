## YoutubeHero 
> Various utilities for working with the youtube api.

## Install
```
$ npm install --save youtube-hero 
```

## Usage
```javascript
var YoutubeHero = require("youtube-hero");

// Insert your youtube key here:
var key = "<TEST>"
var username = "BarackObamadotcom"
var youtubeHero = new YoutubeHero({key: key})

youtubeHero.fetchUploadsForUser(username, {
  onResult: function(err, videoId) {
    console.log(videoId);
  }
}).then(function(){
  // Executed after all videos are fetched.
}).catch(function(){
  // Executed if an error occurs.
})
```
