import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { collection, getDocs, query, where, orderBy, startAt, endAt } from 'firebase/firestore';
import { db, auth } from '../credenciales';

const UsersList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const currentUserId = auth.currentUser.uid;

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
          ...doc.data()
        }));
      } else {
        const userQuery = query(collection(db, 'users'));
        const userSnapshot = await getDocs(userQuery);
        userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      setUsers(userList);
    };

    fetchUsers();
  }, [searchQuery]);

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
              <Text style={styles.userName}>{item.name}</Text>
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
});

export default UsersList;
