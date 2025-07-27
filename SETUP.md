# Setup Guide for Samsung Galaxy S24 📱

## Quick Start (Windows)

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Restart your computer after installation

2. **Run the installation script**
   ```bash
   install.bat
   ```

3. **Start the development server**
   ```bash
   start.bat
   ```

## Manual Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Setup Your Samsung Galaxy S24

#### Enable Developer Options
1. Go to **Settings** > **About Phone**
2. Tap **"Build Number"** 7 times
3. Go back to **Settings** > **Developer Options**
4. Enable **"USB Debugging"**

#### Install Expo Go
1. Open **Google Play Store**
2. Search for **"Expo Go"**
3. Install the app

#### Connect Your Device
1. Connect your S24 to your computer via USB
2. Allow USB debugging when prompted
3. Make sure your phone and computer are on the same WiFi network

### 4. Run the App
1. The Expo development server will show a QR code
2. Open **Expo Go** on your S24
3. Scan the QR code
4. The app will load on your device!

## Troubleshooting

### Node.js Not Found
- Restart your computer after installing Node.js
- Or run: `refreshenv` in PowerShell

### Expo Go Issues
- Make sure both devices are on the same WiFi
- Try using USB connection instead of WiFi
- Restart Expo Go app

### Build Errors
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## App Features

Once running, you'll see:

### 🏠 Home Screen
- Large calorie mountain display
- Eating window indicator
- Daily progress summary
- Quick action buttons

### 🍎 Food Log Screen
- Calorie input
- Mindful reason selection
- Behavioral awareness prompts

### ⚙️ Settings Screen
- Weight goal configuration
- Eating window setup
- App information

## Next Steps

1. **Configure Settings**: Set your target weight and eating window
2. **Test Features**: Try logging food and see the mindful pause
3. **Customize**: Adjust the eating window to match your schedule
4. **Use Daily**: Make it part of your mindful eating routine

## Support

If you encounter issues:
1. Check the console output for error messages
2. Ensure all dependencies are installed
3. Verify your S24 is properly connected
4. Try restarting the development server

---

**Enjoy your mindful weight loss journey! 🌲** 