const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true,
},
    function (request, accessToken, refreshToken, profile, done) {
        console.log("Profile:", profile);
        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);
        return done(null, profile);
    },
));