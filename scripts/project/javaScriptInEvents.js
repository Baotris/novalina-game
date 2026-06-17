import { OnBeforeProjectStart } from "./playfab.js";

runOnStartup(async runtime => {
    try {
        OnBeforeProjectStart(runtime); // Initialize PlayFab
    } catch (err) {
        console.error("Error initializing PlayFab:", err);
    }
});


const scriptsInEvents = {

	async Game_Event55_Act1(runtime, localVars)
	{
		const __email = (document.getElementById("email") || {}).value || "";
		const __name = (document.getElementById("name") || {}).value || "";
		if (!__name || !__email) {
			try { document.getElementById(!__email ? "email" : "name").reportValidity(); } catch (e) {}
			localVars.html_name = "";
			return;
		}
		localVars.html_name = __name;
		localVars.html_email = __email;
		localVars.playfab_id = localStorage.getItem("playfab_id");
		try { if (globalThis.PlayFab) globalThis.PlayFab.emailChange(__email); } catch (e) {}
		try { window.parent.postMessage({ event: "data_point", instanceId: runtime.globalVars.instanceId, data: { email: __email } }, "*"); } catch (e) {}
		try {
			const __fd = new URLSearchParams();
			__fd.append("entry.500777633", __name);
			__fd.append("entry.1698469088", __email);
			fetch("https://docs.google.com/forms/d/e/1FAIpQLSe6UInOS73W0RJUGE43nUzYHTrgcJDiLo9WrFpJQsJmh8hAjA/formResponse", { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: __fd.toString() });
		} catch (e) {}
	},

	async Backend_Event2_Act1(runtime, localVars)
	{
const searchParams = new URLSearchParams(window.location.search);
const instanceId = searchParams.get("instanceId") || "preview";
const env = searchParams.get("env") || "production";

const originalConsole = console;

function logToConsole(type, ...params) {
  if (env === "production") {
    return;
  }
  if (params.length === 0) {
    return;
  }

  switch (type) {
    case "log":
    case "warn":
    case "error":
      break;
    default:
      // if type is neither one of the values above, fallback to "log"
      type = "log";
  }

  const logFn = originalConsole[type];

  logFn(`[playably-game] `, ...params);
}

const proxyConsole = {
  log: (...params) => logToConsole("log", ...params),
  warn: (...params) => logToConsole("warn", ...params),
  error: (...params) => logToConsole("error", ...params),
};

window.console = proxyConsole;

runtime.globalVars.instanceId = instanceId;
runtime.globalVars.env = env;

console.log("Setup succeeded. instanceId: ", instanceId);
	},

	async Backend_Event3_Act1(runtime, localVars)
	{
		if (runtime.globalVars.instanceId == null) {
			throw new Error("instanceId is undefined");
		}
	},

	async Backend_Event4_Act2(runtime, localVars)
	{
		window.parent.postMessage({
		    event: "setup",
			instanceId: runtime.globalVars.instanceId,
		    data: {
		        name: runtime.projectName,
		        version: runtime.projectVersion,
		    },
		},
		    "*");
		
	},

	async Backend_Event5_Act2(runtime, localVars)
	{
		window.parent.postMessage({
		    event: "status_update",
			instanceId: runtime.globalVars.instanceId,
		    data: {
		        status: localVars.Status,
		    },
		},
		    "*");
		//console.log("status: " + localVars.Status)
	},

	async Backend_Event6_Act1(runtime, localVars)
	{
		console.log("Status: ", localVars.Status)
	},

	async Backend_Event7_Act1(runtime, localVars)
	{
const res = localVars.gameResult;
if (res !== "win" && res !== "lose") {
    throw new Error(`Invalid gameResult received: '${res}'`);
}

window.parent.postMessage({
    event: "result",
	instanceId: runtime.globalVars.instanceId,
    data: {
		result: {
			type: "win_lose",
        	value: res,
		}
    },
},
"*");
	},

	async Backend_Event8_Act1(runtime, localVars)
	{
		console.log("ResultWinOrLose: ", localVars.gameResult)
	},

	async Backend_Event9_Act1(runtime, localVars)
	{
const score = localVars.scoreToSend;
if (score == null) {
    throw new Error(`Invalid score received: '${score}'`);
}

window.parent.postMessage({
    event: "result",
	instanceId: runtime.globalVars.instanceId,
    data: {
		result: {
			type: "score",
        	value: score,
		}
    },
},
"*");
	},

	async Backend_Event10_Act1(runtime, localVars)
	{
		console.log("ResultScore: ", localVars.scoreToSend)
	},

	async Backend_Event11_Act1(runtime, localVars)
	{
const res = localVars.gameResult;
if (res == null || typeof res != "string") {
    throw new Error(`Invalid gameResult received: '${res}'`);
}

window.parent.postMessage({
    event: "result",
	instanceId: runtime.globalVars.instanceId,
    data: {
		result: {
			type: "custom",
        	value: res,
		}
    },
},
"*");
	},

	async Backend_Event12_Act1(runtime, localVars)
	{
		console.log("ResultCustom: ", localVars.gameResult)
	},

	async Backend_Event13_Act1(runtime, localVars)
	{
const dataPoint = { [localVars.dataName]: localVars.dataValue };
if (dataPoint == null) {
    throw new Error(`Invalid data point received: '${dataPoint}'`);
}
window.parent.postMessage({
    event: "data_point",
	instanceId: runtime.globalVars.instanceId,
    data: dataPoint
},
    "*");
console.log("dispatch Data: ", localVars.dataName, localVars.dataValue, dataPoint)
	},

	async Backend_Event14_Act1(runtime, localVars)
	{
		console.log("DataPoint:" + localVars.dataName + " : " + localVars.dataValue)
	},

	async Playfab_Event1_Act1(runtime, localVars)
	{
		globalThis.PlayFab.loginGuest()
	},

	async Playfab_Event3_Act1(runtime, localVars)
	{
		globalThis.PlayFab.nameChange(localVars.newName)
	},

	async Playfab_Event4_Act1(runtime, localVars)
	{
		globalThis.PlayFab.emailChange(localVars.newEmail)
	},

	async Playfab_Event5_Act1(runtime, localVars)
	{
		globalThis.PlayFab.submitScore(localVars.scoreToSend,localVars.statisticName)
	},

	async Playfab_Event6_Act1(runtime, localVars)
	{
		globalThis.PlayFab.getLeaderboard(localVars.leaderboardName, localVars.maxInList)
	},

	async Playfab_Event7_Act6(runtime, localVars)
	{

	},

	async Playfab_Event8_Act1(runtime, localVars)
	{
// Define font variable for easy customization
const leaderboardFont = "Meta_W07_Light";

// Get the leaderboard from globalThis (Construct 3 variable)
const leaderboard = globalThis.leaderboard || [];
const userId = localStorage.getItem("playfab_id"); // Get current user's PlayFabId


// Find player's position in leaderboard
const playerData = leaderboard.find(player => player.PlayFabId === userId);
const playerIndex = playerData ? playerData.Position : -1;


// Get the HTML Element instance for the leaderboard in Construct 3
const htmlElement = runtime.objects.html_leaderboard.getFirstInstance();

// Ensure htmlElement exists before setting content
if (!htmlElement) {
    console.error("Leaderboard HTML element not found in Construct 3.");
    return;
}

let leaderboardHTML = `
<style>
    :root {
        --leaderboard-font: ${leaderboardFont};
        --player-box-color: #1b1b1b;
        --default-box-color: #ffffff;
        --player-text-color: #ffffff; /* White text for highlighted player */
    }

    .leaderboard-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        font-family: var(--leaderboard-font);
        height: 100%;
        max-height: 500px;
        overflow-y: scroll;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        touch-action: auto;
    }

    .leaderboard-wrapper::-webkit-scrollbar {
        display: none;
    }

    .leaderboard-container {
        width: 100%;
    }

    .leaderboard-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--default-box-color);
        border-radius: 2px;
        margin: auto;
        margin-bottom: 8px;
        padding: 12px 15px;
        width: 90%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        color: black; /* Default text color */
    }

    .leaderboard-item.player-highlight {
        background-color: var(--player-box-color) !important;
        border: 2px solid var(--player-box-color) !important;
        color: var(--player-text-color) !important; /* White text */
    }

    .rank {
        font-weight: bold;
        font-size: 15px;
        margin-right: 12px;
    }

    .player-info {
        flex: 1;
        text-align: left;
        font-size: 15px;
        font-weight: bold;
    }

    .player-score {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
    }
</style>

<div class="leaderboard-wrapper">
    <div class="leaderboard-container">
`;

leaderboard.forEach((player, index) => {
    const isPlayer = player.PlayFabId === userId;
    const playerElementId = `player-${player.PlayFabId}`;

    leaderboardHTML += `
    <div class="leaderboard-item ${isPlayer ? 'player-highlight' : ''}" id="${playerElementId}">
        <div class="rank">${player.Position + 1}.</div>
        <div class="player-info">${player.DisplayName || "Guest"}</div>
        <div class="player-score">${runtime.globalVars.adjustedValue - player.StatValue + "s"}</div>
    </div>
    `;
});

leaderboardHTML += `</div></div>` + `<div class="follow-us" style="text-align:center;font-family:Meta_W07_Light,sans-serif;color:#000;margin:18px auto 8px;padding:0 12px;"><p style="font-size:15px;line-height:1.4;margin:0 0 10px;">Follow us for more updates and exciting announcements from Novalina.</p><a href="https://www.facebook.com/novalinakitchens/" target="_blank" rel="noopener" aria-label="Follow Novalina on Facebook" style="display:inline-block;line-height:0;"><svg width="32" height="32" viewBox="0 0 24 24" fill="#e10412" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg></a></div>`;

// Set the HTML content in the Construct 3 HTML element
await htmlElement.setContent(leaderboardHTML, "html");

//Scroll to player's position if found
if (playerIndex !== -1) {
    setTimeout(() => {
        const playerElementId = `player-${userId}`;
        const playerElement = document.getElementById(playerElementId);

        //console.log("Trying to scroll to:", playerElementId);
        //console.log("Element Found:", playerElement);

        if (playerElement) {
            //console.log("Scrolling to player:", playerElement);
            playerElement.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } else {
            console.error("Player element not found for scrolling. ID attempted: " + playerElementId);
        }
    }, 250);
}

	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
