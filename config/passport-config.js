const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); 

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL ,
}, async (token, tokenSecret, profile, done) => {
    console.log("Google Profile:", profile);
    // Check if user exists, if not create a new user
    const user = await User.findOne({ email: profile.emails[0].value });
    if (user) {
        return done(null, user);
    } else {
        const newUser = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos[0].value,
            phone: "N/A", 
            password: "google-oauth",
        });
        await newUser.save();
        return done(null, newUser);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
