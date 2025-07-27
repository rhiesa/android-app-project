import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useCalorie } from '../context/CalorieContext';

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, updateSettings } = useCalorie();
  const [targetWeight, setTargetWeight] = useState(state.settings.targetWeight.toString());
  const [currentWeight, setCurrentWeight] = useState(state.settings.currentWeight.toString());
  const [eatingWindowStart, setEatingWindowStart] = useState(state.settings.eatingWindowStart);
  const [eatingWindowEnd, setEatingWindowEnd] = useState(state.settings.eatingWindowEnd);
  const [showTimePicker, setShowTimePicker] = useState<'start' | 'end' | null>(null);

  const handleSave = () => {
    if (!targetWeight || !currentWeight) {
      Alert.alert('Invalid Input', 'Please enter valid weights.');
      return;
    }

    const newTargetWeight = Number(targetWeight);
    const newCurrentWeight = Number(currentWeight);

    if (newTargetWeight <= 0 || newCurrentWeight <= 0) {
      Alert.alert('Invalid Input', 'Weight must be greater than 0.');
      return;
    }

    // Calculate BMR using a simple formula (can be improved)
    const bmr = newCurrentWeight * 12; // Rough estimate

    updateSettings({
      targetWeight: newTargetWeight,
      currentWeight: newCurrentWeight,
      eatingWindowStart,
      eatingWindowEnd,
      bmr,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', 'Settings saved successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleTimeSelect = (time: string, type: 'start' | 'end') => {
    if (type === 'start') {
      setEatingWindowStart(time);
    } else {
      setEatingWindowEnd(time);
    }
    setShowTimePicker(null);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Weight Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight Goals</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Weight (lbs)</Text>
            <TextInput
              style={styles.input}
              value={currentWeight}
              onChangeText={setCurrentWeight}
              keyboardType="numeric"
              placeholder="Enter current weight"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Target Weight (lbs)</Text>
            <TextInput
              style={styles.input}
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="numeric"
              placeholder="Enter target weight"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Your daily calorie goal is calculated as: Target Weight × 3600 calories
            </Text>
          </View>
        </View>

        {/* Eating Window Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eating Window</Text>
          
          <View style={styles.timeContainer}>
            <View style={styles.timeGroup}>
              <Text style={styles.inputLabel}>Start Time</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowTimePicker('start')}
              >
                <Text style={styles.timeText}>{eatingWindowStart}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeGroup}>
              <Text style={styles.inputLabel}>End Time</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowTimePicker('end')}
              >
                <Text style={styles.timeText}>{eatingWindowEnd}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoIcon}>⏰</Text>
            <Text style={styles.infoText}>
              Food logging is only allowed during your eating window
            </Text>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoIcon}>🧘</Text>
            <Text style={styles.infoText}>
              This app focuses on mindful eating and behavioral awareness rather than strict calorie counting.
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoIcon}>🌲</Text>
            <Text style={styles.infoText}>
              Visualize your weight loss as a journey through a calorie forest or down a mountain.
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoIcon}>💭</Text>
            <Text style={styles.infoText}>
              The app encourages mindful pauses and self-reflection before eating.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#16213e', '#0f172a']}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>
                Select {showTimePicker === 'start' ? 'Start' : 'End'} Time
              </Text>
              
              <ScrollView style={styles.timeOptionsList}>
                {timeOptions.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={styles.timeOption}
                    onPress={() => handleTimeSelect(time, showTimePicker)}
                  >
                    <Text style={styles.timeOptionText}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowTimePicker(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeButton: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  timeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    color: '#9ca3af',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  timeOptionsList: {
    maxHeight: 300,
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  timeOptionText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#9ca3af',
    fontSize: 16,
  },
});

export default SettingsScreen; 