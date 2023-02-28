# MyReads Project

## Table of Contents
* [Table-of-contents](#table-of-contents)
* [Technologies-in-use](#Technologies-in-use)
* [Documentation](#Documentation)
* [Description](#Description)
* [Run-locally-in-your-device](#Run-locally-in-your-device)
* [How-to-use-the-project](#How-to-use-the-project)
* [Contacts](#Contacts)

## Description
*Communicate* is an free application where users can:
1. Chat with individual users
   * Send real-time messages
   * Make audio/video calls
   * Share audio messages
   * Shut messages temporarily
   * Transcript audio to text
2. Chat in group (includes all features above and more)
   * Have a calender to plan events
   * Receive reminders of events

## Technologies in use
To make this idea happen, I made use of the MERN stack (**MongoDB**, **Express.js**, **React.js**, **Node.js**), additionally I also utilized:
   * Client side: **SASS** and **ChakraUI** from styling, **Agora.io** SDK for audio/video calls and **Redux** for state management
   * Server side: **socket.io** to handle open server communication

## Documentation
In case of you have interest, you can check the some of these documentations:
* Agora.io rtc combined with React:
```
   https://agoraio-community.github.io/Agora-RTC-React/
```
* Styled components with ChakraUI:
```
   https://chakra-ui.com/docs/components
```

* WebSocket handshakes
```
   https://socket.io/docs/v4/
```

## Run locally in your device
First you will need to clone the project:
```
git clone https://github.com/ZASFM/communicate.git
```

Then go to the project directory:
```
cd chat-app
```

Before anything you have to install the required dependencies:
```
npm install
```

You are also required to have an environment file, inside the backend folder:
```
cd backend
create your .env
```
Run the server: 
```
npm start
```

Inside a separate terminal, change directory to frontend, and install the dependencies:
```
cd frontend
npm install
```

Finally, run the client:
```
npm start
```

## How to use the project
Here you can have a real look of the project, if anything goes wrong, just reload the page.
   * Authentication and Authorization:
   ![Alt text](/screenshots/signup.png?raw=true)
   ![Alt text](/screenshots/login.png?raw=true)

   * Dashboard 
   ![Alt text](/screenshots/dashboard.png?raw=true)

   * Searching for users to chat
   ![Alt text](/screenshots/search.png?raw=true)

   * Two people chat
   ![Alt text](/screenshots/single%20chat.png?raw=true)

   * Create group chat:
   ![Alt text](/screenshots/createGroup.png?raw=true) 

   * Add members to the group, or change group name after creation
   ![Alt text](/screenshots/addMembers.png?raw=true)

   * Update group
   ![Alt text](/screenshots/update%20group.png?raw=true)

   * Profiles
   ![Alt text](/screenshots/statuses.png?raw=true)

   * "Typing..." on typing
   ![Alt text](/screenshots/typing.png?raw=true)

   * Notifications
   ![Alt text](/screenshots/notification.png?raw=true)   

   * Audio messages:
   ![Alt text](/screenshots/audioMessage.png?raw=true)     
## Contacts
My email: shafi.bahrami.2015@gmail.com
