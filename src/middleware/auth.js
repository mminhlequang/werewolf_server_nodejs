const User = require('../model/user');
const AppResult = require('../util/app_result');
const AppJwt = require('../util/app_jwt');

exports.verified = async (req, res, next) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.headers.x_authorization;
	if (!accessTokenFromHeader) {
		console.log("Header");
		return res.json(AppResult.reponseError('Xác thực không thành công!'));
	}

	const verified = await AppJwt.verifyToken(
		accessTokenFromHeader
	);
	if (!verified) {
		return res.json(AppResult.reponseError('Xác thực không thành công!'));
	}

	console.log("verified: ", verified);

	const user = await User.findOne({ email: verified.payload.email });
	req.user = user;

	return next();
};