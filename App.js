import React, { useState, useEffect } from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import NotesScreen from './src/screens/NotesScreen';
import CreateNoteScreen from './src/screens/CreateNoteScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Check for existing token
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.error('Failed to fetch token', e);
      }
    };
    checkToken();
  }, []);

  const handleLogin = async (username) => {
    await AsyncStorage.setItem('userToken', username);
    setUserToken(username);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken == null ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen 
              name="Notes" 
              options={{ 
                title: 'My Notes',
                headerRight: () => (
                  <Button onPress={handleLogout} title="Logout" color="#ff3b30" />
                ),
              }}>
              {(props) => <NotesScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen
              name="CreateNote"
              component={CreateNoteScreen}
              options={{ title: 'New Note' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
