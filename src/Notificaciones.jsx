import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const notificationsData = [
  { id: '1', user: 'Usuario1', action: 'Le ha gustado tu anuncio', read: false },
  { id: '2', user: 'Usuario2', action: 'Comentó tu anuncio', read: false },
  { id: '3', user: 'Usuario3', action: 'Compartió tu anuncio', read: true },
  { id: '4', user: 'Usuario4', action: 'Le ha gustado tu anuncio', read: true },
  { id: '6', user: 'Usuario6', action: 'Comenzó a seguirte', read: false },
];

const Notificaciones = ({ visible, onClose }) => {
  const [notifications, setNotifications] = useState(notificationsData);

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(item =>
      item.id === id ? { ...item, read: true } : item
    );
    setNotifications(updatedNotifications);
  };

  const handleNotificationPress = (id) => {
    markAsRead(id);
  };

  return (
    <View style={[styles.modalContainer, visible ? styles.visible : styles.hidden]}>
      <View style={styles.modalContent}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Notificaciones</Text>
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.notification, item.read ? styles.readNotification : styles.unreadNotification]}
              onPress={() => handleNotificationPress(item.id)}
            >
              {!item.read && <View style={styles.notificationIndicator} />}
              <Text style={styles.notificationText}>
                <Text style={styles.userName}>{item.user}</Text> {item.action}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  visible: {
    display: 'flex',
  },
  hidden: {
    display: 'none',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  unreadNotification: {
    backgroundColor: '#fef6f6', // Color de fondo para notificaciones no leídas
  },
  readNotification: {
    backgroundColor: 'white',
  },
  notificationIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'tomato', // Color del indicador para notificaciones no leídas
    marginRight: 10,
  },
  notificationText: {
    fontSize: 16,
  },
  userName: {
    fontWeight: 'bold',
  },
});

export default Notificaciones;