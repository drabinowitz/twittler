$(document).ready(function(){
  
  var $body = $('body');
  
  $body.html('');
  
  var lastUpdate='0';

  function appendTweetsToDom(){
  
    var tweetsToAppend = _.filter(streams.home,function(tweet){

      return moment(tweet.created_at).isAfter(moment(lastUpdate));

    });
  
    lastUpdate = streams.home[0].created_at;
  
    var index = tweetsToAppend.length - 1;
  
    while(index >= 0){
  
      var tweet = tweetsToAppend[index];
  
      var $tweet = $('<div></div>');
  
      $tweet.text('@' + tweet.user + ': ' + tweet.message + '  added: ' + moment(tweet.created_at).fromNow());
  
      $tweet.appendTo($body);
  
      index -= 1;
  
    }
  
  }

  appendTweetsToDom();

  setInterval(appendTweetsToDom,5000);

});