var controller = new require('controller')();
var helper = require('helper');

controller.server().listen(3000);

controller.get('/', (request, response) => {
    helper.loadFile('/main.html', function (err, data) {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.end(data);
    });
});