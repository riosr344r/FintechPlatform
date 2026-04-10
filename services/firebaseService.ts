
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { User, Course, Notification, StudyTask } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile
export const syncUserProfile = async (user: User) => {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getUserProfile = async (userId: string) => {
  const path = `users/${userId}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.exists() ? docSnap.data() as User : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

// Courses
export const getCourses = async () => {
  const path = 'courses';
  try {
    const querySnapshot = await getDocs(collection(db, path));
    return querySnapshot.docs.map(doc => doc.data() as Course);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const seedCourses = async (courses: Course[]) => {
  const path = 'courses';
  try {
    for (const course of courses) {
      // We need to handle the icon property which is a React component
      // Firestore doesn't store components, so we'll store the ID/Name and map it back
      const { icon, ...courseData } = course;
      await setDoc(doc(db, 'courses', course.id), {
        ...courseData,
        iconName: course.iconName || 'IconBook'
      }, { merge: true });
    }
  } catch (error: any) {
    if (error?.code === 'permission-denied' || (error instanceof Error && error.message.includes('Missing or insufficient permissions'))) {
      console.warn("Skipping course seeding: User does not have admin permissions.");
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteCourse = async (courseId: string) => {
  const path = `courses/${courseId}`;
  try {
    await deleteDoc(doc(db, 'courses', courseId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// Real-time listeners
export const subscribeToCourses = (academicYear: 'third' | 'fourth', callback: (courses: Course[]) => void) => {
  const path = 'courses';
  const q = query(collection(db, path), where('academicYear', '==', academicYear));
  return onSnapshot(q, (snapshot) => {
    const courses = snapshot.docs.map(doc => doc.data() as Course);
    callback(courses);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const subscribeToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  const path = `users/${userId}/notifications`;
  const q = query(collection(db, path));
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => doc.data() as Notification);
    callback(notifications);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const subscribeToStudyTasks = (userId: string, callback: (tasks: StudyTask[]) => void) => {
  const path = `users/${userId}/studyTasks`;
  const q = query(collection(db, path));
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => doc.data() as StudyTask);
    callback(tasks);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};
