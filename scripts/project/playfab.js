export class PlayFabManager {
    constructor(runtime) {
        this.runtime = runtime;
        this.titleId = runtime.globalVars.playfab_titleID || "YOUR_PLAYFAB_TITLE_ID"; // Default if not set
        this.isDebug = runtime.globalVars.playfab_isDebug || false;

        this.sessionToken = localStorage.getItem("playfab_token") || null;
        this.playFabId;
		this.customLoginId
    }

    logDebug(message, data = null) {
        if (this.isDebug) {
            if (data) {
                console.log(message, data);
            } else {
                console.log(message);
            }
        }
    }


//Account Management------------------------------------------------------------------------------------------//Account Management
    async loginGuest() {
        // Retrieve stored PlayFab ID (CustomId)
        this.customLoginId = localStorage.getItem("customLogin_id");
		
        // If no ID is found, create a new one
        if (!this.customLoginId) {
            this.customLoginId= "Guest_" + Math.floor(Math.random() * 1000000);
            localStorage.setItem("customLoginId", this.customLoginId);
            this.logDebug("New CustomId Generated:", this.customLoginId);
        } else {
			this.logDebug("Returning CustomId:", this.customLoginId);
		}

        // Send login request to PlayFab
        const requestBody = {
            "TitleId": this.titleId,
            "CustomId": this.customLoginId,
            "CreateAccount": true // Force match or create the account
        };

        try {
            const response = await fetch(`https://${this.titleId}.playfabapi.com/Client/LoginWithCustomID`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            
            // Debug: Log the entire response from PlayFab
            this.logDebug("PlayFab Login Response:", data);

            if (data.data) {
                this.sessionToken = data.data.SessionTicket;
                this.playFabId = data.data.PlayFabId; // PlayFab sometimes returns PlayFabId instead of CustomId
				
                // Always store the correct CustomId to prevent mismatches
                localStorage.setItem("playfab_token", this.sessionToken);
                localStorage.setItem("playfab_id", this.playFabId);
				localStorage.setItem("customLogin_id", requestBody.CustomId)
				this.runtime.callFunction("playfab_isLoggedIn")

                this.logDebug("PlayFab Login Successful! Stored ID:", requestBody.CustomId);
                return data.data;
            } else {
                console.error("PlayFab Login Failed:", data);
                return null;
            }
        } catch (error) {
            console.error("PlayFab Login Error:", error);
            return null;
        }
    }


    async nameChange(newName) {
        if (!this.sessionToken) {
            console.error("No session found. Please log in first.");
            return;
        }

        const requestBody = {
            "DisplayName": newName,
        };

        try {
            const response = await fetch(`https://${this.titleId}.playfabapi.com/Client/UpdateUserTitleDisplayName`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-Authorization": this.sessionToken
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            if (data.data) {
                this.logDebug("Name Changed Successfully!", data);
                return data.data;
            } else {
                console.error("Name Change Failed:", data);
                return null;
            }
        } catch (error) {
            console.error("Name Change:", error);
            return null;
        }
    }


    async emailChange(newEmail) {
        if (!this.sessionToken) {
            console.error("No session found. Please log in first.");
            return;
        }

        const requestBody = {
            "EmailAddress": newEmail,
        };

        try {
            const response = await fetch(`https://${this.titleId}.playfabapi.com/Client/AddOrUpdateContactEmail`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-Authorization": this.sessionToken
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            if (data.data) {
                this.logDebug("Email Change Successfully!", data);
                return data.data;
            } else {
                console.error("Email Change Failed:", data);
                return null;
            }
        } catch (error) {
            console.error("Email Change:", error);
            return null;
        }
    }



//Leaderboard -----------------------------------------------------------------------------------------------//Leaderboard


    async submitScore(score, statistic = "Highscore") {
        if (!this.sessionToken) {
            console.error("No session found. Please log in first.");
            return;
        }

        const requestBody = {
            "Statistics": [{ "StatisticName": statistic, "Value": score }]
        };

        try {
            const response = await fetch(`https://${this.titleId}.playfabapi.com/Client/UpdatePlayerStatistics`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-Authorization": this.sessionToken
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            if (data.data) {
                this.logDebug("PlayFab Score Submitted Successfully!", data);
                return data.data;
            } else {
                console.error("PlayFab Score Submission Failed:", data);
                return null;
            }
        } catch (error) {
            console.error("PlayFab Score Submission Error:", error);
            return null;
        }
    }
	
	
    async getLeaderboard(leaderboardName = "Leaderboard", maxResults = 10) {
        if (!this.sessionToken) {
            console.error("No session found. Please log in first.");
            return;
        }

        const requestBody = {
            "StatisticName": leaderboardName,
            "StartPosition": 0,
            "MaxResultsCount": maxResults
        };

        try {
            const response = await fetch(`https://${this.titleId}.playfabapi.com/Client/GetLeaderboard`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-Authorization": this.sessionToken
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            if (data.data) {
                this.logDebug("PlayFab Leaderboard Data:", data.data.Leaderboard);
				globalThis.leaderboard = data.data.Leaderboard
				this.runtime.callFunction("playfab_onReceived_leaderboard")
                return data.data.Leaderboard;
            } else {
                console.error("PlayFab Leaderboard Fetch Failed:", data);
                return null;
            }
        } catch (error) {
            console.error("PlayFab Leaderboard Fetch Error:", error);
            return null;
        }
    }
	
	
}





/**
 * Construct 3: Run this BEFORE project starts to initialize PlayFab properly.
 */
async function OnBeforeProjectStart(runtime) {
    console.log("Initializing PlayFab... Runtime:");

    // Create an instance of PlayFabManager with the Construct 3 runtime
    globalThis.PlayFab = new PlayFabManager(runtime);
    
    console.log("PlayFab Initialized:", globalThis.PlayFab);
}

// Export for use in `main.js`
export { OnBeforeProjectStart };
