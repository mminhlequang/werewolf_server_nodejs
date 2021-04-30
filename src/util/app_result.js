
exports.reponseSuccess = function (data, msg) {
  if (!msg) msg = "Success!"
  return {
    status: true,
    data: data,
    msg: msg
  }
}

exports.reponseError = function (message) {
  return {
    status: false,
    msg: message
  }
}