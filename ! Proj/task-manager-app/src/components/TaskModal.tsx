import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import uuid from 'react-native-uuid';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task, SubTask } from '../types';
import { colors } from '../theme/colors';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'> | Task) => void;
  taskToEdit: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onClose,
  onSubmit,
  taskToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [newSubTask, setNewSubTask] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(new Date(taskToEdit.dueDate));
      setSubTasks(taskToEdit.subTasks || []);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(new Date());
      setSubTasks([]);
    }
  }, [taskToEdit]);

  const handleSubmit = () => {
    const taskData = {
      title,
      description,
      dueDate,
      subTasks,
    };

    if (taskToEdit) {
      onSubmit({ ...taskData, id: taskToEdit.id });
    } else {
      onSubmit(taskData);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  const addSubTask = () => {
    if (newSubTask.trim() === '') return;
    setSubTasks([
      ...subTasks,
      { id: uuid.v4() as string, title: newSubTask, completed: false },
    ]);
    setNewSubTask('');
  };

  const toggleSubTask = (id: string) => {
    setSubTasks(
      subTasks.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st
      )
    );
  };

  const removeSubTask = (id: string) => {
    setSubTasks(subTasks.filter((st) => st.id !== id));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <Text style={styles.modalTitle}>
              {taskToEdit ? 'Edit Task' : 'New Task'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Task Name"
              placeholderTextColor={colors.secondary}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor={colors.secondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                Due: {dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <Text style={styles.subTaskTitle}>Sub-tasks</Text>
            <View style={styles.subTaskInputContainer}>
              <TextInput
                style={styles.subTaskInput}
                placeholder="Add a new sub-task..."
                placeholderTextColor={colors.secondary}
                value={newSubTask}
                onChangeText={setNewSubTask}
                onSubmitEditing={addSubTask}
              />
              <TouchableOpacity style={styles.addButton} onPress={addSubTask}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            {subTasks.map((sub) => (
              <View key={sub.id} style={styles.subTaskItem}>
                <TouchableOpacity
                  style={[styles.checkbox, sub.completed && styles.checkedCheckbox]}
                  onPress={() => toggleSubTask(sub.id)}
                >
                  {sub.completed && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <TextInput
                  style={[
                    styles.subTaskText,
                    {
                      textDecorationLine: sub.completed
                        ? 'line-through'
                        : 'none',
                      color: sub.completed ? colors.secondary : colors.text,
                    },
                  ]}
                  value={sub.title}
                  onChangeText={(text) => {
                    const newSubTasks = subTasks.map(s => s.id === sub.id ? {...s, title: text} : s)
                    setSubTasks(newSubTasks);
                  }}
                  editable={!sub.completed}
                />
                <TouchableOpacity onPress={() => removeSubTask(sub.id)}>
                  <Text style={styles.subTaskDelete}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{taskToEdit ? 'Save' : 'Create'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '95%',
    height: '85%',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: colors.text,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  datePickerButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  datePickerText: {
    color: colors.accent,
    fontSize: 16,
  },
  subTaskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subTaskInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  subTaskInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: colors.text,
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  subTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.accent,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: colors.accent,
  },
  checkmark: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTaskText: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  subTaskDelete: {
    color: '#ff4d4d',
    fontSize: 24,
    marginLeft: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.accent,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#4f4f4f',
    marginRight: 10,
  }
});

export default TaskModal; 