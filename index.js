import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

const app = express();
const port = 3000;

let users = [
    {
        username: "guvanch",
        password: "qwerty"
    }
];

let posts = [
    {
        author: 'guvanch',
        title: 'Welcome!',
        body: 'Welcome to my test blog.',
        id: 1
    }
];

let id = 1;

let isAuth = false;
let currentUser = {};

app.use(express.static('public'));
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended: true}));

function authenticate(req, res, next) {

    let username = req.body.username;
    let password = req.body.password;

    users.forEach(user => {
        if(user.username == username && user.password == password) {
            isAuth = true;
            currentUser.username = username;
        }
    });

    if(!isAuth && req.url != '/auth') {
        res.redirect('/auth');
    }

    next();
}

app.use(authenticate);

app.get('/', (req, res)=>{
    res.render('index.ejs', {posts: posts});
});

app.get('/auth', (req, res)=>{
    if(isAuth) {
        res.redirect('/');
    }
    res.render('auth.ejs');
});

app.post('/auth', (req, res)=>{
    if(isAuth) {
        res.redirect('/');
    }else {
        res.redirect('/auth');
    }
});

app.get('/createpost', (req, res)=>{
    res.render('post.ejs');
});

app.post('/createpost', (req, res)=>{
    let title = req.body.title;
    let body = req.body.body;
    posts.push({author: currentUser.username, title: title, body: body, id: ++id});
    res.redirect('/');
});

app.get('/editpost', (req, res)=>{
    let postId = req.query.id;
    let postData = {};
    posts.forEach(post => {
        if(post.id == postId) {
            postData = post;
            return;
        }
    });
    console.log(postData);
    res.render('post.ejs', {postData: postData});
});

app.post('/editpost', (req, res)=>{
    console.log(req.body);
    console.log(req.query);
    let postId = req.query.id;
    let postData = req.body;
    posts.forEach(post => {
        if(post.id == postId) {
            post.title = postData.title;
            post.body = postData.body;
            return;
        }
    });
    res.redirect('/');
});

app.get('/deletepost', (req, res)=>{
    let postId = req.query.id;
    posts = posts.filter(item => item.id != postId);
    console.log(posts);
    res.redirect('/');
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});