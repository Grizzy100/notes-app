import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateNoteScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please enter a title and content');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      title,
      content,
    };

    try {
      const existingNotes = await AsyncStorage.getItem('notes');
      const notesArray = existingNotes ? JSON.parse(existingNotes) : [];
      notesArray.unshift(newNote);
      await AsyncStorage.setItem('notes', JSON.stringify(notesArray));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save note', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Create Note</Text>
        <TextInput
          style={styles.inputTitle}
          placeholder="Note Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.inputContent}
          placeholder="Write your note here..."
          multiline
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ACCENT = '#6C63FF';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Platform.OS === 'web' ? '#f5f6fa' : '#f5f6fa',
  },
  card: {
    width: 370,
    padding: 28,
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ACCENT,
    marginBottom: 18,
    letterSpacing: 1,
  },
  inputTitle: {
    width: '100%',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#fafbfc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#222',
  },
  inputContent: {
    width: '100%',
    minHeight: 120,
    fontSize: 16,
    padding: 12,
    backgroundColor: '#fafbfc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 22,
    color: '#222',
  },
  button: {
    width: '100%',
    backgroundColor: ACCENT,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: ACCENT,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});