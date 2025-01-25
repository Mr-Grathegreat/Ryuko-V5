module.exports.config = {
     name: "perd",
     version: "1.1.0",
     permission: 0,
     credits: "Mot",
     premium: false,
     description: "perd reply",
     prefix: false,
     category: "without prefix",
     cooldowns: 0
};


const axios = require('axios');

module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const log = require('../../main/utility/logs.js');
    const path = resolve(__dirname, 'system', 'system.json');
    if (!existsSync(path)) {
        const obj = {
            ryuko: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('ryuko')) data.ryuko = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
}

module.exports.handleEvent = async ({ api, event, args, Threads }) => {
    const { threadID, messageID } = event;
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, '../commands', 'system', 'system.json');
   
    const { ryuko } = require(path);

    if (ryuko.hasOwnProperty(threadID) && ryuko[threadID] == true) {
      if (event.senderID !== api.getCurrentUserID()) {
      axios.get(encodeURI(`https://joncll.serv00.net/sim/sim.php?query=${event.body}`)).then(res => {
            if (res.data.respond == "null" || res.data.respond == "perd didn't understand you, teach me.") {
                api.sendMessage("perd didn't understand you, teach me.",threadID,messageID)
            } else {
                return api.sendMessage(res.data.respond, threadID, messageID);
            }
    })
    }  
    }
}

module.exports.run = async ({ api, event, args, permssion }) => {
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, 'system', 'system.json');
    const { threadID, messageID } = event;
    const database = require(path);
    
    const { ryuko } = database;

    if (!args[0]) { api.sendMessage("Hello perd asarrr!", threadID, messageID) } else {
        switch(args[0]) {
            case "on": {
              if (permssion != 1) return api.sendMessage('only group admins can use this commands', threadID, messageID);
                ryuko[threadID] = true;
                api.sendMessage("successfully turned on perd", threadID);
                break;
            }
            case "off": {
              if (permssion != 1) return api.sendMessage('only group admins can use this commands', threadID, messageID);
                ryuko[threadID] = false;
                api.sendMessage("successfully turned off perd.", threadID);
                break;
            }
            default:
            axios.get(encodeURI(`https://joncll.serv00.net/sim/sim.php?query=${args.join(" ")}`)).then(res => {
            if (res.data.respond == "null" || res.data.respond == "i didn't understand you, teach me.") {
                api.sendMessage("i didn't understand you, teach me.",threadID,messageID)
            } else {
                return api.sendMessage(res.data.respond, threadID, messageID);
            }
            });
            break;
        }
        writeFileSync(path, JSON.stringify(database, null, 4));
    }
}
