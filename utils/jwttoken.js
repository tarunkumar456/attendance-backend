//creating token and saving in cookie;
const sendtoken = (user, statuscode, resp) => {
    const token = user.getJWTtoken();
    //cookies option
    const option = {
        expires: new Date(
            Date.now() + 2 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure:true,
        sameSite: 'None'
    };

    resp.status(statuscode).cookie('token',token,option).json({
        success:true,
        user,
        token
    })
}

module.exports = sendtoken;
