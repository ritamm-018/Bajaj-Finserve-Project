# BFHL Hierarchy Analyzer

A full-stack application for analyzing hierarchical node relationships, detecting cycles, and visualizing tree structures.

## 🚀 Features

- **REST API** built with Express.js that processes node relationships
- **React Frontend** with beautiful, responsive UI
- **Cycle Detection** using depth-first search algorithm
- **Tree Visualization** with depth calculation
- **Multi-parent Handling** with first-parent-wins strategy
- **Input Validation** with detailed error reporting

## 📋 API Specification

### Endpoint
```
POST /bfhl
Content-Type: application/json
```

### Request Body
```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

### Response
```json
{
  "user_id": "johndoe_17091999",
  "email_id": "john.doe@college.edu",
  "college_roll_number": "21CS1001",
  "hierarchies": [...],
  "invalid_entries": [...],
  "duplicate_edges": [...],
  "summary": {
    "total_trees": 3,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- CORS enabled for cross-origin requests
- Helmet for security headers
- Morgan for request logging

### Frontend
- React 18
- Vite for fast development
- Modern CSS with gradients and animations
- Responsive design

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Backend Setup
```bash
cd server
npm install
npm start
```

The API will run on `http://localhost:3001`

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🧪 Testing

Run the verification script to test the core logic:
```bash
cd server
node test/verify.js
```

## 🌐 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables if needed

### Frontend (Vercel/Netlify)
1. Connect repository to Vercel/Netlify
2. Set root directory: `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Update API URL in `App.jsx` to your deployed backend URL

## 📝 Configuration

Before deployment, update the following in `server/src/controllers/bfhlController.js`:
```javascript
const USER_ID = "yourname_ddmmyyyy";
const EMAIL_ID = "your.email@college.edu";
const COLLEGE_ROLL_NUMBER = "YOUR_ROLL_NUMBER";
```

## 🎯 Processing Rules

1. **Valid Format**: `X->Y` where X and Y are single uppercase letters (A-Z)
2. **Invalid Entries**: Self-loops, wrong format, empty strings
3. **Duplicates**: First occurrence wins, subsequent ones tracked
4. **Cycles**: Detected using DFS, returns empty tree object
5. **Depth**: Count of nodes on longest root-to-leaf path
6. **Multi-parent**: First-encountered parent edge wins

## 📊 Example

Input:
```json
{
  "data": ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X"]
}
```

Output:
- Tree A with depth 3 (A → B → D, A → C)
- Cycle detected in X → Y → Z → X
- Summary shows 1 tree, 1 cycle, largest root: A

## 🤝 Contributing

This project was built for the SRM Full Stack Engineering Challenge.

## 📄 License

MIT License
