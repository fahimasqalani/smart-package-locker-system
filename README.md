# 📦 Smart Package Locker Management System

## 🚀 Getting Started

## Step 1 — Start the Backend

Open your **first terminal**, then run:

```bash
cd backend
npm install
npm run dev       # start with nodemon (port 3000)
```

You should see this output, which means it is working:

```
🚀 Smart Locker API → http://localhost:3000
✅ Seeded 7 lockers (3 Small, 2 Medium, 2 Large)
```

> The backend automatically creates 7 lockers on startup so you can use the app right away.

**Keep this terminal open and running.**

---

## Step 2 — Start the Frontend

Open your **second terminal**, then run:

```bash
cd frontend
npm install
npm start         # Angular dev server (port 4200)
```

Wait for this message before opening your browser:

```
✔ Compiled successfully.
```

Then open your browser and go to:

```
http://localhost:4200
```

---

## 🖥 Using the App

The app has five pages accessible from the sidebar on the left:

### Dashboard
An overview of your locker station. Shows how many lockers are available, occupied, and a live activity feed. Click **Refresh** to get the latest data.

### Lockers
View all locker units and their current status. Click **Add Locker** to create new lockers — choose from Small, Medium, or Large.

### Store Package *(Delivery Agent)*
Use this when a delivery agent drops off a package. Enter the customer ID and select the package size. The system will automatically assign the best available locker and generate a **6-character pickup code**.

> Write down the **Locker ID** and **Pickup Code** shown after storing — the customer will need both to collect their package.

### Pickup Package *(Customer)*
Use this when a customer comes to collect their package. Enter the **Locker ID** and **Pickup Code**. The system will open the locker and calculate any storage charges if the package was kept for more than one day.

### History
A full log of every package that has been stored or retrieved. You can filter by status and search by customer ID or pickup code.

---

## 🧪 Running Tests

The backend has a full test suite. With the backend terminal stopped (or in a third terminal), run:

```bash
cd backend
npm install        # if you have not already
npm test
```