const http = require('http');

const pug = require('pug');

const formPage = pug.compileFile('./views/form.pug');
const resultPage = pug.compileFile('./views/result.pug');

const server = http.createServer((req, res) => {
  console.log('request', req.url, req.method);

  // const urlParsed = url.parse(req.url, true);
  const urlParsed = new URL(req.url, 'http://localhost:5000/');

  if (urlParsed.pathname === '/' && req.method === 'GET') {
    res.setHeader('content-type', 'text/html');
    res.write(
        formPage({
          fieldName: urlParsed.searchParams.get('fieldName') || 'default'
        })
    );
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
        const dataArr = postData.split('=');

        res.setHeader('content-type', 'text/html');
        res.write(
            resultPage({
              fieldName: dataArr[0],
              value: dataArr[1]
            })
        );
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
