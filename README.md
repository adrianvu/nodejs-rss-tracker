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
It's easy to set up, just change the **feedURL** with the feed URL that you would like to track, and enter your SendGrid API details for email notification under the config area. Change the **tracking_keyphrases** to the keyphrase you would like to track in the title or description. Change the **minutes** variable to set the time between checking of the feed.
```javascript
// ============ Config ============
var feedURL = "<Feed URL>";
var tracking_keyphrases = ['key phrase 1', 'key phrase 2', 'key phrase 3'];
var minutes = 5;

// SendGrid Config
var api_user = '<SendGrid Username>';
var api_key = '<SendGrid Password>';
var sendToEmail = '<email to send to>';
var sendFromEmail = '<email from>'
var subject = '<email subject>';
// ============ End of Config ============
```
