const Settings = require("../models/settings");


// To diaplay settings page
const settings = async (req, res) => {
    const settings = await getAllSettings();

    res.render("settings/settings", {
        title: "Settings",
        settings: settings,
    });
}



// To add settings
const addSettings = async (req, res) => {
    let { email, phone, facebook, twitter, linkedIn, instagram, app_store, play_store, logo, privacy_policy, decription } = req.body;

    const isSettingAdded = await Settings.create({
        email: email,
        phone: phone,
        facebook: facebook,
        twitter: twitter,
        linkedIn: linkedIn,
        instagram: instagram,
        app_store: app_store,
        play_store: play_store,
        logo: logo,
        privacy_policy: privacy_policy,
        decription: decription,
    });

    if (isSettingAdded) {
        res.redirect("/settings");
    }
}



// To get all settings data
const getAllSettings = async (req, res) => {
    return await Settings.findAll({});
}



module.exports = {
    settings,

    addSettings,
}