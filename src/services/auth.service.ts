import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  sendEmailVerification,
  updateProfile,  // ✅ Adicionar esta importação
  User 
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const authService = {
  // Cadastro com envio de e-mail de verificação
  async register(email: string, password: string, name: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // ✅ Usar a função updateProfile importada
    await updateProfile(userCredential.user, { displayName: name });
    
    // Enviar e-mail de confirmação
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  },

  // Login com E-mail e Senha
  async loginWithEmail(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  // Login com Google
  async loginWithGoogle() {
    return await signInWithPopup(auth, googleProvider);
  },

  // Login com GitHub
  async loginWithGithub() {
    return await signInWithPopup(auth, githubProvider);
  },

  // Logout
  async logout() {
    return await auth.signOut();
  },

  // Obter usuário atual
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};