# Astro js : state management with cookie(*)

(*) may be a kind of pleonasm :)

## The goal

Having some PHP experience, I wanted something like **session_start()** in Astro. I made a proof of concept [here](https://github.com/simedia/astro-session-at-start).

In this present version we step ahead and include a Redis DB (thanks to upstash.com) to store data.

## How to use

Beside the basic,

`npm install`

fill your upstash.com credentials in ./env . Then

`npm run dev`

You can open a browser on http://localhost:4321
