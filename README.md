# Express Outbound

1\. [Synopsis](#synopsis)  
2\. [Installation](#installation)  
3\. [How To Use](#usage)  
4\. [Testing](#testing)  
5\. [Change Notes](#change-notes)  
6\. [License](#license)  

<a name="synopsis"></a>

## 1\. Synopsis

An extension for [ExpressJS](http://expressjs.com/) that continues the middleware chain through the response proccess allowing you to process or manipulate responses on their way out.

<a name="installation"></a>

## 2\. Installation

Install with npm as a dependency to your project.

```bash
$ npm install --save express-outbound
```

<a name="usage"></a>

## 3\. How To Use

Passing a callback function to `next` will inject a middleware that runs after calling `response.send` or `response.json` before the response is sent. The callback takes the data being sent in the response. Within the callback, you **must** use `response.send` or `response.json` to continue processing the response.

### Basic Example

Here is a simple inbound/outbound logging middleware.

```js
const express = require('express');
const outbound = require('express-outbound');
// const app = express();
const app = outbound(express);

app.use((request, response, next) => {
  console.log('request received');
  next(data => {
    console.log('responding with:', data);
    if (iAm instanceof TeaPot) {
      response.status(418);
    }
    response.send(data);
  });
});

app.get('/', (request, response) => {
  console.log('handling request');
  response.send('Hello, world');
});

app.listen(8080);
```

### A Slightly More Involved Example.

Any racked middleware will run in the opposite order during the response process as it does when the request comes in as shown below.

```
--request-->  ******************  -->  ******************  -->  *************
              ** Middleware 1 **       ** Middleware 2 **       ** Handler **
<-response--  ******************  <--  ******************  <--  *************
```

```js
const express = require('express');
const outbound = require('express-outbound');
const app = outbound(express);
// const router = express.Router();
const router = outbound.Router(express);

router.use((request, response, next) => {
  next(data => {
    console.log('express-outbound works with routers, too');
    response.send(data);
  });
});

router.post('/', (request, response, next) => {
  response.send('you posted something');
});

app.use('/some-route', router);

app.use((request, response, next) => {
  request.loggedIn = isLoggedIn(request);
  next(data => {
    const enrichedData = enrichPayload(data);
    doSomethingAsynchronouslyWith(enrichedData).then(() => {
      response.send(enrichedData);
    });
  });
});

app.get('/', (request, response, next) => {
  const greeting = request.loggedIn ? 'familiar face' : 'stranger';
  next(data => {
    response.json({
      payload: `${data.payload}, ${greeting}`
    });
  });
});

app.get('/', (request, response) => {
  response.json({ payload: 'Hello' });
});

app.listen(8080);
```

<a name="testing"></a>

## 4\. Testing

Tests are written using [jasmine](https://jasmine.github.io/). All API tests currently run against [Express 4.15.2](https://github.com/expressjs/express/tree/d43b074f0b3b56a91f240e62798c932ba104b79a).

```bash
$ npm install
$ npm test
```

<a name="change-notes"></a>

### 5\. Change Notes

#### 1.0.0
  -- Change API to create express 'app' and 'router' instead of passing in or mutating existing ones
  -- Simplify callback passed to 'next' to remove redundant callback
  -- Improve documentation

#### 0.1.0
  -- Initial release

<a name="license"></a>

## 6\. License

ISC Lisense

Copyright (c)2017, Ben Allred <skuttleman@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
