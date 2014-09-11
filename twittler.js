var username = prompt('Username: ','defaultUser');

streams.users[username] = [];

$(document).ready(function(){
  
  var $body = $('.twittler-stream');
    
  var lastUpdate='0';

  var tweetsOnDom = [];

  function buildTweet(tweet){

    var $tweet = $('<div></div>').attr('class','tweet-wrapper');

    if (tweet.guid !== undefined){

      $tweet.attr('id',tweet.guid);

    }

    var $tweetBody = $('<h5></h5>').attr('class','tweet-body');

    var $tweetTs = $('<h6></h6>').attr('class','tweet-ts');

    var $tweetUser = $('<a></a>').attr({

      'class':'tweet-user',

      'href' : '#'

    }).append('@' + tweet.user);

    $tweetBody.append($tweetUser).append(': ' + tweet.message);

    $tweetTs.text('added: ' + tweet.created_at);

    $tweetBody.appendTo($tweet);

    $tweetTs.appendTo($tweet);

    return $tweet;

  }

  function getRelativeTweetTs(tweetTs){

    return moment(tweetTs).fromNow();

  }

  var updateUserTweets = (function(){

    var intervalId;

    var $body = $('.twittler-user-stream-tweets');
    
    var $twittlerUser = $('.twittler-user');

    var $twittlerButton = $('.hide-twittler-user-stream');

    return { 

      add : function(user){

        this.remove();

        $twittlerButton.show();

        $twittlerUser.text(user);

        function addUserStreamsToDom(){

          var index = 0;

          var userStream = streams.users[user];

          while(index <= userStream.length - 1){

            var tweet = userStream[index];

            var $tweet = buildTweet(tweet);

            $tweet.prependTo($body);

            index++;

          }

        }

        intervalId = setInterval(addUserStreamsToDom,60000);

        addUserStreamsToDom();      

      },

      remove : function(){

        window.clearInterval(intervalId);

        $body.empty();

        $twittlerUser.text('');

        $twittlerButton.hide();

      }

    };

  })();

  $('.twittler-content').on('click','.tweet-user',function(event){

    event.preventDefault();

    updateUserTweets.add( $(this).text().substring(1) );

  });

  $('.twittler-content').on('click','.hide-twittler-user-stream',function(event){

    event.preventDefault();

    updateUserTweets.remove();

  });

  $('.add-tweet-button').click(function(event){

    event.preventDefault();

    var tweetText = $(this).closest('.add-tweet').find('.add-tweet-text');

    if (username && tweetText.val() && tweetText.val() != ''){

      var tweet = {

        user : username,

        message : tweetText.val(),

        created_at : moment()._d

      };

      tweetText.val('');

      streams.home.push(tweet);

      streams.users[username].push(tweet);
      
    } else {

      $('.error-text').fadeIn('fast').delay(2000).fadeOut('fast');

    }

  });

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

      var $tweet = buildTweet(tweet);
  
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