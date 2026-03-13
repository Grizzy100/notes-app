import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const COLORS = [
  '#6C63FF', '#FF6584', '#43E97B', '#FFD86E', '#6EE2FF', '#FFB86E', '#FF6E97', '#A66CFF', '#FF6E6E', '#6EFFB8'
];

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [fabAnim] = useState(new Animated.Value(0));

  const fetchNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Failed to fetch notes', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
      Animated.loop(
        Animated.sequence([
          Animated.timing(fabAnim, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(fabAnim, { toValue: 0, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) })
        ])
      ).start();
    }, [])
  );

  const renderNote = ({ item, index }) => (
    <View style={[styles.noteCard, { borderLeftColor: COLORS[index % COLORS.length], borderLeftWidth: 7 }]}> 
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <Text style={styles.noteIcon}>🗒️</Text>
        <Text style={styles.noteTitle}>{item.title}</Text>
      </View>
      <Text style={styles.noteContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Notes</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes yet. Click + to create one!</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <Animated.View style={[styles.fabWrap, { transform: [{ scale: fabAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.13] }) }] }] }>
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('CreateNote')}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const ACCENT = '#6C63FF';
const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, backgroundColor: Platform.OS === 'web' ? '#f5f6fa' : '#f5f6fa' },
  header: { fontSize: 28, fontWeight: 'bold', color: ACCENT, marginTop: 32, marginBottom: 18, textAlign: 'center', letterSpacing: 1 },
  noteCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 18,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    borderLeftColor: ACCENT,
    borderLeftWidth: 7,
  },
  noteIcon: { fontSize: 22, marginRight: 10 },
  noteTitle: { fontSize: 20, fontWeight: 'bold', color: ACCENT, flex: 1 },
  noteContent: { fontSize: 15, color: '#333', marginLeft: 2 },
  emptyText: { textAlign: 'center', marginTop: 60, color: '#bbb', fontSize: 17 },
  fabWrap: {
    position: 'absolute',
    right: 32,
    bottom: 38,
    shadowColor: ACCENT,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fab: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: {
    fontSize: 30,
    color: '#fff',
    lineHeight: 32, // Centers the '+' vertically depending on the font
  }
});