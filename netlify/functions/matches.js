const Match = require('./models/match'); // Adjust the path to your Match model

exports.handler = async (event, context) => {
  const { httpMethod, body } = event;

  if (httpMethod === 'GET') {
    try {
      const matches = await Match.find({});
      return {
        statusCode: 200,
        body: JSON.stringify(matches),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching match data', error: err.message }),
      };
    }
  } else if (httpMethod === 'POST') {
    try {
      const { index, selectedTeam, mom, result, momWinner } = JSON.parse(body);
      const match = await Match.findById(index);

      if (!match) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Match not found' }),
        };
      }

      match.selectedTeam = selectedTeam;
      match.mom = mom;
      match.result = result;
      match.momWinner = momWinner;
      await match.save();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Match updated successfully' }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error updating match', error: err.message }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method not allowed' }),
  };
};