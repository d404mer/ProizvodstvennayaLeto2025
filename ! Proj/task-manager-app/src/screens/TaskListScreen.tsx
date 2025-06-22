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
  Alert,
} from 'react-native';
import uuid from 'react-native-uuid';
import { Task, calculateAverageProgress } from '../types';
import { colors } from '../theme/colors';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import { useTaskStorage } from '../hooks/useTaskStorage';
import * as FileSystem from 'expo-file-system';

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

  const handleTaskSubmit = (taskData: Task) => {
    console.log('Submitting task:', taskData);
    setTasks(prevTasks => {
      const exists = prevTasks.some((t) => t.id === taskData.id);
      if (exists) {
        return prevTasks.map((t) => (t.id === taskData.id ? { ...taskData } : t));
      } else {
        return [...prevTasks, taskData];
      }
    });
    handleCloseModal();
  };

  const exportTasksToCSV = async (tasks: Task[]) => {
    if (!tasks.length) {
      Alert.alert('Нет задач для экспорта');
      return;
    }
    // Формируем CSV-строку
    const header = 'ID,Title,Description,DueDate,SubTasks\n';
    const rows = tasks.map(task => {
      const subTasksStr = task.subTasks.map(st => `${st.title} [${st.completed ? '✓' : ' '}]`).join('; ');
      return `"${task.id}","${task.title.replace(/"/g, '""')}","${task.description.replace(/"/g, '""')}","${task.dueDate.toISOString()}","${subTasksStr.replace(/"/g, '""')}"`;
    });
    const csv = header + rows.join('\n');

    // Путь для сохранения
    const fileUri = FileSystem.documentDirectory + 'tasks_export.csv';
    try {
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
      Alert.alert('Экспорт завершён', `Файл сохранён: ${fileUri}`);
    } catch (e) {
      Alert.alert('Ошибка экспорта', String(e));
    }
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
        <Text style={styles.headerTitle}>ВСЕ ЗАДАЧИ</Text>
        <TouchableOpacity onPress={() => exportTasksToCSV(tasks)} style={{ marginLeft: 16, padding: 8, backgroundColor: colors.accent, borderRadius: 8 }}>
          <Text style={{ color: 'black', fontWeight: 'bold' }}>Экспорт CSV</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.avgProgressContainer}>
        <Text style={styles.avgProgressLabel}>Средний прогресс:</Text>
        <View style={styles.avgProgressBarBg}>
          <View style={[styles.avgProgressBar, { width: `${calculateAverageProgress(tasks)}%` }]} />
        </View>
        <Text style={styles.avgProgressValue}>{calculateAverageProgress(tasks)}%</Text>
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
  avgProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'black',
  },
  avgProgressLabel: {
    color: colors.text,
    fontSize: 16,
    marginRight: 10,
  },
  avgProgressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.progressBarBackground,
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  avgProgressBar: {
    height: 8,
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  avgProgressValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
});

export default TaskListScreen; 