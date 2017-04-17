# Express Outbound

1\. [Synopsis](#synopsis)  
2\. [Installation](#installation)  
3\. [How To Use](#usage)  
4\. [Testing](#testing)  
5\. [Change Notes](#change-notes)  
6\. [License](#license)  

<a name="synopsis"></a>

## 1\. Synopsis

An extension for [ExpressJS](http://expressjs.com/) that continues the middleware chain through the response proccess allowing you to track or manipulate data on its way out. Do this by passing a function to `next`.

<a name="installation"></a>

## 2\. Installation

Install with npm as a dependency to your project.

```bash
$ npm i --save express-outbound
```

<a name="usage"></a>

## 3\. How To Use

Passing a function to next will inject a middleware that runs after calling `response.send` or `response.json`. The function takes two arguments: (1) The data being sent in the response, and (2) a callback to continue responding.

### Basic Example

Here is a simple inbound/outbound logging middleware.

```js
const app = require('express')();
const { use } = require('express-outbound');

use(app, (request, response, next) => {
  console.log('request received');
  next((data, send) => {
    console.log('responding with:', data);
    send(data);
  });
});

app.get('/', (request, response) => {
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
const app = require('express')();
const { use, get } = require('express-outbound');

use(app, (request, response, next) => {
  request.loggedIn = isLoggedIn(request);
  next((data, send) => {
    const enriched = enrichPayload(data);
    doSomethingAsynchronously(enriched).then(() => {
      send(enriched);
    });
  });
});

get(app, '/', (request, response, next) => {
  const greeting = request.loggedIn ? 'familiar face' : 'stranger';
  next((data, send) => {
    send({
      payload: `${data.payload}, ${greeting}`
    });
  });
});

app.get('/', (request, response) => {
  response.json({ payload: 'Hello' });
});

app.listen(8080);
```

### Enhancing Express

If you prefer, you can simplify your code by invoking the library withthe app or router.

```js
const app = require('express')();
require('express-outbound')(app);

app.use((request, response, next) => {
  console.log('inbound');
  next((data, send) => {
    console.log('outbound');
    send(data);
  });
});

app.listen(8080);
```

<a name="testing"></a>

## 4\. Testing

Tests are written using [jasmine](https://jasmine.github.io/).

```bash
$ npm i
$ npm test
```

<a name="change-notes"></a>

### 5\. Change Notes

#### 0.1.0
  -- Initial release

<a name="license"></a>

## 6\. License

ISC Lisense

Copyright (c)2017, Ben Allred <skuttleman@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
