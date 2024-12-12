# Summary extention

## Introduction

Creating a Chrome extension powered by AI technologies can greatly enhance user experience by integrating advanced features directly into the browser.

In this tutorial, we’ll walk you through the entire process of building a Chrome extension from scratch using an AI/ML API. Starting with setting up the development environment - including installing essential tools and configuring the project - we’ll guide you through each component of the extension. These components include:

-   **manifest.json**: Contains essential metadata about your extension.
-   **script.js**: Defines the extension's functionality and behavior.
-   **style.css**: Adds styling for a polished look.
-   **popup.html**: Provides the user interface for your extension.
-   **popup.js**: Handles interactions and functionality within the popup interface.

Throughout the tutorial, we’ll highlight best practices for building Chrome extensions and managing user interactions effectively. By the end, you’ll have a strong foundation for creating Chrome extensions and the skills to develop your own AI-powered solutions.

## Technologies Overview

Let’s take a brief look at the key technologies we’ll be using.

### AI/ML API

The [AI/ML API](https://aimlapi.com/) is a revolutionary platform for developers and SaaS entrepreneurs, enabling seamless integration of advanced AI capabilities into their products. It provides access to over 200 cutting-edge AI models, covering a wide range of applications, from natural language processing (NLP) to computer vision.

#### Key Features for Developers:

-   **Extensive Model Library**: Over 200 pre-trained models for rapid prototyping and deployment.
-   **Customization Options**: Fine-tune models for specific use cases.
-   **Developer-Friendly Integration**: RESTful APIs and SDKs for easy integration into any tech stack.
-   **Serverless Architecture**: Focus on coding while the platform manages infrastructure.

By the end of this tutorial, you’ll not only have built a fully functional AI-powered Chrome extension but also gained valuable insights into leveraging advanced AI/ML technologies in real-world applications.

### Chrome Extension

A Chrome extension is a lightweight software program designed to modify or enhance the functionality of the Google Chrome web browser. Built using familiar web technologies like HTML, CSS, and JavaScript, these extensions are purpose-driven, focusing on specific tasks or features. Their simplicity makes them easy to develop, understand, and use, providing users with tailored solutions to improve their browsing experience.

## Getting Started with Chrome Extensions

Building a Chrome extension requires understanding its structure, permissions, and interaction with web pages. In this section, we’ll set up our development environment and create the foundational files necessary to start building an extension.

### Setting Up Your Development Environment

Before diving into coding, ensure you have the following prerequisites:

-   **Chrome Browser**: This is where we’ll load, test, and debug our extension.
-   **Text Editor or IDE**: Tools like Visual Studio Code, Sublime Text, or Atom are excellent choices for editing code.
-   **Basic Knowledge of HTML, CSS, and JavaScript**: Familiarity with these core web technologies is essential for building Chrome extensions.

### Creating the Project Structure

A minimal Chrome extension requires at least three key files:

-   **manifest.json**: Contains metadata and configuration for the extension, such as its name, version, permissions, and the scripts it uses.
-   **script.js**: Includes the JavaScript code that defines the extension's functionality.
-   **style.css**: Provides styling for any user interface elements in the extension.

As we progress through this tutorial, we will also create:

-   **popup.html**: A file that defines the structure of the extension's popup interface.
-   **popup.js**: A script to manage the interactivity and logic of the popup.

### Setting Up the Project

1. Create a new directory for your extension project.
2. Inside this directory, create the following three files:
    - `manifest.json`
    - `script.js`
    - `style.css`

Once your project structure is in place, you’ll be ready to begin writing the code for your extension.

#### Understanding manifest.json

The `manifest.json` file is the core of your Chrome extension. It provides the browser with essential information about your extension, including its purpose, functionality, and the permissions it requires. Let’s explore how to configure this file effectively.

#### Key Elements in `manifest.json` for the "Summarize" Extension

The following configuration demonstrates the essential and additional fields in the `manifest.json` file for the "Summarize" Chrome extension.

##### Essential Fields

-   **manifest_version**: Specifies the version of the manifest file format. This extension uses version 3, the latest standard for Chrome extensions.
-   **name**: The name of the extension, "Summarize", indicates its purpose.
-   **version**: The initial release version is "1.0", following semantic versioning.

##### Additional Metadata and Permissions

-   **description**: A concise summary of the extension’s functionality: "Write a summary of a website or text".
-   **host_permissions**: The wildcard `*://*.aimlapi.com/*` grants access to all subdomains of aimlapi.com, enabling integration with the AI/ML API.
-   **permissions**: Includes "activeTab", allowing the extension to interact with the content of the current active browser tab.
-   **content_scripts**: Defines scripts and styles to be injected into web pages:
    -   **matches**: Targets all URLs with `<all_urls>`.
    -   **js**: Loads `scripts.js`, which defines the extension’s behavior on web pages.
    -   **css**: Loads `styles.css` for any necessary styling.
-   **icons**: Specifies paths to the extension’s icons in three sizes:
    -   16x16: Small icon for toolbars and buttons.
    -   48x48: Default-sized icon.
    -   128x128: Large icon for extension details in the Chrome Web Store.

### Generating an Icon

You can create an icon for your Chrome extension using tools like ChatGPT or AI/ML platforms. Here’s the prompt I used to generate an icon:

> "Generate a black-and-white icon for my 'Summarize' Chrome extension. This extension enables users to highlight specific text on a website or summarize the entire page. It’s an AI-powered tool. The icon should feature a solid white background."

Download the icon and rename it appropriately. You can use a single icon for different sizes.

### Developing scripts.js

The `scripts.js` file contains the logic that defines your extension's behavior. In this section, we’ll outline the key functionalities your script needs to implement.

#### Variables and Initialization

Start by setting up the essential variables:

-   **AIML_API_KEY**: Obtain an API key from the AI/ML API platform to authenticate your requests.
-   **MODEL**: Define which AI/ML model you want to use for processing the text.
-   **overlay**: A variable to manage the overlay that will display the summary or other relevant information on the page.

```javascript
const AIML_API_KEY = 'Your API KEY'; // Replace with your AIML_API_KEY
const MODEL = 'Your model';
let overlay = null;
```

You will also need to create a function for sending requests. This function will handle communication with the AI/ML API, ensuring that data is sent and received correctly.

```javascript
const getSummary = async text => {
    try {
        const headers = {
            Authorization: `Bearer ${AIML_API_KEY}`,
            'Content-Type': 'application/json',
        };
        const jsonData = {
            model: MODEL,
            messages: [
                {
                    role: 'assistant',
                    content:
                        'You are an AI assistant who provides summaries for long texts. You are using HTML tags to format your response.',
                },
                {
                    role: 'user',
                    content: `Please summarize the following text: ${text}`,
                },
            ],
        };
        const response = await fetch(
            'https://api.aimlapi.com/v1/chat/completions',
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(jsonData),
            }
        );
        if (!response.ok) {
            throw new Error('API request failed');
        }
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.log(`Error: ${error}`);
    }
};
```

In the message, we specified that the model should send HTML in the response. This is crucial for preserving the original markup and formatting, ensuring that the content is displayed correctly on the web page.

#### Creating the Summary Overlay

Let’s create a function to generate the overlay. This function will add the overlay and a button to the DOM. Additionally, we’ll attach a click event listener to the button, which will trigger the getSummary function and display the response to the user.

```javascript
const createSummaryOverlay = text => {
    overlay = document.createElement('div');
    overlay.id = 'summary-overlay';
    overlay.style.display = 'none';

    const summaryButton = document.createElement('button');
    summaryButton.id = 'summary-button';
    summaryButton.textContent = 'Summarize';

    overlay.appendChild(summaryButton);
    document.body.appendChild(overlay);

    summaryButton.addEventListener('click', async () => {
        summaryButton.textContent = 'Summarizing...';
        summaryButton.disabled = true;
        try {
            const summary = await getSummary(text);
            summaryButton.textContent = 'Summary';
            const summaryContainer = document.createElement('div');
            summaryContainer.innerHTML = summary;
            overlay.appendChild(summaryContainer);
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    });
};
```

#### The next function is showOverlay, which is responsible for displaying the overlay in the appropriate location on the page.

```javascript
const showOverlay = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    overlay.style.display = 'flex';
    overlay.style.top = `${window.scrollY + rect.top - 50}px`;
    overlay.style.left = `${rect.left}px`;
};

document.addEventListener('mouseup', event => {
    if (event.target.closest('#summary-overlay')) return;

    const selectedText = window.getSelection().toString().trim();

    if (selectedText.length > 200 && selectedText.length < 7000) {
        if (!overlay) createSummaryOverlay();

        showOverlay();
    } else if (overlay) {
        document.body.removeChild(overlay);
        overlay = null;
    }
});
```

#### Full code:

```javascript
const AIML_API_KEY = 'Your API KEY'; // Replace with your AIML_API_KEY
const MODEL = 'Your model;

let overlay = null;

const getSummary = async text => {
    try {
        const headers = {
            Authorization: `Bearer ${AIML_API_KEY}`,
            'Content-Type': 'application/json',
        };

        const jsonData = {
            model: MODEL,
            messages: [
                {
                    role: 'assistant',
                    content:
                        'You are an AI assistant who provides summaries for long texts. You are using HTML tags to format your response.',
                },
                {
                    role: 'user',
                    content: `Please summarize the following text: ${text}`,
                },
            ],
        };
        const response = await fetch(
            'https://api.aimlapi.com/v1/chat/completions',
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(jsonData),
            }
        );

        if (!response.ok) {
            throw new Error('API request failed');
        }
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.log(`Error: ${error}`);
    }
};

const createSummaryOverlay = text => {
    overlay = document.createElement('div');
    overlay.id = 'summary-overlay';
    overlay.style.display = 'none';

    const summaryButton = document.createElement('button');
    summaryButton.id = 'summary-button';
    summaryButton.textContent = 'Summarize';

    overlay.appendChild(summaryButton);
    document.body.appendChild(overlay);

    summaryButton.addEventListener('click', async () => {
        summaryButton.textContent = 'Summarizing...';
        summaryButton.disabled = true;
        try {
            const summary = await getSummary(text);
            summaryButton.textContent = 'Summary';
            const summaryContainer = document.createElement('div');
            summaryContainer.innerHTML = summary;
            overlay.appendChild(summaryContainer);
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    });
};

const showOverlay = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    overlay.style.display = 'flex';
    overlay.style.top = `${window.scrollY + rect.top - 50}px`;
    overlay.style.left = `${rect.left}px`;
};

document.addEventListener('mouseup', event => {
    if (event.target.closest('#summary-overlay')) return;

    const selectedText = window.getSelection().toString().trim();

    if (selectedText.length > 200 && selectedText.length < 7000) {
        if (!overlay) createSummaryOverlay();

        showOverlay();
    } else if (overlay) {
        document.body.removeChild(overlay);
        overlay = null;
    }
});
```

### Styling with styles.css

To ensure a smooth and intuitive user experience, your extension should feature a clean and user-friendly interface.

#### Styling the Overlay and Button

Define styles for the following elements:

-   Overlay Positioning: use absolute positioning to place the overlay near the selected text.

```css
#summary-overlay {
    max-width: 500px;
    max-height: 500px;
    overflow-y: scroll;
    cursor: pointer;
    position: absolute;
    border-radius: 4px;
    background-color: #333;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    z-index: 10000;
    color: #fff;
}
```

-   Button Appearance: style the “Summarize” button to match the overlay design and ensure it is easily clickable.

```css
#summary-button {
    background: transparent;
    border: none;
    font-size: 14px;
    cursor: pointer;
    z-index: 10001;
}
```

-   Hover Effects: add hover effects to the button to improve user interaction and provide visual feedback.

```css
#summary-button:hover {
    color: #000;
    padding: 2px;
    border-radius: 4px;
}
```

-   Disabled State: clearly indicate when the button is disabled, helping users understand its functionality.

```css
#summary-button:disabled {
    color: #aaa;
    cursor: default;
}
```

We’ve completed the first part - now you can select text and receive a summary of it. The next step is to configure the interface to summarize the entire website.
To enable summarization of the entire website, we need to make the following additions:

### Add New Files

-   `popup.html`:
    This file will define the user interface for the popup, allowing users to initiate a site-wide summary.
-   `popup.js`:
    This script will handle the logic for the popup, including interacting with the main script and triggering the summarization process.

#### Update `manifest.json`

Add the following lines to configure the extension’s popup:

```json
"action": {
    "default_title": "Summarize site",
    "default_popup": "popup.html"
}
```

-   `default_title`: Specifies the title displayed when users hover over the extension icon in the browser toolbar.
-   `default_popup`: Points to the popup.html file, which defines the popup’s user interface.

With these updates, users will be able to interact with the extension via a popup to generate a summary for the entire website.

#### Full `manifest.json` code:

```json
{
    "manifest_version": 3,
    "name": "Summarize",
    "version": "1.0",
    "description": "Write a summary of a website or text",
    "host_permissions": ["*://*.aimlapi.com/*"],
    "permissions": ["activeTab", "scripting"],

    "action": {
        "default_title": "Summarize site",
        "default_popup": "popup.html"
    },
    "content_scripts": [
        {
            "matches": ["<all_urls>"],
            "js": ["scripts.js"],
            "css": ["styles.css"]
        }
    ],
    "icons": {
        "16": "icons/icon.png",
        "48": "icons/icon.png",
        "128": "icons/icon.png"
    }
}
```

### Adding Code to `popup.html`

Open the `popup.html` file and insert the following code. This code defines the structure of the popup window, includes inline styles for simplicity, and connects the `popup.js` script.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Summarizer</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                padding: 10px;
                width: 400px;
                background-color: #333;
                color: white;
            }
            button {
                padding: 8px 12px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <h3>Summarize site</h3>
        <button id="summarize-btn">Summarize site</button>
    </body>
    <script src="popup.js"></script>
</html>
```

### Adding Code to `popup.js`

The final step is to implement the functionality for the `popup.js` file. The following code adds an event listener to a button in the popup, enabling it to trigger the summarization process on the active browser tab:

```javascript
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
```

#### Explanation of the Code

1. Event Listener Setup:

    - the code adds a click event listener to a button with the ID `summarize-btn`. When clicked, the `clickSummary` function is executed.

2. Button Feedback:

    - The button’s text is changed to 'Summarizing...' to provide feedback that the summarization process has started.
    - The event listener is removed immediately after the first click to prevent multiple triggers while the function executes.
    - The button’s background color is updated to indicate a change in state visually.

3. Tab Query:

    - `chrome.tabs.query` is used to find the currently active tab in the browser window. This ensures that the summarization script runs only on the visible tab.

4. Executing the Summarization Script:
    - `chrome.scripting.executeScript` injects and runs the `summarizeText` function (we will add it later) in the context of the active tab.

### Adding Communication Between Content Scripts and the Popup

The next step is to handle communication between the `content_script` (executing in the context of the webpage) and the `popup.js` script. This ensures that the summarization results are displayed in the popup after being processed.

The following code snippet demonstrates how to listen for messages from the `content_script` and dynamically update the popup UI to show the summarization result:

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Remove the summarize button once the summary is available
    document.getElementById('summarize-btn').remove();

    // Create a new container to display the summary
    const summaryContainer = document.createElement('div');
    summaryContainer.innerHTML = request.text; // Set the received summary as the container's content

    // Add the container to the popup's body
    document.body.appendChild(summaryContainer);
});
```

#### Explanation of the Code

1. Listening for Messages:

    - The `chrome.runtime.onMessage.addListener` method listens for messages sent by other parts of the extension, such as the `content_script`.
    - The `request` parameter contains the data sent by the sender. In this case, it’s expected to have a `text` property with the summarization result.

2. Removing the Button:

    - Once the summarization result is received, the `summarize-btn` button is removed from the popup to avoid redundant actions.

3. Displaying the Summary:

    - A new `<div>` element is created to display the summarization result dynamically.
    - The `innerHTML` property of the container is set to the text from the `request`, ensuring the summary is shown in the popup.
    - Finally, the new container is appended to the popup's `<body>`.

### Adding the Summarize Functionality

To complete the summarization process, the `summarizeText` function needs to be added. This function extracts the text content of the webpage and communicates with other parts of the extension to send the summarized result. Here’s the code for the function:

```javascript
const summarizeText = async () => {
    const bodyText = document.body.innerText; // Extracts all visible text from the webpage
    const summary = await getSummary(bodyText); // Calls an external or predefined function to generate a summary
    chrome.runtime.sendMessage({ text: summary }); // Sends the summary to other parts of the extension
};
```

#### What This Code Does

1. Extracting Text Content:

    - The function uses `document.body.innerText` to retrieve all visible text content on the webpage. This includes text from elements like paragraphs, headings, and lists but excludes hidden or non-text elements.

2. Generating a Summary:

    - The `getSummary` function (written in `script.js`) is called with the extracted text (`bodyText`) as an argument.

3. Sending the Summary:
    - Once the summary is generated, it is sent to other parts of the extension using `chrome.runtime.sendMessage`. This allows the extension’s popup or background script to receive the summary and display it to the user.

### The extension is complete! The final steps are to integrate the API key, choose the desired model, and add the extension to Chrome for use.

## Steps to Obtain Your API Key

### 1. Visit the AI/ML API Platform

-   Navigate to the official website: [aimlapi.com](https://aimlapi.com).

### 2. Sign In

-   Click on "Get API Key" and log in using your Google account credentials.

### 3. Access the Dashboard

-   After signing in, you'll be redirected to your dashboard, where you can manage your account and API usage.

### 4. Create an API Key

-   Open the "Key Management" tab in the dashboard.
-   Click "Create API Key" to generate a new key.

### 5. Copy Your API Key

-   Once the key is generated, copy it for use in your extension or application.

## Setting the API Key in Your Extension

### Security Note

Never hardcode your API key directly into your scripts, especially if you plan to distribute your extension. This practice exposes your key to potential misuse. Instead, consider using environment variables or prompting users to input their API key securely.

### Step 1: Create a .env File

-   Add a `.env` file to your project and store your API key securely:

```javascript
AIML_API_KEY = your_api_key;
```

#### Important Note

Chrome extensions do not natively support `.env` files. Additional configurations are required to use environment variables within an extension. These details will be covered in an upcoming tutorial.

### Step 2: Temporary Testing in Scripts

-   For testing purposes, you can assign your API key directly in your `scripts.js` file. However, remember to replace this approach with a more secure implementation before distribution:

```javascript
// Set your AIML_API_KEY
const AIML_API_KEY = ''; // Replace with your actual AIML_API_KEY for testing purposes
```

## Running and Testing the Extension

With all components in place, it's time to load your extension into Chrome and see it in action.

### Loading the Extension

1. Open the Extensions Page

    - In Chrome, go to `chrome://extensions/` to access the extensions management page.

2. Enable Developer Mode

    - Toggle the "Developer mode" switch in the top-right corner of the page to enable development features.

3. Select the Extension Folder

    - Click the "Load unpacked" button and choose the folder containing your extension (e.g., `summary-extension` or your project's specific folder).

4. Verify Installation
    - After loading, the extension should appear in the list with its name and icon. You can now test its functionality directly in the browser.

### Testing Functionality

1. Navigate to a Webpage
   Open a webpage with textual content, such as an article or blog post.

2. Select Text

    - Highlight a paragraph or sentence that you want to summarize.

3. Interact with the Overlay

    - The “Summarize” overlay should appear above the selected text. Click the button and wait a moment for the summary to generate.

4. Summarize the Entire Site
    - In the top-right corner of Chrome, select your extension and click "Summarize Site". Wait for the summary of the entire webpage to appear.

### Troubleshooting Tips

#### Overlay Doesn’t Appear

-   Ensure that the `content_scripts` are properly configured in the `manifest.json` file.

#### No Summary Generated

-   Double-check that your API key is correctly set and that API requests are functioning as expected.

#### Console Errors

-   Open the browser’s developer tools to check for any JavaScript errors or network issues that may be preventing functionality.

## Next Steps

With a solid foundation in place, you can enhance your extension further:

-   Improve Error Handling

    -   Implement user-friendly error messages and fallback options in case the API is unavailable, ensuring a smoother user experience.

-   Enable Site-Specific Questions

    -   Add the ability for users to ask questions directly about the site within the extension, making it more interactive and informative.

-   Optimize Performance

    -   Improve performance by implementing caching strategies or optimizing API requests to reduce latency, enhancing the responsiveness of your extension.

-   Publish Your Extension
    -   Share your creation with a wider audience by publishing it on the Chrome Web Store, making it accessible to users around the world.

These enhancements will help make your extension more feature-rich, efficient, and user-friendly, providing greater value to your users.

## Conclusion

Congratulations on building a Chrome extension that integrates advanced AI capabilities! This project demonstrates how combining web technologies with powerful APIs can create engaging and accessible user experiences. You now have the skills and knowledge to enhance this extension further or create entirely new ones that leverage AI/ML APIs.

You can explore the full implementation on GitHub: **[Summary-extention](https://github.com/TAnd-dev/summary-extention)**

Happy coding and good luck with your future projects!
