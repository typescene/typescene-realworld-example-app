# ![Typescene RealWorld Example App](logo.png)

[![RealWorld Frontend](https://img.shields.io/badge/realworld-frontend-%23783578.svg)](http://realworld.io)

> ### [Typescene](https://typescene.dev) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) spec and API.

### Demo (TBD)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with [Typescene](https://typescene.dev) including CRUD operations, authentication, routing, pagination, and more. Please submit bug fixes via pull requests & feedback via issues.

**Note:** The Typescene framework was made for desktop and mobile-like apps, so this RealWorld implementation behaves strictly like a Single Page Application (SPA). There is no server-side rendering, and all code is bundled in a single JS file by design. While you _shouldn't_ implement a ‘Medium clone’ using Typescene, it's still an insteresting demo to show how Typescene works. 

## Getting started

To get the frontend running locally:

- Clone this repo
- `npm install` to install all required (dev) dependencies
- `npm start` to start the Webpack development server
- Open a browser to view the result on localhost port 8080
- Please star [`typescene/typescene`](https://github.com/typescene/typescene) and follow [@typescene](https://twitter.com/typescene) to show your support!

If you get stuck, Twitter is the right place to ask questions right now. Looking forward to your feedback.

## TODO

- Add unit tests — we'll likely be able to test the app (at least activities) in Node rather than the browser, by using a different entry point and special `Application` instance. Stay tuned.
- Fix some of the responsive elements, possibly using CSS.
- Improve performance of the main articles list.

> A note on SEO: Typescene does not support server-side rendering, which limits the theoretical SEO effectiveness of the resulting website. Typescene was purpose built for desktop/mobile-like interactive apps rather than blogs and websites so please don't expect this to work any time soon 😄

## License

This code is licensed under an MIT style license.
