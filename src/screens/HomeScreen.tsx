import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useCalorie } from '../context/CalorieContext';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, getCalorieZone, resetDay } = useCalorie();
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));

  const calorieZone = getCalorieZone();
  const isWithinEatingWindow = state.isWithinEatingWindow;

  // Animate calorie changes
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [state.currentCalories]);

  const getZoneColors = () => {
    switch (calorieZone) {
      case 'green':
        return ['#4ade80', '#22c55e', '#16a34a'];
      case 'yellow':
        return ['#fbbf24', '#f59e0b', '#d97706'];
      case 'red':
        return ['#f87171', '#ef4444', '#dc2626'];
      default:
        return ['#6b7280', '#4b5563', '#374151'];
    }
  };

  const getZoneMessage = () => {
    const netCalories = state.currentCalories;
    if (netCalories <= state.dailyGoal * 0.8) {
      return "You're burning through the calorie forest! 🌲";
    } else if (netCalories <= state.dailyGoal) {
      return "Steady progress down the mountain ⛰️";
    } else {
      return "Take a moment to pause and reflect 🧘";
    }
  };

  const handleAddFood = () => {
    if (!isWithinEatingWindow) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('FoodLog');
  };

  const handleSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Settings');
  };

  const handleResetDay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    resetDay();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
          <Text style={styles.targetText}>
            Target: {state.settings.targetWeight} lbs
          </Text>
        </View>
        
        <TouchableOpacity onPress={handleResetDay} style={styles.resetButton}>
          <Text style={styles.resetIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Eating Window Indicator */}
      <View style={styles.eatingWindowContainer}>
        <LinearGradient
          colors={isWithinEatingWindow ? ['#4ade80', '#22c55e'] : ['#6b7280', '#4b5563']}
          style={styles.eatingWindowIndicator}
        >
          <Text style={styles.eatingWindowText}>
            {isWithinEatingWindow ? '🍽️ Eating Window Open' : '⏰ Outside Eating Window'}
          </Text>
          <Text style={styles.eatingWindowTime}>
            {state.settings.eatingWindowStart} - {state.settings.eatingWindowEnd}
          </Text>
        </LinearGradient>
      </View>

      {/* Calorie Mountain */}
      <View style={styles.calorieContainer}>
        <LinearGradient
          colors={getZoneColors()}
          style={styles.calorieMountain}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.calorieContent, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.calorieNumber}>
              {Math.round(state.currentCalories).toLocaleString()}
            </Text>
            <Text style={styles.calorieLabel}>calories remaining</Text>
          </Animated.View>
        </LinearGradient>
        
        <Text style={styles.zoneMessage}>{getZoneMessage()}</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.addFoodButton,
            !isWithinEatingWindow && styles.disabledButton
          ]}
          onPress={handleAddFood}
          disabled={!isWithinEatingWindow}
        >
          <LinearGradient
            colors={isWithinEatingWindow ? ['#3b82f6', '#1d4ed8'] : ['#6b7280', '#4b5563']}
            style={styles.addFoodGradient}
          >
            <Text style={styles.addFoodIcon}>🍎</Text>
            <Text style={styles.addFoodText}>Log Food</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Daily Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Today's Journey</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Food entries:</Text>
          <Text style={styles.summaryValue}>{state.foodEntries.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Net calories:</Text>
          <Text style={styles.summaryValue}>
            {Math.round(state.dailyGoal - state.currentCalories).toLocaleString()}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingsButton: {
    padding: 10,
  },
  settingsIcon: {
    fontSize: 24,
  },
  headerInfo: {
    alignItems: 'center',
  },
  dateText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  targetText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  resetButton: {
    padding: 10,
  },
  resetIcon: {
    fontSize: 24,
  },
  eatingWindowContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  eatingWindowIndicator: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  eatingWindowText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eatingWindowTime: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
  },
  calorieContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  calorieMountain: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  calorieContent: {
    alignItems: 'center',
  },
  calorieNumber: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  calorieLabel: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 8,
  },
  zoneMessage: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addFoodButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  addFoodGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addFoodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  addFoodText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#16213e',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#9ca3af',
    fontSize: 14,
  },
  summaryValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen; 