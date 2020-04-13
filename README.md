# [vgCal](https://vgcal.now.sh/)

[![vgCal home](https://github.com/bradbautista/vgcal-client/blob/master/images/logotype-stripe.png)](https://vgcal.now.sh/)

## Table of Contents
[About](#about)
<br>
[Features](#features)
<br>
[Tech](#tech)
<br>
[Why?](#why)
 

<a name="about"></a>
## About

### Finding release dates for games is harder than it needs to be.

The easiest thing to do is Google it, but that's a gamble: You might get a Featured Snippet with the release date, or you might get a half-dozen links to articles that may or may not have the information, and then you have to read.

You could go Steam, but that's only going to get you Steam releases, and if you just want to browse upcoming releases, there's so much "Steam junk" and so many ambiguous dates that it winds up being impossible to sort through all the information — and the UX stinks on top of it.

You could go to gaming sites, but all of their missions are broader than release dates. Even if it's there, that information may be a half-dozen clicks deep, you may have to run a search, and then who knows how up-to-date their database is?

Why isn't there just a calendar, like my Google calendar, that just shows you what's coming out and what's recently come out?

### Now there is!

![vgCal desktop view](https://github.com/bradbautista/vgcal-client/blob/master/images/desktop-fullscreen.png)

Want to know what's coming out this month or the next? Have a Switch and an XBox and want to see what's coming out for both? Want to know what's coming out around a friend's birthday? vgCal makes it easy to see at a glance what's coming out in a given week or month, and quick to search for specific games — even those without a set release date.

<a name="features"></a>
## Features

vgCal is a full-stack app that leverages the Fullcalendar and React Windowed Select components, along with the Giant Bomb API, to represent video game release-date information in familiar visual language and minimize the amount of effort required to find that information. It's a tool designed to do one thing and do it well.

It also allows users to quickly and easily filter that information by release platform, so they can easily identify cross-platform releases or check out the release landscape for their platform of choice.

Additionally, users can add releases to a list of favorites and generate an iCal file to add them to their calendar of choice.

Favorites are stored in localstorage, so they'll persist across sessions without the need for account creation.

It utilizes the MediaQuery component of the react-responsive package to serve up different calendars to mobile and desktop users, allowing for a familiar and appropriate interface on any platform.

<a name="tech"></a>
## Tech

vgCal is a full-stack web application. The client is hosted on [Zeit](https://zeit.co/home) and the server and database are hosted on [Heroku](https://www.heroku.com). Here's the stack:

**Front end**
<br>
HTML5/CSS3/JS
<br>
[React](https://reactjs.org/)
<br>
[React Router](https://reacttraining.com/react-router/)
<br>
[Fullcalendar](https://fullcalendar.io/)
<br>
[react-windowed-select](https://www.npmjs.com/package/react-windowed-select)
<br>
[react-responsive](https://www.npmjs.com/package/react-responsive)
<br>
[react-loading-overlay](https://www.npmjs.com/package/react-loading-overlay)
<br>
[react-responsive-modal](https://www.npmjs.com/package/react-responsive-modal)
<br>
[react-collapsible](https://www.npmjs.com/package/react-collapsible)
<br>
[js-file-download](https://www.npmjs.com/package/js-file-download)
<br>
[Moment.js](https://momentjs.com/)


**Back end**
<br>
[Node.js](https://nodejs.org/en/)
<br>
[Express](https://expressjs.com/)
<br>
[PostgreSQL](https://www.postgresql.org/)
<br>
[node-cron](https://github.com/node-cron/node-cron)
<br>
[Knex](https://knexjs.org/)
<br>
[ical-generator](https://www.npmjs.com/package/ical-generator)
<br>
[nodemailer](https://nodemailer.com/about/)
<br>
[Moment.js](https://momentjs.com/)
<br>
[Mocha](https://mochajs.org/) / [Chai](https://www.chaijs.com/) / [Supertest](https://github.com/visionmedia/supertest)
<br>
[Morgan](https://github.com/expressjs/morgan) / [CORS](https://github.com/expressjs/cors) / [Helmet](https://github.com/helmetjs/helmet)

For details about how the vgCal API works, visit [its repo](https://github.com/bradbautista/vgcal-server).

**Misc.**
<br>
[Giant Bomb API](https://www.giantbomb.com/api/)


<a name="why"></a>
## Why?

Ninety-five percent to solve the problems above, and 5 percent to spite the guys at Giant Bomb. Since the 95 percent is covered above, here's the other 5 percent: Early in the year, in the Before Times, there was general grousing on the Giant Bombcast and Beastcast — two great podcasts — about how few games were coming out. But a lot of quality games were coming out; they just didn't pique the Giant Bomb crew's interests. Rather than send them an email they didn't want to read, I figured I could make the point using their own API.
