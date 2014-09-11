var username = prompt('Username: ');

$(document).ready(function(){
  
  var $body = $('.twittler-stream');
    
  var lastUpdate='0';

  var tweetsOnDom = [];

  function getRelativeTweetTs(tweetTs){

    return moment(tweetTs).fromNow();

  }

  function updateTweetsTs(){

    var index = 0;

    while(index <= tweetsOnDom.length - 1){

      var tweet = tweetsOnDom[index];

      $('#' + tweet.guid).find('.tweet-ts').text('added: ' + getRelativeTweetTs(tweet.created_at));

      index++;

    }

  }

  function appendTweetsToDom(){
  
    var tweetsToAppend = _.filter(streams.home,function(tweet){

      return moment(tweet.created_at).isAfter(moment(lastUpdate));

    });
  
    lastUpdate = moment();
  
    var index = 0;
  
    while(index <= tweetsToAppend.length - 1){
  
      var tweet = tweetsToAppend[index];

      tweetsOnDom.push(tweet);

      tweet.guid = tweetsOnDom.length - 1;
  
      var $tweet = $('<div></div>').attr({

        'class':'tweet-wrapper',

        'id': tweet.guid

      });

      var $tweetBody = $('<h5></h5>').attr('class','tweet-body');

      var $tweetTs = $('<h6></h6>').attr('class','tweet-ts');

      $tweetBody.text('@' + tweet.user + ': ' + tweet.message);

      // $tweetTs.text('added: ' + getRelativeTweetTs(tweet.created_at));
  
      $tweetBody.appendTo($tweet);

      $tweetTs.appendTo($tweet);
  
      $tweet.prependTo($body);
  
      index++;
  
    }
  
  }

  function updateDom(){

    appendTweetsToDom();

    updateTweetsTs();

  }

  updateDom();

  setInterval(updateDom,60000);

});