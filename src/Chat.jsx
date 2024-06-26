import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import UserSelection from '../components/SeleccionUsuario';
import Chat from '../components/Chat';

const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);

  const handleSelectUser = (user) => {
    const currentUserId = auth.currentUser.uid;
    const chatId = [currentUserId, user.id].sort().join('_'); // Crear un ID de chat único basado en los IDs de los usuarios
    setChatId(chatId);
    setSelectedUser(user);
  };

  return (
    <View style={styles.container}>
      {selectedUser ? (
        <Chat chatId={chatId} />
      ) : (
        <UserSelection onSelectUser={handleSelectUser} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatApp;
