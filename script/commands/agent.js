const axios = require('axios');

module.exports.config = {
  name: "agent",
  version: "1.0.0",
  permission: 0,
  credits: "Mot",
  description: "A chatbot using Sim & Teach API",
  prefix: false,
  premium: false,
  category: "Chatbot",
  usages: "/agent [query] or /agent teach [ask] | [answer]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  // Extract the first argument (mode)
  const mode = args[0]?.toLowerCase();

  if (mode === "teach") {
    // Teaching mode: Ensure correct format with "|"
    const input = args.slice(1).join(' '); // Combine the rest of the arguments
    if (!input.includes('|')) {
      return api.sendMessage(
        "Invalid format. Please use: /agent teach [ask] | [answer]",
        event.threadID,
        event.messageID
      );
    }

    const [ask, answer] = input.split('|').map((item) => item.trim()); // Split and trim
    if (!ask || !answer) {
      return api.sendMessage(
        "Invalid format. Please use: /agent teach [ask] | [answer]",
        event.threadID,
        event.messageID
      );
    }

    try {
      const response = await axios.get('https://simsimi.ooguy.com/teach', {
        params: { ask, ans: answer }
      });

      api.sendMessage(
        `𝘼𝙜𝙚𝙣𝙩 𝙈𝙞𝙨𝙨𝙞𝙤𝙣 𝘾𝙤𝙢𝙥𝙡𝙚𝙩𝙚!\nQuestion: ${ask}\nAnswer: ${answer}`,
        event.threadID,
        event.messageID
      );
    } catch (error) {
      api.sendMessage(
        "Failed to teach the agent. Please try again later.",
        event.threadID,
        event.messageID
      );
    }
  } else {
    // Query mode: Handle chatbot queries
    const query = args.join(' '); // Combine arguments into a query string
    if (!query) {
      return api.sendMessage(
        "Please provide a query for the agent. Usage: /agent [query]",
        event.threadID,
        event.messageID
      );
    }

    try {
      const response = await axios.get('https://simsimi.ooguy.com/sim', {
        params: { query }
      });

      api.sendMessage(`${response.data.respond}`, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(
        "Failed to get a response from the agent. lease try again later.",
        event.threadID,
        event.messageID
      );
    }
  }
};
