import React, { useState } from 'react';
import { View, TextInput, Text, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import axios from 'axios';

const ChatScreen = () => {
  const [messages, setMessages] = useState([{ text: "Please input what cuisine you are searching for and/or provide a location to search for stores.", sender: 'ai' }]);
  const [input, setInput] = useState('');

  const extractInfoFromInput = (input) => {
    const cuisineMatch = input.match(/(Chinese|Western|Japanese|Indian|Korean|Halal|Pastries|Greens)/i);
    const locationMatch = input.match(/near (\w+)/i);

    const cuisine = cuisineMatch ? cuisineMatch[1] : null;
    const location = locationMatch ? locationMatch[1] : null;

    return { cuisine, location };
  };

  const sendMessage = async () => {
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const { cuisine, location } = extractInfoFromInput(input);

      if (!cuisine && !location) {
        const aiMessage = { text: "I couldn't understand your request. Please specify either the cuisine or location, or both.", sender: 'ai' };
        setMessages([...messages, userMessage, aiMessage]);
        return;
      }

      const firestore = getFirestore();
      const storesRef = collection(firestore, 'Stores');

      let q;
      if (cuisine && location) {
        q = query(storesRef, where('category', '==', cuisine), where('location', '==', location));
      } else if (cuisine) {
        q = query(storesRef, where('category', '==', cuisine));
      } else if (location) {
        q = query(storesRef, where('location', '==', location));
      }

      const querySnapshot = await getDocs(q);
      const restaurantNames = querySnapshot.docs.map(doc => doc.data().name).join(', ');

      const requestBody = {
        model: 'gpt-3.5-turbo-instruct', // Use a valid model name
        prompt: `User: ${input}\nAI: Based on your request for ${cuisine ? cuisine : 'any'} food near ${location ? location : 'any location'}, here are some good places: ${restaurantNames}`,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.9,
      };

      console.log('Request Body:', requestBody);

      const response = await axios.post('https://api.openai.com/v1/completions', requestBody, {
        headers: {
          'Authorization': `Bearer sk-proj-E1H04XpljCN6Yp6ErfjCT3BlbkFJlEzDWHNRjMzQsHJPTlNj`,
          'Content-Type': 'application/json'
        }
      });

      const aiMessage = { text: response.data.choices[0].text.trim(), sender: 'ai' };
      setMessages([...messages, userMessage, aiMessage]);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      const aiMessage = { text: "There was an error processing your request. Please try again later.", sender: 'ai' };
      setMessages([...messages, userMessage, aiMessage]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90} // Adjust this value as needed
    >
      <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingBottom: 60 }}>
        {messages.map((message, index) => (
          <Text key={index} style={message.sender === 'user' ? styles.userMessage : styles.aiMessage}>
            {message.text}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, // Shift down the chat screen slightly
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 5,
    marginVertical: 2,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    padding: 10,
    borderRadius: 5,
    marginVertical: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#2c5f2d',
    borderRadius: 5,
    padding: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;