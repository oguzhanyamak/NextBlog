const renderHome = async (req, res) => {
  try {
    res.render("./pages/home",{sessionUser:req.session.user});
  } catch (error) {
    throw error;
  }
};

module.exports = renderHome;
