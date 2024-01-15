
/**
 * Global response method
 * @param {*} status
 * @param {*} statusState
 * @param {*} responseMessage
 * @param {*} response
 */
exports.sendJson = function sendJson (status = 200, message = null, response = null, pages = null, total = null) {
  let res = {
    status: status,
    statusState: [200, 202].includes(status) ? "success" : "error",
    message: message,
    data: response instanceof Array ? response : response instanceof Object ? response : [],
    pages: pages,
    total: total
  }

  res = Object.entries(res).reduce((arr, [key, value]) => (value ? (arr[key] = value, arr) : arr), {});
  return this.status(200).send(res);
}
