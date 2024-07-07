import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { collection, getDocs, query, orderBy, startAt, endAt } from 'firebase/firestore';
import { db, auth } from '../credenciales';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuarios"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
      </View>
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
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
  },
  separator: {
    height: 10,
  },
});

export default UsersList;
