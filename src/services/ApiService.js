import axios from 'axios';

class ApiService {
  async sendMessages(messages) {
    await axios
      .get(
        // `http://localhost:4444/Extension`,
        `https://dog-api.kinduff.com/api/facts`,
        // {
        //   messages,
        // },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

export default new ApiService();
