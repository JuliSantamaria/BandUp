import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../credenciales';

const ChatScreen = ({ route }) => {
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

  return (
    <View>
      <Text>Chat with {userName}</Text>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.senderId === currentUserId ? 'You' : userName}: {item.text}</Text>
          </View>
        )}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

export default ChatScreen;
