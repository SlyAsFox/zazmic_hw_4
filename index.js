/**
 *
 * Не использовал PUG т.к не успел разобраться с синтаксисом
 * Постараюсь разобраться за выходные и добавить
 */

const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    console.log('request', req.url, req.method);

    let urlParsed = url.parse(req.url, true);

    let fieldName = 'default';
    if (urlParsed.query.fieldName){
        fieldName = urlParsed.query.fieldName
    }

    if(urlParsed.pathname === '/' && req.method === 'GET'){

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
    }else if(urlParsed.pathname === '/' && req.method === 'POST'){

        let postData = '';

        req.setEncoding('utf8');

        req.on('data', (postDataChunk) => {
            postData += postDataChunk;
            console.log(`Received POST data chunk + ${postDataChunk} .`);
        });

        req.on('end', () => {
            try {
                let DataArr = postData.split('=');

                //let data = JSON.parse(objData);
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
            } catch (er) {
                // bad json!
                res.statusCode = 400;
                return res.end(`error: ${er.message}`);
            }
        });
    }else {
        res.statusCode = 404;
        res.end('Page not found');
    }
}).listen(5000);
console.log('Server running at http://127.0.0.1:5000/');
/**
 * 3. Без использования фреймворков вам нужно написать приложение которое.
 При GET запросе на url /  будет возвращать форму.
 Форма будет состоять из одного инпут елемента.
 name для этого инпута должен передавать через query параметры.
 Пример:
 Запрос на GET /?fieldName=test должен вернуть форму в которой будет такое поле
 <input type="text" name="test">
 Эту форму мы потом можем отправить по url / с методом POST
 POST запрос должен вернуть html с результатами которые мы передали через форму.
 <h4>Result:</h4>
 <p><b>Field name:</b> ? <b>Value:</b> ?</p>
 Где вместе вопоросительных знаков будут имя поля и его значение

 Для генерации html вы должны использовать модуль pug.
 Нельзя использовать сторонние модули кроме pug.
 Можно использовать любые встроенные.
 4. Вылить все в репозиторий
 */