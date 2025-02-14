const renderRegister = (req,res)=> {
    res.render('./pages/register.ejs');
}

const postRegister = async (req,res) => {
    console.log(req.body);
}



module.exports = {renderRegister,postRegister};