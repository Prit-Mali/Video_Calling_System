Skip to main content
incognito
Temporary chat
 Your conversation won’t be saved
27,716 tokens

Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
User
WhatsApp Image 2025-08-11 at 16.54.02_827b9a43.jpg
Screenshot 2025-08-19 150351.png
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Excellent. Yes, Visual Studio Code (VS Code) is the perfect tool for this project. It's a powerful, free code editor that is the industry standard for web development, especially with the technologies we've discussed (React and Node.js).
It has everything you need built-in, like a terminal, debugging tools, and amazing support for JavaScript.
Your First Steps: Setting Up the Project in VS Code
Let's get the basic folder structure and installations done.
1. Prerequisites (Install these on your computer if you don't have them):
Node.js: This will also install npm (Node Package Manager). You can download it from the official Node.js website.
2. Create Your Project Folder:
Create a main folder for your entire project. Let's call it deaf-intercom.
Open this deaf-intercom folder in VS Code. (File > Open Folder...).
3. Set Up the Backend (Server):
Open the integrated terminal in VS Code (View > Terminal or Ctrl+``).
Create a folder for your server code and move into it:
code
Bash
mkdir server
cd server
Initialize it as a Node.js project. This will create a package.json file:
code
Bash
npm init -y
Install the two key libraries you'll need for the backend: Express (for the web server) and Socket.IO (for real-time communication/signaling):
code
Bash
npm install express socket.io
4. Set Up the Frontend (Client):
Open a new terminal in VS Code (click the + icon in the terminal panel).
Make sure you are in the main deaf-intercom directory (you might need to type cd .. to go up one level).
Use the standard command to create a new React application:
code
Bash
npx create-react-app client
This will take a few minutes. It builds a complete, ready-to-run React project in a folder named client.
By the end of these steps, your folder structure in VS Code will look like this:
code
Code
deaf-intercom/
├── client/         <-- Your React frontend app
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   └── package.json
│
└── server/         <-- Your Node.js backend app
    ├── node_modules/
    └── package.json
Recommended VS Code Extensions
To make your life easier, I highly recommend installing these extensions from the Extensions Marketplace in VS Code:
Prettier - Code formatter: Automatically formats your code to keep it clean and consistent.
ESLint: Helps you find and fix problems in your JavaScript code.
Live Server: Useful for quickly launching simple HTML/CSS/JS pages (though create-react-app has its own live server).
You are now perfectly set up to start coding.
Your next task will be to create a basic Express server in the server folder that also runs Socket.IO. Ready for that step?
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Great! Let's get the heart of your application—the signaling server—up and running.
We will write the code for a basic server that listens for connections.
Step 1: Create Your Server File
In the VS Code file explorer on the left, navigate into your server folder.
Create a new file named server.js.
Your structure should now look like this:
code
Code
deaf-intercom/
└── server/
    ├── node_modules/
    ├── package.json
    └── server.js   <-- This is your new file
Step 2: Write the Server Code
Copy and paste the following code into your new server.js file. I've added comments to explain what each part does.
code
JavaScript
// server/server.js

// 1. Import necessary libraries
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// 2. Initialize the app and server
const app = express();
const server = http.createServer(app);

// 3. Configure Socket.IO
// We need to handle CORS (Cross-Origin Resource Sharing) because our
// React app (on localhost:3000) and our server (on localhost:8000)
// are on different "origins".
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow connections from our React app
    methods: ["GET", "POST"]
  }
});

// 4. Set the port for the server to listen on
const PORT = 8000;

// A simple route to test that our Express server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// 5. Set up the core Socket.IO logic
// This block of code will run every time a new user connects to the server
io.on('connection', (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);

  // This will run when a user disconnects
  socket.on('disconnect', () => {
    console.log(`User disconnected with socket ID: ${socket.id}`);
  });
});

// 6. Start the server
server.listen(PORT, () => {
  console.log(`✅ Server is running and listening on http://localhost:${PORT}`);
});
Step 3: Run Your Server
Now, let's start the server to see it in action.
Make sure your terminal in VS Code is in the server directory. If it's not, type:
code
Bash
cd server
Run the file using node:
code
Bash
node server.js
You should see the following output in your terminal, which means it's working!
code
Code
✅ Server is running and listening on http://localhost:8000
Your backend is now officially running and waiting for users to connect.
Pro Tip for Development: Use nodemon
Right now, if you change anything in server.js, you have to stop the server (Ctrl+C) and restart it. A tool called nodemon can do this automatically for you.
Stop your current server (Ctrl+C in the terminal).
Install nodemon as a development dependency for this project:
code
Bash
npm install nodemon --save-dev
Run your server with nodemon instead of node:
code
Bash
nodemon server.js
Now, whenever you save a change in server.js, nodemon will automatically restart the server for you. You'll see it happen in the terminal.
We are now ready for the next exciting step: making your React frontend connect to this server. Shall we proceed with that?
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Alright, let's bring the frontend to life and connect it to your new server. We'll modify the default React app to establish a WebSocket connection.
Step 1: Install the Socket.IO Client Library
Your React app needs a specific library to be able to talk to your Socket.IO server.
Open a new terminal in VS Code (or use the one you used for creating the React app).
Make sure you are in the client directory. If not, navigate to it:
code
Bash
cd client
```3.  Install the `socket.io-client` library:
```bash
npm install socket.io-client
Step 2: Modify the Main React Component
We'll edit the main App.js file to connect to our server as soon as the application loads.
In the VS Code explorer, navigate to client/src/App.js.
Replace the entire contents of App.js with the code below. This code does two things: it imports the necessary tools and it uses the useEffect hook to connect to the server when the component first renders.
code
JavaScript
// client/src/App.js

import React, { useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// 1. We define the server URL here
const SERVER_URL = "http://localhost:8000";

// 2. We initialize the socket connection outside of the component
// This prevents it from re-creating the connection on every re-render
const socket = io(SERVER_URL);

function App() {

  // 3. The useEffect hook runs once when the component is first mounted
  useEffect(() => {
    // We listen for the 'connect' event, which is automatically
    // emitted by the server when a new client connects.
    socket.on('connect', () => {
      console.log('Connected to server! My socket ID is:', socket.id);
    });

    // It's good practice to clean up the event listener when the
    // component unmounts to prevent memory leaks.
    return () => {
      socket.off('connect');
    };
  }, []); // The empty array [] means this effect runs only once.

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Call Intercom</h1>
        <p>Welcome! We are working on connecting you...</p>
      </header>
    </div>
  );
}

export default App;
Step 3: Run Everything and See the Magic Happen
Now we need to have both the backend server and the frontend client running at the same time.
Terminal 1 (Server): Make sure your server is running. If not, navigate to the server folder and run:
code
Bash
nodemon server.js
Terminal 2 (Client): Navigate to the client folder and run the standard command to start the React application:
code
Bash
npm start
This will automatically open a new tab in your browser at http://localhost:3000.
Step 4: Verify the Connection
To confirm that everything worked, check the following two places:
Your Server Terminal: You should see a new message confirming a connection:
code
Code
✅ Server is running and listening on http://localhost:8000
User connected with socket ID: aBcDeFgHiJkLmNoP  <-- (The ID will be random)
Your Browser's Developer Console:
In your browser (on the localhost:3000 page), open the Developer Tools (usually by pressing F12 or Ctrl+Shift+I).
Click on the "Console" tab.
You should see the message from our App.js file:
code
Code
Connected to server! My socket ID is: aBcDeFgHiJkLmNoP
If you see both of these messages, congratulations! You have successfully established a real-time, two-way communication channel between your frontend and backend. This is the fundamental building block for the entire application.
Ready to move on to getting the user's video on the screen?
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Ah, an excellent catch! That is a classic and very common error when setting up projects. Thank you for posting the full output.
Let's break it down and fix it.
The Problem
The key line is this one:
Module not found: Error: Can't resolve 'socket.io-client' in 'D:\All_Files\Deaf_Intercom\client\src'
In simple terms, your React application is trying to import the socket.io-client library, but it cannot find it within its node_modules folder.
This almost always means one thing: the npm install socket.io-client command was likely run in the wrong directory. Each part of your project (the server and the client) has its own independent set of node_modules and its own package.json file.
The Solution
We just need to make sure the library is installed in the correct place.
Stop the React development server. Go to the terminal where it's running and press Ctrl+C.
Make sure you are in the client directory. Your terminal prompt should look something like this:
code
Code
D:\All_Files\Deaf_Intercom\client>
If it says server or just Deaf_Intercom, type cd client to move into the correct folder.
Run the installation command again inside the client folder:
code
Bash
npm install socket.io-client
Restart the React application:
code
Bash
npm start
That should resolve the Module not found error, and your application should now compile successfully.
A Quick Note on the Other Warnings
You also saw these messages:
[DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning...
You can safely ignore these. They are not errors. They are warnings from a package that create-react-app uses internally. They don't affect your code and won't stop the application from running.
Let me know once you've run the installation in the client folder. We'll make sure you see the success messages in the console.
Model
Fantastic! Getting the client and server talking is a huge milestone.
Now for the fun part: let's access the user's camera and display their video on the screen. We'll be using the browser's built-in Web Media APIs for this.
Step 1: Add a Video Element to the HTML
First, we need a place in our component to render the video.
In your client/src/App.js file, add a <video> tag inside the main div.
code
JavaScript
// client/src/App.js

import React, { useEffect, useRef } from 'react'; // <-- 1. Import useRef
import io from 'socket.io-client';
import './App.css';

const SERVER_URL = "http://localhost:8000";
const socket = io(SERVER_URL);

function App() {
  const userVideo = useRef(); // <-- 2. Create a ref to hold the video element

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server! My socket ID is:', socket.id);
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  return (
    <div className="App">
      <h1>Video Call Intercom</h1>
      {/* 3. Add the video element here */}
      <video ref={userVideo} autoPlay playsInline muted />
    </div>
  );
}

export default App;
What did we just do?
import useRef: In React, we use useRef to get direct access to a specific element in the HTML, like our <video> tag.
const userVideo = useRef(): We create a "ref" that we can attach to our video element.
<video ref={userVideo} ... />: We add the standard HTML5 video tag.
ref={userVideo}: This links the element to our userVideo ref.
autoPlay: Tells the browser to start playing the video as soon as it has a stream.
playsInline: Important for mobile browsers to play the video in the page instead of going fullscreen.
muted: We mute our own video to prevent a loud feedback loop when we add the other user's audio later.
Step 2: Access the User's Camera and Microphone
Now, we'll use the navigator.mediaDevices.getUserMedia function to request access to the user's camera and display the stream in our video element.
Modify your useEffect hook in client/src/App.js to include the new logic.
code
JavaScript
// client/src/App.js

import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const SERVER_URL = "http://localhost:8000";
const socket = io(SERVER_URL);

function App() {
  const userVideo = useRef();

  useEffect(() => {
    // --- Socket.IO connection logic (stays the same) ---
    socket.on('connect', () => {
      console.log('Connected to server! My socket ID is:', socket.id);
    });
    // --- End of Socket.IO logic ---


    // --- Get user media ---
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        // If the user gives permission, the 'stream' object will be the video/audio feed.
        console.log("Successfully got user media stream");
        
        // Attach the stream to our video element
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      .catch(error => {
        // If the user denies permission or there's an error.
        console.error("Error accessing user media:", error);
      });
    // --- End of get user media ---


    return () => {
      socket.off('connect');
    };
  }, []);

  return (
    <div className="App">
      <h1>Video Call Intercom</h1>
      <video ref={userVideo} autoPlay playsInline muted style={{ width: "300px" }} />
    </div>
  );
}

export default App;```
*I also added a bit of inline style `style={{ width: "300px" }}` to give the video element a size so it's clearly visible.*

### **Step 3: Run and Test**

Your React development server should have automatically refreshed. If not, save the file.

When you look at your browser, something new should happen:

1.  **The browser will ask for your permission** to use the camera and microphone. This is a crucial security feature.
2.  **Click "Allow".**
3.  Once you grant permission, your own video feed should appear on the page!

You have now successfully captured your local video stream and rendered it in your React application. This is the first half of the video-sharing process.

Next, we'll use WebRTC to send this stream to another user. Ready to proceed?
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Excellent debugging! You've run into another very common issue in React. This error is thankfully very simple to fix.
Let's look at the key error message:
Attempted import error: './App' does not contain a default export (imported as 'App').
The Problem
This error means that the main entry point of your React app (src/index.js) is trying to import the App component, but the App.js file is not exporting it correctly.
This almost always happens when the line export default App; is accidentally deleted or commented out from the bottom of the App.js file.
The Solution
We just need to make sure that line is present and correct.
Go back to your client/src/App.js file in VS Code.
Scroll to the very bottom of the file.
Ensure that the last line of the file is exactly this:
code
JavaScript
export default App;
It's very likely that this line is missing.
Here is the complete, corrected code for client/src/App.js just in case. Compare it with your file, paying close attention to the very last line.
code
JavaScript
// client/src/App.js

import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const SERVER_URL = "http://localhost:8000";
const socket = io(SERVER_URL);

function App() {
  const userVideo = useRef();

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server! My socket ID is:', socket.id);
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        console.log("Successfully got user media stream");
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      .catch(error => {
        console.error("Error accessing user media:", error);
      });

    return () => {
      socket.off('connect');
    };
  }, []);

  return (
    <div className="App">
      <h1>Video Call Intercom</h1>
      <video ref={userVideo} autoPlay playsInline muted style={{ width: "300px" }} />
    </div>
  );
}

// Make sure this line is at the very bottom of your file!
export default App;
Once you add or fix that line and save the file, your React development server should automatically recompile and the error will disappear.
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Excellent question. This is a very important checkpoint to make sure everything is working as expected before we move on.
At this stage, you have not built the connection between the two tabs yet. You have only built the part that shows your own local video.
Here is exactly what you should see when you open http://localhost:3000 in two separate browser tabs:
In Tab 1:
The browser will ask for permission to use your camera and microphone.
After you click "Allow," you will see your own face in the video player.
You will NOT see the video from Tab 2.
In Tab 2:
The browser will ask for permission again (since it's a separate tab).
After you click "Allow," you will see your own face in the video player.
You will NOT see the video from Tab 1.
In short, each tab is completely independent right now. Each tab is just showing a live feed from your webcam back to you.
How to Verify Everything is Working Correctly
This is the most important part. Check your terminals:
Go to your Server Terminal (where nodemon server.js is running).
You should now see two "User connected" messages, each with a unique Socket ID. This confirms that both of your tabs have successfully connected to your signaling server.
code
Code
✅ Server is running and listening on http://localhost:8000
User connected with socket ID: aBcDeFgHiJkLmNoP
User connected with socket ID: qRsTuVwXyZaBcDeF
Go to the Developer Console in Each Browser Tab (F12).
Each tab's console should show its own "Connected to server!" message with its corresponding socket ID.
If you see your own video in each tab and two connections in the server log, you are in a perfect position to proceed.
Our next step is the big one: implementing the WebRTC peer-to-peer connection. We will use the signaling server to help these two tabs find each other and exchange video streams directly.
Ready to dive into WebRTC?
User
{1CF3CBCE-4F7A-4549-850C-3FEE611251FD}.png
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Of course. Let's update your server.js file to handle the WebRTC signaling.
Signaling is how two browsers, with the help of a server, exchange the information they need to connect directly to each other. We will add listeners for three main events:
join-room: A new user announces they are ready to join a call.
offer: The first user sends a connection "offer" to the second user.
answer: The second user sends an "answer" back to the first user.
ice-candidate: Both users exchange network information to find the best path to connect.
This code assumes a very simple "one room" model where the first two people who connect will be put into a call together.
Updated server.js Code
Replace the entire contents of your server.js file with this new code. I've added comments to explain all the new parts.
code
JavaScript
// server/server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = 8000;

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// We will use this simple object to keep track of users in the room.
// For a real app, you would use a database.
let usersInRoom = {};

io.on('connection', (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);

  // --- NEW: WebRTC Signaling Logic ---

  // Event: A user wants to join the room
  socket.on('join-room', () => {
    console.log(`User ${socket.id} is joining the room.`);
    // Find the other user (if any)
    const otherUserId = Object.keys(usersInRoom).find(id => id !== socket.id);

    // Add the new user to our list
    usersInRoom[socket.id] = true;

    // If there is another user, tell them a new peer has joined.
    if (otherUserId) {
      console.log(`Notifying user ${otherUserId} that ${socket.id} has joined.`);
      // This tells the original user to start the WebRTC offer process.
      socket.to(otherUserId).emit('user-joined', socket.id);
    }
  });

  // Event: Relay the offer from the caller to the callee
  socket.on('offer', (payload) => {
    console.log(`Relaying offer from ${socket.id} to ${payload.target}`);
    io.to(payload.target).emit('offer', payload);
  });

  // Event: Relay the answer from the callee back to the caller
  socket.on('answer', (payload) => {
    console.log(`Relaying answer from ${socket.id} to ${payload.target}`);
    io.to(payload.target).emit('answer', payload);
  });

  // Event: Relay ICE candidates between peers
  socket.on('ice-candidate', (payload) => {
    // console.log(`Relaying ICE candidate from ${socket.id} to ${payload.target}`); // This can be very noisy
    io.to(payload.target).emit('ice-candidate', payload);
  });

  // --- End of NEW Logic ---


  socket.on('disconnect', () => {
    console.log(`User disconnected with socket ID: ${socket.id}`);
    // Clean up the user from our list when they disconnect
    delete usersInRoom[socket.id];
    // In a real app, you might want to notify the other user about the disconnection.
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server is running and listening on http://localhost:${PORT}`);
});
What We Changed:
usersInRoom: Added a simple variable to keep track of connected clients.
join-room listener: This is the entry point. When a client is ready with its video, it will send this event. The server then checks if another user is already waiting and, if so, notifies that user.
offer, answer, ice-candidate listeners: These are simple "pass-through" events. The server's only job here is to receive a message from one client and relay it directly to the intended recipient. The server doesn't need to understand the content of these messages; it just acts as a middleman.
Your backend is now fully equipped to handle the WebRTC signaling process.
Our next step is to update the React frontend (App.js) to use these new server events to create and manage the peer-to-peer connection. Ready for the frontend update?
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Yes, exactly right.
To be perfectly clear, your setup should be:
Tab 1: Open http://localhost:3000
Tab 2: Open http://localhost:3000
Both tabs are connecting to the same server, and now that the server has the updated signaling logic, it can help them find each other.
Now, let's provide the updated code for the frontend to make use of that server logic. This is the biggest and most complex piece of code, as it will handle the entire WebRTC connection process on the client side.
Updated Frontend App.js Code
This code will:
Add a second <video> element to display the other user's stream.
Store the local video/audio stream in a state variable so it can be added to the WebRTC connection.
Create an RTCPeerConnection object.
Send the join-room event to the server.
Listen for signaling events from the server (user-joined, offer, answer, ice-candidate) and react accordingly.
Replace the entire contents of client/src/App.js with this new code.
code
JavaScript
// client/src/App.js

import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const SERVER_URL = "http://localhost:8000";
const socket = io(SERVER_URL);

// This is a free public STUN server provided by Google.
// It helps clients figure out their public IP address for NAT traversal.
const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

function App() {
  const [localStream, setLocalStream] = useState(null);
  const userVideo = useRef();
  const remoteVideo = useRef();
  const peerConnection = useRef(null);

  useEffect(() => {
    // --- 1. Get user media and set up local video ---
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        // After getting the media, signal the server to join the room
        socket.emit('join-room');
      })
      .catch(error => {
        console.error("Error accessing user media:", error);
      });

    // --- 2. Set up Socket.IO listeners for WebRTC signaling ---
    socket.on('user-joined', (callerId) => {
      console.log(`User ${callerId} joined. I will initiate the call.`);
      // This client is the "caller"
      createPeerConnection(callerId);
      peerConnection.current.createOffer()
        .then(offer => peerConnection.current.setLocalDescription(offer))
        .then(() => {
          const payload = {
            target: callerId,
            caller: socket.id,
            sdp: peerConnection.current.localDescription,
          };
          socket.emit('offer', payload);
        });
    });

    socket.on('offer', (payload) => {
      console.log(`Received offer from ${payload.caller}. I am the callee.`);
      // This client is the "callee"
      createPeerConnection(payload.caller);
      peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.sdp))
        .then(() => peerConnection.current.createAnswer())
        .then(answer => peerConnection.current.setLocalDescription(answer))
        .then(() => {
          const payloadAnswer = {
            target: payload.caller,
            caller: socket.id,
            sdp: peerConnection.current.localDescription,
          };
          socket.emit('answer', payloadAnswer);
        });
    });

    socket.on('answer', (payload) => {
      console.log(`Received answer from ${payload.caller}.`);
      peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    });

    socket.on('ice-candidate', (payload) => {
      // console.log("Received ICE candidate"); // Can be noisy
      peerConnection.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
    });

    // Clean up on component unmount
    return () => {
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, []);

  const createPeerConnection = (partnerId) => {
    // If a connection already exists, close it first
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    // Create a new RTCPeerConnection
    peerConnection.current = new RTCPeerConnection(configuration);

    // Add local stream tracks to the connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream);
      });
    }

    // When the remote user adds a stream, this event is triggered
    peerConnection.current.ontrack = (event) => {
      if (remoteVideo.current) {
        console.log("Received remote stream, setting it to remote video element.");
        remoteVideo.current.srcObject = event.streams[0];
      }
    };

    // Set up ICE candidate handler
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        const payload = {
          target: partnerId,
          candidate: event.candidate,
        };
        socket.emit('ice-candidate', payload);
      }
    };
  };

  return (
    <div className="App">
      <h1>Video Call Intercom</h1>
      <div className="video-container">
        <div>
          <h2>My Video</h2>
          <video ref={userVideo} autoPlay playsInline muted style={{ width: "300px" }} />
        </div>
        <div>
          <h2>Remote Video</h2>
          <video ref={remoteVideo} autoPlay playsInline style={{ width: "300px" }} />
        </div>
      </div>
    </div>
  );
}

export default App;
How to Test It
Now for the moment of truth!
Make sure your server is running.
Make sure your previous client tabs are closed.
Open http://localhost:3000 in Tab 1.
Allow camera access. You should see your own video.
Open http://localhost:3000 in Tab 2.
Allow camera access. You should see your own video in this tab.
Look closely! Within a few seconds, the "Remote Video" section in both tabs should light up with the video stream from the other tab.
You should now have a working two-way video call between the two browser tabs!
Check the browser developer console in both tabs. You'll see the log messages that show the "offer" and "answer" process happening. Also, check your server terminal to see the messages being relayed.
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Excellent question. It's very important to know how to save your progress properly.
The good news is that all the work you've done is already saved in your code files (server.js and App.js). The "conversation" is your source code. You just need to stop the running servers safely before you shut down.
Here is the simple two-part process:
Part 1: How to Stop and Shut Down Safely
Go to the Server Terminal: This is the terminal window where your Node.js server is running (the one you started with nodemon server.js).
Press Ctrl + C.
The terminal might ask Terminate batch job (Y/N)?. Type Y and press Enter.
The server will stop.
Go to the Client Terminal: This is the terminal where your React app is running (the one you started with npm start).
Press Ctrl + C.
Again, if it asks, type Y and press Enter.
The React development server will stop.
Save All Files in VS Code: Make sure there are no unsaved changes. (Go to File > Save All).
That's it! Both servers are now stopped, and your code is saved. You can safely close VS Code and shut down your PC.
Part 2: How to Resume Your Work Later
When you turn your PC back on and are ready to continue:
Open your project folder (deaf-intercom) in VS Code.
Start the Backend Server:
Open a new terminal in VS Code (View > Terminal).
Navigate into the server directory:
code
Bash
cd server
Start the server:
code
Bash
nodemon server.js
Start the Frontend Client:
Open a second terminal in VS Code (click the + icon in the terminal panel).
Navigate into the client directory:
code
Bash
cd client
Start the client:
code
Bash
npm start
Your application will launch in the browser exactly where you left off, and you'll be ready to continue with the next step.
Highly Recommended: Use Git for Version Control
For a major project, this is the perfect time to start using Git. Git is a version control system that tracks changes to your code. Think of it as "unlimited undo" and a backup system for your code.
It's a professional practice and will save you from ever losing your work. You can learn the basics in 15 minutes. It involves creating a "commit" (a snapshot of your code) every time you finish a major step, like right now.
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Ah, I understand completely! You want to save the instructions and code from our conversation itself, not just the project code you've written. That's a very smart idea.
You are right, if you close this browser tab, the chat history might be lost. Here are the best ways to save our entire conversation so you can pick up exactly where we left off.
Option 1: The Best Method (Copy & Paste into VS Code)
This is the most practical option because it keeps the code perfectly formatted and editable.
Create a New File: In your VS Code project (deaf-intercom folder), create a new file named notes.md. The .md stands for Markdown, which will help keep the formatting nice.
Select Our Entire Chat: Click inside this chat window and press Ctrl + A to select everything from the beginning to the end.
Copy: Press Ctrl + C to copy the entire conversation.
Paste into VS Code: Click inside your new notes.md file in VS Code and press Ctrl + V to paste everything.
Why this is the best:
All the code snippets will be there, and you can easily copy them again later.
All the explanations are saved.
It's stored right inside your project folder.
Option 2: The Quick Backup (Print to PDF)
This creates a perfect visual copy of our conversation that you can't accidentally edit.
Click inside this chat window.
Press Ctrl + P to open the Print dialog.
Change the "Destination" or "Printer" to "Save as PDF".
Click "Save" and choose a location, like your deaf-intercom project folder.
Why this is good:
It creates a single, easy-to-read file.
The layout will look exactly like it does on your screen right now.
I recommend you do Option 1. It will be the most useful when you return to your project.
When you come back, you'll have a perfect log of everything we did. You can even copy parts of it and paste them back to me to remind me of our context if needed.
21.5s
Model
ThinkingThoughts
(experimental)
Auto
Expand to view model thoughts

chevron_right
Use Arrow Up and Arrow Down to select a turn, Enter to jump to it, and Escape to return to the chat.
Start typing a prompt

Run
Ctrl
Response ready.