import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, User } from '../firebase';
import { Task, TaskCategory, TaskPriority } from '../types';

export async function syncUserProfile(user: User): Promise<void> {
  const userPath = `users/${user.uid}`;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userDocRef);
    if (!existing.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Google User',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(userDocRef, {
        displayName: user.displayName || 'Google User',
        photoURL: user.photoURL || '',
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

export function subscribeToUserTasks(
  userId: string,
  onTasks: (tasks: Task[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const collectionPath = `users/${userId}/tasks`;
  const tasksRef = collection(db, 'users', userId, 'tasks');
  const q = query(tasksRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title,
          description: data.description || '',
          completed: Boolean(data.completed),
          priority: data.priority || 'medium',
          category: data.category || 'general',
          dueDate: data.dueDate || '',
          userId: data.userId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as Task;
      });
      onTasks(tasks);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, collectionPath);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function createTask(
  userId: string,
  payload: {
    title: string;
    description?: string;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string;
  }
): Promise<string> {
  const collectionRef = collection(db, 'users', userId, 'tasks');
  const newDocRef = doc(collectionRef);
  const taskId = newDocRef.id;
  const taskPath = `users/${userId}/tasks/${taskId}`;

  const taskData = {
    id: taskId,
    title: payload.title.trim().slice(0, 200),
    description: (payload.description || '').trim().slice(0, 2000),
    completed: false,
    priority: payload.priority,
    category: payload.category,
    dueDate: payload.dueDate || '',
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(newDocRef, taskData);
    return taskId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, taskPath);
  }
}

export async function toggleTaskCompletion(
  userId: string,
  taskId: string,
  newCompletedStatus: boolean
): Promise<void> {
  const taskPath = `users/${userId}/tasks/${taskId}`;
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);

  try {
    await updateDoc(taskRef, {
      completed: newCompletedStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, taskPath);
  }
}

export async function updateTaskDetails(
  userId: string,
  taskId: string,
  updates: {
    title: string;
    description?: string;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string;
    completed?: boolean;
  }
): Promise<void> {
  const taskPath = `users/${userId}/tasks/${taskId}`;
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);

  const payload: Record<string, unknown> = {
    title: updates.title.trim().slice(0, 200),
    description: (updates.description || '').trim().slice(0, 2000),
    priority: updates.priority,
    category: updates.category,
    dueDate: updates.dueDate || '',
    updatedAt: serverTimestamp(),
  };

  if (typeof updates.completed === 'boolean') {
    payload.completed = updates.completed;
  }

  try {
    await updateDoc(taskRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, taskPath);
  }
}

export async function deleteTaskItem(
  userId: string,
  taskId: string
): Promise<void> {
  const taskPath = `users/${userId}/tasks/${taskId}`;
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);

  try {
    await deleteDoc(taskRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, taskPath);
  }
}

export async function batchDeleteTasks(
  userId: string,
  taskIds: string[]
): Promise<void> {
  const batch = writeBatch(db);
  for (const id of taskIds) {
    const ref = doc(db, 'users', userId, 'tasks', id);
    batch.delete(ref);
  }
  const collectionPath = `users/${userId}/tasks`;
  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, collectionPath);
  }
}
