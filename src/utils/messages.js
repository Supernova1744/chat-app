const generateMessage = (username, text) => {
  return {
    text,
    username,
    createdAt: new Date().getTime()
  };
};
const generateLinkMessage = (username, url) => {
  console.log(username);
  return {
    url,
    username,
    createdAt: new Date().getTime()
  };
};
module.exports = {
  generateMessage,
  generateLinkMessage
};
