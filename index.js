/**
 *
 * Не использовал PUG т.к не успел разобраться с синтаксисом
 * Постараюсь разобраться за выходные и добавить
 */

const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  console.log('request', req.url, req.method);

  const urlParsed = url.parse(req.url, true);

  let fieldName = 'default';
  if (urlParsed.query.fieldName) {
    fieldName = urlParsed.query.fieldName;
  }

  if (urlParsed.pathname === '/' && req.method === 'GET') {
    res.setHeader('content-type', 'text/html');
    res.write(`
            <html>
                <head>
                    <meta charset="utf-8" />
                </head>
                <body>
                    <form action="/" method="post">
                        <label>${fieldName}</label><br>
                        <input type="text" name="${fieldName}" />
                        <input type="submit">
                    </form>
                </body>
            </html>
        `);
    res.end();
  } else if (urlParsed.pathname === '/' && req.method === 'POST') {
    let postData = '';

    req.setEncoding('utf8');

    req.on('data', (postDataChunk) => {
      postData += postDataChunk;
      console.log(`Received POST data chunk + ${postDataChunk} .`);
    });

    req.on('end', () => {
      try {
        const DataArr = postData.split('=');

        res.setHeader('content-type', 'text/html');
        res.write(`
                    <html>
                        <head>
                           <meta charset="utf-8" />
                        </head>
                        <body>
                            <h4>Result:</h4>
                            <p><b>Field name:</b> ${DataArr[0]} <b>Value:</b> ${DataArr[1]}</p>
                        </body>
                    </html>
                `);
        res.end();
      } catch (error) {
        res.statusCode = 400;
        return res.end(`error: ${error.message}`);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Page not found');
  }
});
server.listen(5000);
console.log('Server running at http://127.0.0.1:5000/');
