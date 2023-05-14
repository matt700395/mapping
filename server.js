const express = require('express');
const morgan = require('morgan');
const path = require('path');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();

const userRouter = require('./routes/user');
const { sequelize } = require('./models');

const server = express();
server.set('port', process.env.PORT || 8888);

server.set('view engine', 'html');
nunjucks.configure('views', {
    express: server,
    watch: true,
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.log(err);
    });

server.use(morgan('dev'));
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/user', userRouter);

server.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url}  라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

server.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    console.trace(err);
});

server.listen(server.get('port'), () => {
    console.log('8888 서버 실행');
});