//To display dashboard
const dashboard = async (req, res) => {
    res.render("dashboard", { title: "Dashboard" });
}

const users = async (req, res) => {
    res.render("users", { title: "Users" });
}

module.exports = {
    dashboard,
    users,
}