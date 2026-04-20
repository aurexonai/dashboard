# AurexonAI Dashboard

A production-grade AI-powered marketplace intelligence dashboard built with React, Vite, Tailwind CSS, Zustand, and Recharts.

This system answers one core question:
**Should I sell this product at this price or not?**

---

## 🚀 Tech Stack

- React + Vite
- Tailwind CSS (custom tokens)
- Zustand (state management)
- React Router v6
- Recharts (charts)

---

## 🎨 Design System

### Tailwind Tokens

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        "bg-base": "#FFFFFF",
        "bg-section": "#F2F2F2",
        "text-primary": "#173036",
        "text-secondary": "#555555",
        "accent": "#D6FC45",
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Poppins", "sans-serif"],
      },
    },
  },
}
```

### UI Rules

- Light theme only
- Card-based UI
- `shadow-sm` default, `hover:shadow-md`
- Soft borders: `border-gray-200`
- Accent only for buttons and highlights
- Strong spacing and typography

---

## 🔐 Authentication

### Routes

- `/login`
- `/signup`

### Behavior

- LocalStorage-based auth
- Protected routes redirect to `/login`
- No backend required

---

## 🧱 Layout Architecture

- Fixed Sidebar
- Fixed Header
- Scrollable Content

### Sidebar

- Expanded: `w-64`
- Collapsed: `w-20`
- Mobile: Drawer

### Responsive Grid

```css
grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

---

## 📁 Project Structure

```bash
src/
  components/
  pages/
  store/
  hooks/
  router/
  assets/
  App.jsx
  main.jsx
  index.css

tailwind.config.js
```

---

## 🧠 Zustand Store

### State

- user
- product
- pricing
- evaluation
- trends
- insights
- listings

### Actions

- login()
- signup()
- logout()
- setProduct()
- runAI()
- addListing()

---

## 🤖 AI Simulation Logic

Deterministic logic. No randomness.

### Functions

- suggestPrice()
- generateTrends()
- calcTrustScore()
- produceInsights()

---

## 📊 Pages

### `/`
Product input form + AI trigger

### `/pricing-engine`
- Suggested price
- Price range
- Status badge
- Confidence bar

### `/market-trends`
- Line chart (7 days)
- Trend summary

### `/evaluation`
- Trust score
- Value rating

### `/comparison`
- Competitor comparison table

### `/monitoring`
- CPU/GPU simulation (updates every 2s)

### `/transactions`
- Profit estimation
- Sell probability
- Bar chart

### `/insights`
- AI recommendations list

### `/listings`
- Add/edit/delete listings

### `/settings`
- UI toggles

---

## 🧩 Components

- Card
- Button
- Input
- StatCard
- ChartContainer
- SidebarItem
- Header

---

## ⚡ Interactions

- Sidebar animation (`transition-all duration-300`)
- Mobile drawer
- Button hover scale
- Tooltip on collapsed sidebar
- Form validation

---

## 🛠️ Installation

```bash
git clone https://github.com/your-username/aurexonai-dashboard.git
cd aurexonai-dashboard
npm install
npm run dev
```

---

## 📦 Build

```bash
npm run build
```

---

## 🔒 Environment

- No backend
- Uses localStorage

---

## 📈 Future Enhancements

- Real AI integration
- Backend API
- Payments
- Multi-user system
- RBAC

---

## 📄 License

MIT
