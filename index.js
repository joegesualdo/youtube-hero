var request = require('request');
var Promise = require('bluebird');

function YoutubeHero(opts) {
  var opts = opts || {};
  this.key = opts.key
}

YoutubeHero.prototype.fetchUploadsForUser = function(username, opts) {
  if (!username) {
    throw new Error("Must pass username argument to .fetchUploadsForUser");
  }
  var that = this;
  var opts = opts || {};
  var onResult = opts.onResult || function(){};

  return new Promise(function(resolve, reject){
    that.fetchUploadsPlaylistId(username)
    .then(function(playlistId){
      that.fetchVideosForPlaylist({
        playlist: playlistId,
        onResult: onResult
      }).then(function(){
        resolve()
      }).catch(function(error){
        reject(error)
      })
    }).catch(function(error){
      reject(error)
    })
  })
}

YoutubeHero.prototype.getPlaylistUrl = function(playlistId, pageToken){
  if(pageToken == undefined || pageToken == null){
    pageToken = " "
  }
  return "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId="+playlistId+"&key="+this.key+"&maxResults=50&pageToken="+pageToken
}

YoutubeHero.prototype.fetchVideosForPlaylist = function(opts){
  var that = this;
  var playlistId = opts.playlist;
  var onResult = opts.onResult;
  var nextPageToken = opts.nextPageToken;

  return new Promise(function(resolve, reject){
    request(that.getPlaylistUrl(playlistId, nextPageToken), function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jsonResponse = JSON.parse(body)
        var nextPageToken = jsonResponse.nextPageToken;

        jsonResponse.items.forEach(function(playlistItem) {
          var videoId = playlistItem.contentDetails.videoId

          onResult(null, videoId)
        })

        // Recusivly call if there are more pages
        if(nextPageToken){
          that.fetchVideosForPlaylist({
            playlist: playlistId,
            onResult: function(err, videoId){
              onResult(null, videoId)
            },
            nextPageToken: nextPageToken
          })
        } else {
          resolve()
        }
      } else {
        reject()
      }
    })
  })
}

// If you want all the videos of a user, youtube actaully associates an 'uploads' 
//   playlist that is just all a users videos. Go to this url and get the uplads value:
//    https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=TheYoungTurks&key=<INSERT_KEY_HERE>
//
//    NOTE: replace "TheYoungTurks" with the name of the user
YoutubeHero.prototype.fetchUploadsPlaylistId = function(username) {
  var that = this;
  return new Promise(function(resolve, reject){
    var url = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername="+ username + "&key=" + that.key

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var playlistId = JSON.parse(body).items[0].contentDetails.relatedPlaylists.uploads;
        resolve(playlistId)
      } else {
        reject(error);
      }
    })
  })
}

module.exports = YoutubeHero;
