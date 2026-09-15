# 🎒 Campus Lost & Found

A cloud-based campus Lost & Found platform that helps students
report, discover, and manage lost and found items.

## 🌐 Live Demo

https://danyaramesh1647-lang.github.io/lost-and-found/

## 📌 About the Project

Campus Lost & Found is a web-based platform designed to make it
easier for students to report lost items and post items they have
found on campus.

Users can securely log in, create lost/found posts, upload item
images, and manage their own posts. The platform uses Supabase as
the cloud backend for authentication, database storage, file
storage, and real-time updates.

## ✨ Features

- 🔐 User Authentication
- 📌 Post Lost Items
- 🔎 Post Found Items
- 📝 Add item title, description and location
- 🖼️ Upload item images
- ⚡ Real-time item updates
- ✅ Mark items as resolved
- 🗑️ Delete your own posts
- ☁️ Cloud-based backend using Supabase

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Cloud Backend
- Supabase
  - Authentication
  - PostgreSQL Database
  - Storage
  - Realtime

### Deployment
- GitHub Pages

## ☁️ Cloud Computing Concepts

This project demonstrates the use of cloud services in a
real-world campus application.

### Authentication
Supabase Authentication is used to securely manage user accounts
and login sessions.

### Cloud Database
Item information is stored in a Supabase PostgreSQL database
instead of being stored only on the local computer.

### Cloud Storage
Images uploaded by users are stored in the Supabase Storage bucket.

### Realtime Communication
Supabase Realtime allows changes to the Lost & Found board to be
reflected without requiring users to manually refresh the page.

## 🔄 System Workflow

1. User opens the Lost & Found website.
2. User signs up or logs in.
3. Authenticated users access the board.
4. User creates a Lost or Found item post.
5. Item details are stored in the cloud database.
6. Optional images are uploaded to cloud storage.
7. The item appears on the board.
8. Realtime updates keep the board synchronized.
9. Users can resolve or delete their own posts.

## 🏗️ Project Structure

```text
lost-and-found/
│
├── index.html
├── auth.js
├── board.html
├── board.js
├── style.css
├── supabase-client.js
└── README.md

🚀 Running the Project Locally
1. Clone the repository
git clone https://github.com/danyaramesh1647-lang/lost-and-found.git
2. Open the project

Open the project folder in VS Code.

3. Configure Supabase

Update the Supabase project configuration in:

supabase-client.js
4. Run the project

Open index.html using a local development server such as
VS Code Live Server.

🌐 Deployment

The project is deployed using GitHub Pages.

Live Website:

https://danyaramesh1647-lang.github.io/lost-and-found/

🔒 Security

The application uses Supabase Authentication and database access
controls to ensure that users can manage their own content.

Sensitive Supabase secret/service-role keys should never be exposed
in frontend code.

🎯 Future Enhancements
🔍 Search and filter items
📍 Better campus location selection
📧 Notifications for potential matches
💬 Communication between finder and owner
📱 Improved mobile responsiveness
🤖 Automatic matching of lost and found items
👩‍💻 Project

Campus Lost & Found

Built as a Cloud Computing project using Supabase and GitHub Pages.