require('dotenv').config()
const express = require('express');
const app = express()
const port = process.env.APP_PORT
const { findControllers } = require('./src/index')

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

function applyRoutes() {
    const controllers = findControllers(__dirname + '/src')
    controllers.forEach(controller => {
        const ctrl = require(controller)
        app.use(ctrl.basePath, ctrl.router);
    })
}
applyRoutes()

app.use('*', (req, res) => {
    res.status(404).json({
        success: 'false',
        message: 'Page not found',
        errors: [
            {
                statusCode: 404,
                message: 'Page not found'
            }
        ]
    });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})