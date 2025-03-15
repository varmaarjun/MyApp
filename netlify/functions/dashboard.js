const User = require('../../models/user'); // Adjust the path to your User model

exports.handler = async (event, context) => {
  const { httpMethod } = event;

  if (httpMethod === 'GET') {
    try {
      const users = await User.find({}, 'name balance matchesWins matchesLost momWins').sort({ balance: -1 });
      const currentUser = await User.findById(event.queryStringParameters.userId, 'name role');

      return {
        statusCode: 200,
        body: JSON.stringify({ users, currentUser }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching user data', error: err.message }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method not allowed' }),
  };
};