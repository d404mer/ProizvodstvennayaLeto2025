import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import uuid from 'react-native-uuid';
import { Task } from '../types';
import { colors } from '../theme/colors';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import { useTaskStorage } from '../hooks/useTaskStorage';

const TaskListScreen: React.FC = () => {
  const { tasks, setTasks, loading } = useTaskStorage();
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleOpenModal = (task?: Task) => {
    setTaskToEdit(task || null);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTaskToEdit(null);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id'> | Task) => {
    console.log('Submitting task:', taskData);
    if ('id' in taskData) {
      setTasks(tasks.map((t) => (t.id === taskData.id ? JSON.parse(JSON.stringify(taskData)) : t)));
    } else {
      const newTask: Task = {
        id: uuid.v4() as string,
        ...(taskData as Omit<Task, 'id'>),
      };
      setTasks([...tasks, newTask]);
    }
    handleCloseModal();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ALL</Text>
      </View>
      <FlatList
        data={tasks}
        extraData={tasks}
        renderItem={({ item }) => (
          <TaskItem item={item} onPress={() => handleOpenModal(item)} />
        )}
        keyExtractor={(item) => {
          console.log('FlatList key:', item.id);
          return item.id;
        }}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => handleOpenModal()}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <TaskModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSubmit={handleTaskSubmit}
        taskToEdit={taskToEdit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.progressBarBackground,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: 'white',
    fontWeight: '300',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskListScreen; 