const path = require('path');
/* EXPRESS */

const express = require('express');
const app = express();

const session = require('express-session');
/* PASSPORT */

const passport = require('passport');
let userProfile;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res)=>{
    res.render('auth');
});

/* PASSPORT */
app.get('/success', (req, res)=>{ res.send(userProfile) });
app.get('/error', (req, res)=>{ res.send('Error login in.') });

passport.serializeUser((user, cb)=>{
    cb(null, user);
});

passport.deserializeUser((obj, cb)=>{
    cb(null, obj);
});


/* GOOGLE AUTH */
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '';
const GOOGLE_CLIENT_SECRET = '';

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) =>{
        userProfile = profile;
        return done(null, userProfile);
    }
));

app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/error'}), (req, res)=>{
    res.redirect('/success');
})
const port = process.env.PORT || 3000;

app.listen(port, ()=>{ console.log('App listening on port '+port); });
