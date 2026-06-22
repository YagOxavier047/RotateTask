import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: string;
  department?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ROLES = [
  { value: "developer", label: "Desenvolvedor(a)", icon: "💻" },
  { value: "designer", label: "Designer", icon: "🎨" },
  { value: "manager", label: "Gerente de Projeto", icon: "📊" },
  { value: "product", label: "Product Owner", icon: "🎯" },
  { value: "qa", label: "QA / Tester", icon: "🧪" },
  { value: "devops", label: "DevOps", icon: "⚙️" },
  { value: "scrum", label: "Scrum Master", icon: "🏃" },
  { value: "analyst", label: "Analista", icon: "📈" },
  { value: "intern", label: "Estagiário(a)", icon: "🎓" },
  { value: "other", label: "Outro", icon: "👤" },
];

export const profileService = {
  ROLES,

  async getOrCreateProfile(uid: string, data: {
    displayName?: string;
    email?: string;
    photoURL?: string;
  }): Promise<UserProfile> {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const newProfile: UserProfile = {
        uid,
        displayName: data.displayName || "Usuário",
        email: data.email || "",
        photoURL: data.photoURL,
        role: "developer",
        department: "",
        bio: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(docRef, {
        ...newProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return newProfile;
    }

    const data2 = docSnap.data();
    return {
      uid,
      displayName: data2.displayName || data.displayName || "Usuário",
      email: data2.email || data.email || "",
      photoURL: data2.photoURL || data.photoURL,
      role: data2.role || "developer",
      department: data2.department || "",
      bio: data2.bio || "",
      createdAt: data2.createdAt?.toDate() || new Date(),
      updatedAt: data2.updatedAt?.toDate() || new Date(),
    };
  },

  async updateProfile(
    uid: string,
    data: Partial<{
      displayName: string;
      role: string;
      department: string;
      bio: string;
    }>
  ): Promise<void> {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  getRoleLabel(role: string): { label: string; icon: string } {
    const found = ROLES.find((r) => r.value === role);
    return found || { label: "Usuário", icon: "👤" };
  },
};