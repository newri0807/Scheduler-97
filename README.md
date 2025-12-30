# Scheduler 97 - Retro PWA Task Manager

A nostalgic Windows 95/97/98 themed PWA scheduler built with Next.js 14. Experience the classic desktop computing era with modern web technologies!

![Windows 97 Style](https://img.shields.io/badge/Style-Windows%2097-blue?style=flat-square)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-green?style=flat-square)
![Mobile Optimized](https://img.shields.io/badge/Mobile-Optimized-orange?style=flat-square)

## 🖥️ Features

### 🎨 Authentic Windows 95/97/98 Design
- **Classic UI Elements**: 3D outset/inset borders, gray panels, blue title bars
- **Pixel-Perfect**: Monospace fonts (Courier New) for that retro computing feel
- **Teal Desktop Background**: Just like the original Windows 95 default wallpaper
- **Beveled Buttons**: Upper-left white highlights, lower-right dark shadows
- **No Rounded Corners**: Sharp, angular design throughout

### 📅 Calendar & Task Management
- **Monthly Calendar Grid**: Navigate months with classic arrow buttons
- **Smart Task Display**: Shows up to 3 tasks per day, click "+n more" for all
- **Drag & Drop**: Move tasks between dates by dragging (powered by dnd-kit)
- **Task Operations**:
  - ✅ Mark complete/incomplete (with strikethrough)
  - ✏️ Edit task title, description, and date
  - 🗑️ Delete with confirmation dialog (no browser alerts!)
  - 📅 Date picker for flexible scheduling

### 📱 Mobile-First Design
- **Optimized for 390px**: Perfect for modern smartphones
- **Touch-Friendly**: Minimum 32px touch targets for easy tapping
- **Responsive Layout**: Adapts from mobile to desktop seamlessly
- **PWA Installable**: Add to home screen for app-like experience

### 🔐 Simple Authentication
- **localStorage Based**: No backend required
- **Auto-Login**: Remembers your session
- **Quick Setup**: Just name and email to get started

### 🔔 PWA Features
- **App Badge**: Shows count of today's pending tasks on app icon
- **Service Worker**: Offline capability
- **Installable**: Works as standalone app on mobile and desktop
- **Fast Loading**: Optimized performance

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16.1.1 (App Router) |
| Styling | Tailwind CSS v4 |
| UI Components | Custom Windows 97 components |
| Drag & Drop | @dnd-kit/core |
| Date Utils | date-fns |
| Icons | Lucide React |
| PWA | @ducanh2912/next-pwa |
| Storage | localStorage |
| Language | TypeScript |

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd scheduler-app

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enjoy the retro vibes! 🎉

### Building for Production

```bash
# Build (must use webpack for PWA support)
npm run build -- --webpack

# Start production server
npm start
```

## 📦 Project Structure

```
scheduler-app/
├── src/
│   ├── app/
│   │   ├── calendar/page.tsx     # Main calendar with drag & drop
│   │   ├── login/page.tsx        # Windows 97 login window
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Redirects to login
│   │   └── globals.css           # Windows 97 theme styles
│   ├── components/
│   │   ├── Win95Button.tsx       # 3D button component
│   │   ├── Win95Window.tsx       # Window with title bar
│   │   ├── Win95Input.tsx        # Inset input field
│   │   ├── Win95ConfirmDialog.tsx # System dialog replacement
│   │   ├── CalendarGrid.tsx      # Drag & drop calendar
│   │   ├── TodoDialog.tsx        # Task details/edit
│   │   ├── AddTodoDialog.tsx     # New task with date picker
│   │   └── DayTodosModal.tsx     # All tasks for a day
│   ├── lib/
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── storage.ts            # localStorage helpers
│   │   ├── date-utils.ts         # Date formatting
│   │   └── utils.ts              # Utility functions
│   └── hooks/
│       └── useConfirm.tsx        # Confirm dialog hook
├── public/
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service worker (auto-gen)
└── next.config.ts                # Next.js + PWA config
```

## 🎮 How to Use

### First Time Setup
1. Open the app and see the **Windows 97 login window**
2. Enter your **name** and **email**
3. Click **Continue** - your data is saved locally

### Managing Tasks
- **Add Task**: Click "Add New Task" button at the bottom
- **Set Date**: Use the date picker in the task dialog
- **Drag to Reschedule**: Click and drag any task to a different date
- **View Details**: Click on a task to view/edit/delete
- **Mark Complete**: Click "Complete" button (adds strikethrough)
- **View All**: Click "+n more" to see all tasks for a day

### Navigation
- **← →** buttons: Navigate between months
- **Today**: Highlighted with yellow background
- **Logout**: Top-right corner button

## 🎨 Design Philosophy

This app recreates the authentic Windows 95/97/98 experience:

1. **Outset Effects**: `border-t-white border-l-white border-r-black border-b-black`
2. **Inset Effects**: `border-t-gray-800 border-l-gray-800 border-r-white border-b-white`
3. **Button Press**: Inverted borders on `:active`
4. **Gray Panels**: `background-color: #C0C0C0`
5. **Blue Title Bar**: `linear-gradient(to right, #000080, #1084d0)`
6. **Teal Background**: `#008080` (classic Windows desktop)
7. **No Antialiasing**: Pixelated text rendering

## 🔧 PWA Setup

### Creating Icons

The app needs two icon files for full PWA support:

```bash
public/
├── icon-192x192.png  # 192x192 pixels
└── icon-512x512.png  # 512x512 pixels
```

**Recommended Tools:**
- [Favicon Generator](https://www.favicon-generator.org/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

**Design Tip:** Create a pixelated calendar icon with the Windows 97 color palette!

### App Badge

The app automatically displays the number of pending tasks for today on the app icon badge (supported browsers only).

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Configure:
   - **Build Command**: `npm run build -- --webpack`
   - **Output Directory**: `.next`
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📱 Browser Support

| Browser | Desktop | Mobile | PWA | Badge |
|---------|---------|--------|-----|-------|
| Chrome | ✅ | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ⚠️ | ❌ |
| Safari | ✅ | ✅ | ⚠️ | ❌ |

## 🐛 Known Issues

- Fast Refresh may require full reload during development
- Some older browsers may not support app badges
- Safari has limited PWA features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Inspired by the classic Windows 95/97/98 UI
- Built with modern web technologies
- Thanks to the Next.js and React communities

---

**Made with ❤️ and nostalgia for the 90s computing era**

**Press Start to Continue...** 🎮
