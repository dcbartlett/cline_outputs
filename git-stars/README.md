# GitHub Repo Tracker

A web application that tracks the top 10 GitHub repositories by stars and follower counts, and sends OS notifications when these counts are updated.

## Features
- Displays top 10 GitHub repositories by star count.
- Displays top 10 GitHub repositories by follower count.
- Sends operating system notifications when the star or follower counts of tracked repositories change.
- Uses Express.js for static file hosting.

## Requirements
- Node.js
- npm
- Web browser with notification support

## Installation
1. Clone the repository.
2. Navigate to the `git-stars` directory: `cd git-stars`
3. Run `npm install` to install dependencies.
4. Start the server: `node server.js`
5. Open `http://localhost:3000` in your browser.

## File Structure
```
git-stars/
├── server.js          # Express server for static hosting
├── public/           # Static files
│   ├── index.html     # Main application interface
│   ├── script.js      # JavaScript logic
│   └── github-mark-white.png # GitHub logo
├── package.json       # Project dependencies
└── README.md          # Project description (this file)
```

## Technologies Used
- Express.js for backend server
- Vanilla JavaScript for frontend
- HTML5/CSS3 for UI
- GitHub API (for fetching repository data)
- Notifications API (for OS notifications)

## License
MIT License
