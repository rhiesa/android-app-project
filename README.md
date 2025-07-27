# Mindful Weight Tracker 🌲

A beautiful, mindful weight loss habit tracker focused on behavioral awareness rather than strict calorie counting. Visualize your weight loss journey as climbing down a calorie mountain or walking through a forest.

## 🌟 Features

### Core Features
- **Custom Eating Window**: Set your eating time window (e.g., 8am–6pm) with visual indicators
- **Live Calorie Countdown**: Real-time calorie mountain that decreases throughout the day
- **Mindful Pre-Logging Pause**: Reflect on why you're eating before logging food
- **Behavioral Awareness**: Encourages mindful eating habits over strict counting

### Visual Elements
- **Calorie Mountain**: Large, animated display showing remaining calories
- **Color Zones**: Green (deficit), Yellow (neutral), Red (surplus)
- **Eating Window Indicator**: Clear visual feedback for allowed eating times
- **Beautiful UI**: Dark theme with gradients and smooth animations

### Mindful Features
- **Reason Selection**: Choose why you're eating before logging
- **Mental Redirects**: Gentle suggestions for non-hunger eating
- **Haptic Feedback**: Tactile responses for better user experience
- **Offline-Friendly**: Works without internet connection

## 📱 Screenshots

The app features:
- **Home Screen**: Large calorie mountain with eating window indicator
- **Food Log Screen**: Mindful pause with reason selection
- **Settings Screen**: Configure eating window and weight goals

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Physical Android device or emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindful-weight-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on Android**
   ```bash
   npm run android
   # or
   yarn android
   ```

### For Samsung Galaxy S24

1. **Enable Developer Options** on your S24:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings > Developer Options
   - Enable "USB Debugging"

2. **Install Expo Go** from Google Play Store

3. **Connect your device** and scan the QR code from the Expo development server

## 🛠️ Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Screen navigation
- **Expo Linear Gradient**: Beautiful gradient effects
- **Expo Haptics**: Tactile feedback
- **AsyncStorage**: Local data persistence

## 📊 How It Works

### Calorie Calculation
- **Daily Goal**: Target Weight × 3600 calories
- **BMR**: Calculated based on current weight
- **Real-time Updates**: Calories decrease based on BMR throughout the day

### Eating Window
- **Customizable**: Set your preferred eating hours
- **Visual Feedback**: Clear indication when eating is allowed
- **Restrictions**: Food logging disabled outside window

### Mindful Pause
- **Reason Selection**: Choose from 5 eating reasons
- **Mental Redirects**: Gentle suggestions for emotional eating
- **Behavioral Awareness**: Builds mindful eating habits

## 🎨 Design Philosophy

This app focuses on **mindful eating** rather than strict calorie counting:

- **Visual Metaphors**: Mountain/forest journey for weight loss
- **Gentle Guidance**: Encourages self-reflection over restriction
- **Behavioral Focus**: Addresses the "why" behind eating
- **Beautiful UX**: Calming, encouraging interface

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context for state management
├── screens/            # Main app screens
│   ├── HomeScreen.tsx  # Main calorie mountain view
│   ├── FoodLogScreen.tsx # Mindful food logging
│   └── SettingsScreen.tsx # App configuration
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🔧 Configuration

### Settings
- **Current Weight**: Your current weight in pounds
- **Target Weight**: Your goal weight in pounds
- **Eating Window**: Start and end times for allowed eating
- **BMR**: Automatically calculated based on weight

### Features
- **Offline Support**: Works without internet
- **Data Persistence**: Saves progress locally
- **Haptic Feedback**: Tactile responses for interactions
- **Dark Theme**: Easy on the eyes

## 🎯 Usage Tips

1. **Set Realistic Goals**: Start with achievable weight targets
2. **Respect Eating Windows**: Only eat during your set times
3. **Use Mindful Pause**: Always reflect before eating
4. **Track Consistently**: Log food regularly for best results
5. **Be Patient**: Focus on behavioral changes over quick results

## 🤝 Contributing

This is a personal project focused on mindful eating. Feel free to:
- Report bugs
- Suggest features
- Improve the UI/UX
- Add new mindful features

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by mindful eating principles
- Built with React Native and Expo
- Designed for behavioral change over restriction

---

**Remember**: This app is designed to support mindful eating habits, not replace professional medical advice. Always consult with healthcare professionals for weight loss guidance. 