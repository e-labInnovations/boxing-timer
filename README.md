# 🥊 Boxing Timer Pro

A professional, feature-rich boxing timer application built with React and TypeScript. Perfect for boxing training, HIIT workouts, and any interval-based training routines.

![Boxing Timer Pro](https://img.shields.io/badge/Version-1.0.0-blue) ![React](https://img.shields.io/badge/React-19.1.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.0.4-purple)

## ✨ Features

### 🎯 Core Timer Functionality

- **Multi-Stage Timer**: Configure custom stages (Prepare, Fight, Rest, etc.) with individual durations
- **Round-Based Training**: Set specific number of rounds or use infinite mode
- **Visual Progress**: Beautiful circular progress indicator with color transitions
- **Stage Navigation**: Clear indication of current stage and progress through rounds

### 🔊 Audio & Feedback

- **Custom Sound Effects**: Built-in sounds (Bell, Buzzer, Gong, Air Horn, etc.)
- **Stage-Specific Sounds**: Different sounds for stage start, end, and round completion
- **Vibration Support**: Haptic feedback on mobile devices (when supported)
- **Voice Announcements**: Optional voice announcements for stage transitions

### 📱 Mobile-First Design

- **Responsive UI**: Optimized for all screen sizes
- **Fullscreen Mode**: Distraction-free training experience
- **Orientation Lock**: Portrait mode lock during active timers (mobile)
- **Wake Lock**: Prevents screen from sleeping during workouts
- **PWA Ready**: Install as a progressive web app

### 🎨 Customization

- **Templates**: Save and manage custom timer configurations
- **Color Themes**: Light/dark mode with customizable accent colors
- **Sound Customization**: Choose from built-in sounds or add custom sounds
- **Flexible Configuration**: Adjust all timer settings to match your training needs

### ⚙️ Advanced Features

- **Countdown Timer**: Optional 3-2-1 countdown before starting
- **Drag & Drop**: Reorder stages in configuration
- **Local Storage**: Automatically saves settings and templates
- **Toast Notifications**: User-friendly feedback messages

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/boxing-timer.git
cd boxing-timer
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🎮 How to Use

### Basic Usage

1. **Start Timer**: Click the play button to begin your workout
2. **Pause/Resume**: Click pause to stop, then play to resume
3. **Reset**: Use the reset button to start over
4. **Fullscreen**: Click the maximize icon for fullscreen mode

### Configuration

1. **Open Settings**: Click the settings icon (⚙️)
2. **Configure Stages**:
   - Add/remove stages
   - Set stage titles and durations
   - Choose start/end sounds for each stage
3. **Set Rounds**: Choose number of rounds or infinite mode
4. **Customize Features**:
   - Enable/disable countdown
   - Toggle vibration and voice announcements
   - Select accent colors
   - Configure color transitions

### Templates

1. **Save Configuration**: In settings, enter a template name and click "Save Template"
2. **Load Template**: Click the book icon (📖) to access saved templates
3. **Manage Templates**: Load or delete existing templates

### Default Configuration

- **Prepare**: 10 seconds
- **Fight**: 3 minutes (180 seconds)
- **Rest**: 1 minute (60 seconds)
- **Total Rounds**: 5
- **Sounds**: Bell variations for different stages

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling framework

### UI Components

- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Next Themes** - Dark/light mode

### Features & Hooks

- **@dnd-kit** - Drag and drop functionality
- **Custom Hooks** - Sound, vibration, fullscreen, wake lock, orientation lock

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 🌐 Browser Support

### Recommended

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

### Mobile Features

- **Vibration**: Supported on Android Chrome, limited iOS support
- **Orientation Lock**: Android Chrome, some iOS support
- **Wake Lock**: Modern browsers with HTTPS
- **PWA Installation**: All modern browsers

## 📱 Mobile Installation

### Android

1. Open the app in Chrome
2. Tap the menu (⋮) and select "Add to Home screen"
3. Confirm installation

### iOS

1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm installation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature-specific components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## 🐛 Troubleshooting

### Common Issues

- **No sound on iOS**: iOS requires user interaction before playing audio
- **Vibration not working**: Feature requires HTTPS and supported device
- **Screen goes to sleep**: Wake Lock requires HTTPS and supported browser
- **Orientation lock fails**: Feature primarily works on mobile devices

### Performance Tips

- Use fullscreen mode for better performance
- Close other browser tabs during intensive workouts
- Ensure stable internet connection for PWA features

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/boxing-timer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/boxing-timer/discussions)

---

Made with ❤️ for the boxing and fitness community
