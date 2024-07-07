import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, query, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { format } from 'date-fns';
import { db, auth } from '../credenciales';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChatScreen = ({ route, navigation }) => {
  const { userId, userName } = route.params;
  const currentUserId = auth.currentUser.uid;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userPhotoURL, setUserPhotoURL] = useState('');

  useEffect(() => {
    const fetchUserPhotoURL = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserPhotoURL(userDoc.data().photoURL);
      }
    };

    fetchUserPhotoURL();

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
      headerTitle: () => (
        <View style={styles.headerContainer}>
          {userPhotoURL ? (
            <Image source={{ uri: userPhotoURL }} style={styles.headerAvatar} />
          ) : null}
          <Text style={styles.headerTitle}>{userName}</Text>
        </View>
      ),
      headerTitleAlign: 'left',
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

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImage(uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storage = getStorage();
      const chatId = getChatId(currentUserId, userId);
      const storageRef = ref(storage, `chats/${chatId}/${Date.now()}`);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed', 
        (snapshot) => {
          console.log(`Progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`);
        }, 
        (error) => {
          console.error('Upload failed:', error);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const messagesCollection = collection(db, 'chats', chatId, 'messages');
          await addDoc(messagesCollection, {
            imageURL: downloadURL,
            createdAt: new Date(),
            senderId: currentUserId,
            receiverId: userId,
          });
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.senderId === currentUserId ? styles.myMessage : styles.theirMessage]}>
      {item.text ? (
        <Text style={styles.messageText}>{item.text}</Text>
      ) : (
        <Image source={{ uri: item.imageURL }} style={styles.messageImage} />
      )}
      <Text style={styles.messageTime}>{format(item.createdAt.toDate(), 'p')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={styles.messagesList}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleImagePick} style={styles.clipButton}>
          <Icon name="attach-file" size={24} color="#d35400" />
        </TouchableOpacity>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messagesList: {
    flex: 1,
  },
  messageContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 15,
    maxWidth: '75%',
  },
  myMessage: {
    backgroundColor: '#d36800',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: '#e5e5ea',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  messageTime: {
    fontSize: 12,
    color: '#fff',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  clipButton: {
    marginRight: 10,
  },
  clipButtonText: {
    fontSize: 24,
    color: '#d36800',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#d36800',
    borderRadius: 20,
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
