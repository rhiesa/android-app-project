import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Haptics from 'expo-haptics';
import { useCalorie } from '../context/CalorieContext';

const FoodLogScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { addFoodEntry } = useCalorie();
  const [calories, setCalories] = useState('');
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  const eatingReasons = [
    { id: 'hungry', label: "I'm hungry and need energy", emoji: '🍽️' },
    { id: 'enjoying', label: "I'm within my range and enjoying something", emoji: '😊' },
    { id: 'bored', label: "I'm bored", emoji: '😐' },
    { id: 'stressed', label: "I'm stressed/emotional", emoji: '😰' },
    { id: 'habit', label: "It's just habit", emoji: '🔄' },
  ];

  const mentalRedirects = [
    "Drink a full glass of water and try again in 5 min. 💧",
    "Spin around 3 times. 🌀",
    "Name 3 things you hear. 👂",
    "Text a friend something kind. 💌",
    "Take 5 deep breaths. 🫁",
    "Do 10 jumping jacks. 🏃",
    "Look out the window for 30 seconds. 👀",
    "Write down one thing you're grateful for. ✍️",
    "Stretch your arms above your head. 🤸",
    "Count backwards from 10 slowly. 🔢",
  ];

  const handleCalorieSubmit = () => {
    if (!calories || isNaN(Number(calories))) {
      Alert.alert('Invalid Input', 'Please enter a valid calorie amount.');
      return;
    }
    
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowReasonModal(true);
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    
    // Check if it's a non-hunger reason
    const nonHungerReasons = ['bored', 'stressed', 'habit'];
    const isNonHunger = nonHungerReasons.includes(reason);
    
    if (isNonHunger) {
      const randomRedirect = mentalRedirects[Math.floor(Math.random() * mentalRedirects.length)];
      Alert.alert(
        'Mindful Pause',
        randomRedirect,
        [
          {
            text: 'I understand',
            onPress: () => {
                    // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowReasonModal(false);
      setCalories('');
      setSelectedReason('');
            },
          },
        ]
      );
    } else {
      // Proceed with logging
      const reasonLabel = eatingReasons.find(r => r.id === reason)?.label || reason;
      addFoodEntry(Number(calories), reasonLabel);
      // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    }
  };

  const handleCancel = () => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Log Food Mindfully</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <View style={[styles.calorieInputContainer, { backgroundColor: '#3b82f6' }]}>
              <Text style={styles.inputLabel}>How many calories?</Text>
              <TextInput
                style={styles.calorieInput}
                value={calories}
                onChangeText={setCalories}
                placeholder="Enter calories"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                autoFocus
                maxLength={6}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCalorieSubmit}
                disabled={!calories}
              >
                <Text style={styles.submitText}>Continue</Text>
              </TouchableOpacity>
            </View>

            {/* Mindful Reminder */}
            <View style={styles.reminderContainer}>
              <Text style={styles.reminderIcon}>🧘</Text>
              <Text style={styles.reminderText}>
                Take a moment to pause and reflect before eating
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Reason Selection Modal */}
        {showReasonModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: '#16213e' }]}>
                <Text style={styles.modalTitle}>Why are you eating?</Text>
                <Text style={styles.modalSubtitle}>
                  This helps build mindful awareness
                </Text>
                
                <ScrollView style={styles.reasonsList}>
                  {eatingReasons.map((reason) => (
                    <TouchableOpacity
                      key={reason.id}
                      style={styles.reasonButton}
                      onPress={() => handleReasonSelect(reason.id)}
                    >
                      <Text style={styles.reasonEmoji}>{reason.emoji}</Text>
                      <Text style={styles.reasonLabel}>{reason.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowReasonModal(false);
                    setCalories('');
                  }}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    flexGrow: 1,
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  calorieInputContainer: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  calorieInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    marginBottom: 16,
    color: '#1a1a2e',
  },
  submitButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  submitText: {
    color: '#1d4ed8',
    fontSize: 16,
    fontWeight: '600',
  },
  reminderContainer: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  reminderIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  reminderText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  reasonsList: {
    maxHeight: 300,
  },
  reasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reasonEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  reasonLabel: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
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

export default FoodLogScreen; 