import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../credenciales';

const ChatScreen = ({ route, navigation }) => {
  const { userId, userName } = route.params;
  const currentUserId = auth.currentUser.uid;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const chatId = getChatId(currentUserId, userId);
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesCollection, orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    navigation.setOptions({
      headerTitle: userName,
      headerTitleAlign: 'center'
    });

    return () => unsubscribe();
  }, [userId]);

  const getChatId = (id1, id2) => {
    return id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
  };

  const handleSend = async () => {
    if (message.length > 0) {
      const chatId = getChatId(currentUserId, userId);
      const messagesCollection = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesCollection, {
        text: message,
        createdAt: new Date(),
        senderId: currentUserId,
        receiverId: userId,
      });
      setMessage('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.senderId === currentUserId ? styles.myMessage : styles.theirMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder={`Pulsa para chatear con ${userName}`}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    flex: 1,
  },
  messageContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  myMessage: {
    backgroundColor: '#d35400',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#e5e5ea',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#d35400',
    borderRadius: 20,
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;