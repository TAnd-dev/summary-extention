document
    .getElementById('summarize-btn')
    .addEventListener('click', async function clickSummary() {
        const bntSummary = document.getElementById('summarize-btn');
        bntSummary.innerText = 'Summarizing...'; // Update button text to indicate the process has started
        bntSummary.removeEventListener('click', clickSummary); // Prevent multiple clicks during execution
        bntSummary.style.backgroundColor = '#0053ac'; // Change button style for feedback

        // Identify the active tab in the current browser window
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });

        // Execute the summarizeText function in the context of the active tab
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: summarizeText, // Function to run in the tab's environment
        });
    });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Remove the summarize button once the summary is available
    document.getElementById('summarize-btn').remove();

    // Create a new container to display the summary
    const summaryContainer = document.createElement('div');
    summaryContainer.innerHTML = request.text; // Set the received summary as the container's content

    // Add the container to the popup's body
    document.body.appendChild(summaryContainer);
});

// This function runs in the context of the active tab
const summarizeText = async () => {
    const bodyText = document.body.innerText; // Extracts all visible text from the webpage
    const summary = await getSummary(bodyText); // Calls an external or predefined function to generate a summary
    chrome.runtime.sendMessage({ text: summary }); // Sends the summary to other parts of the extension
};
