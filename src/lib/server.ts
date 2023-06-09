const API_BASE_URL = 'hidden_for_security_reasons';
const WEBSITE_URL = 'hidden_for_security_reasons';

// Function to load user information
async function loadUserInfo(userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    const data = await response.json();
    return data;
}

// Function to create a new play
async function createPlay(playData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/plays`, {
        method: 'POST',
        body: JSON.stringify(playData),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

// Function to retrieve formation information
async function getFormationInfo(formationId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/formations/${formationId}`);
    const data = await response.json();
    return data;
}

// Function getUserInfo() is called
async function getUserInfo(uuid: string): Promise<any> {
    const userInfo = await loadUserInfo(uuid);
    return userInfo;
}

// Function to load a user's formations
async function loadUserFormations(userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/formations`);
    const data = await response.json();
    return data;
}

// Function to load a user's plays
async function loadUserPlays(userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/plays`);
    const data = await response.json();
    return data;
}

// Function to load a user's playbooks
async function loadUserPlaybooks(userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/playbooks`);
    const data = await response.json();
    return data;
}


// Function to check if the website is up
async function isWebsiteUp(): Promise<boolean> {
    const response = await fetch(WEBSITE_URL);
    return response.ok;
}
