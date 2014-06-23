NodeJS RSS Feed Tracker
================

A simple Nodejs app that tracks RSS feeds for a set of keywords in the title and notify you by email using SendGrid. I created this so that I could use this to track the RSS feed of a forum's marketplace for posts that matched certain keywords. As soon as the feed is updated and matches the keywords that I've provided, I will receive an email notification on the post's title and link.

I've also implemented socket.io to track by using the browser. This is useful if you are deploying this to a remote server (eg. OpenShift) and monitor it over the web instead of SSH-ing in.

Demo: http://tracker-adrianvu.rhcloud.com/

Dependencies
--
* express
* parserss
* sendgrid
* socket.io
* request


Set Up
--
It's easy to set up, just change the feed URL that you would like to track, and enter your SendGrid API details for email notification under the config area. Change the **tracking_keyphrases** to the keyphrase you would like to track in the title or description.
```javascript
var feedURL = "< Your RSS Feed URL >";
var api_user = "< Your SendGrid Username >";
var api_key = "< Your SendGrid Password >";
var tracking_keyphrases = ['keyphrase_1', 'keyphrase_2', 'keyphrase_3'];
```
