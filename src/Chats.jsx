import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { collection, getDocs, query, where, orderBy, limit, startAt, endAt } from 'firebase/firestore';
import { db, auth } from '../credenciales';

const UsersList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsersAndChats = async () => {
      const currentUserId = auth.currentUser.uid;

      // Fetch chats where current user is involved
      const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', currentUserId));
      const chatsSnapshot = await getDocs(chatsQuery);

      // Collect last message for each chat
      const userLastMessages = {};
      for (const chatDoc of chatsSnapshot.docs) {
        const chatId = chatDoc.id;
        const lastMessage = await getLastMessage(chatId);
        const otherUserId = lastMessage.senderId === currentUserId ? lastMessage.receiverId : lastMessage.senderId;
        userLastMessages[otherUserId] = lastMessage.text;
      }

      // Fetch users based on search query
      let userList = [];
      if (searchQuery.trim() !== '') {
        const usersCollection = collection(db, 'users');
        const userQuery = query(
          usersCollection,
          orderBy('name'),
          startAt(searchQuery.trim()),
          endAt(searchQuery.trim() + '\uf8ff')
        );
        const userSnapshot = await getDocs(userQuery);
        userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastMessage: userLastMessages[doc.id] || ''
        }));
      } else {
        // Fetch users that have chatted with the current user
        const userIds = Object.keys(userLastMessages);
        if (userIds.length > 0) {
          const usersCollection = collection(db, 'users');
          const userQuery = query(usersCollection, where('uid', 'in', userIds));
          const userSnapshot = await getDocs(userQuery);
          userList = userSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            lastMessage: userLastMessages[doc.id] || ''
          }));
        }
      }

      setUsers(userList);
    };

    fetchUsersAndChats();
  }, [searchQuery]);

  const getLastMessage = async (chatId) => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const messagesQuery = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const messagesSnapshot = await getDocs(messagesQuery);
    if (!messagesSnapshot.empty) {
      return messagesSnapshot.docs[0].data();
    } else {
      return { text: '', senderId: '', receiverId: '' };
    }
  };

  const handleUserPress = (user) => {
    navigation.navigate('Chat', { userId: user.id, userName: user.name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chats</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar usuarios"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserPress(item)}>
            <View style={styles.userItem}>
              <Image
                style={styles.avatar}
                source={{ uri: item.photoURL || 'https://via.placeholder.com/50' }}
              />
              <View>
                <Text style={styles.userName}>{item.name}</Text>
                {item.lastMessage ? (
                  <Text style={styles.lastMessage}>{item.lastMessage}</Text>
                ) : (
                  <Text style={styles.noMessage}>No hay mensajes</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
  },
  lastMessage: {
    fontSize: 14,
    color: 'gray',
  },
  noMessage: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'gray',
  },
});

export default UsersList;
