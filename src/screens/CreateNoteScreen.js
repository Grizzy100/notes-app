import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
      notesArray.unshift(newNote); // add to top
      
      await AsyncStorage.setItem('notes', JSON.stringify(notesArray));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save note', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputTitle}
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.inputContent}
        placeholder="Write your note here..."
        multiline
        value={content}
        onChangeText={setContent}
        textAlignVertical="top"
      />
      <Button title="Save Note" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  inputTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, padding: 10, backgroundColor: '#fff', borderRadius: 5 },
  inputContent: { flex: 1, fontSize: 16, padding: 10, backgroundColor: '#fff', borderRadius: 5, marginBottom: 20 }
});