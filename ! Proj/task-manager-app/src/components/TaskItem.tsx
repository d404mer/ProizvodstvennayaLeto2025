import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types';
import { colors } from '../theme/colors';

interface TaskItemProps {
  item: Task;
  onPress: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ item, onPress }) => {
  const completedSubtasks = item.subTasks.filter((s) => s.completed).length;
  const totalSubtasks = item.subTasks.length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  let formattedDate = 'Без даты';
  if (item.dueDate) {
    const dateObj = new Date(item.dueDate);
    if (!isNaN(dateObj.getTime())) {
      formattedDate = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
      }).format(dateObj);
    }
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.accentBar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground} />
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.description}>
          {item.description} | {formattedDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: 'black',
  },
  accentBar: {
    width: 4,
    backgroundColor: colors.accent,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  progressText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.progressBarBackground,
    borderRadius: 2,
    marginBottom: 8,
    justifyContent: 'center',
  },
  progressBarBackground: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: colors.progressBarBackground,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  description: {
    color: colors.secondary,
    fontSize: 14,
    fontFamily: 'monospace',
  },
});

export default TaskItem; 