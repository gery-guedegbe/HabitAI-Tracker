/**
 * Hooks d'Authentification avec React Query
 * ==========================================
 *
 * POURQUOI React Query ?
 * ----------------------
 * React Query (TanStack Query) simplifie la gestion des requêtes asynchrones :
 * 1. Cache automatique des données
 * 2. Gestion du loading/error states
 * 3. Refetch automatique
 * 4. Optimistic updates
 * 5. Gestion des mutations (POST, PUT, DELETE)
 *
 * SANS React Query :
 * ```tsx
 * const [isLoading, setIsLoading] = useState(false);
 * const [error, setError] = useState(null);
 *
 * const handleLogin = async () => {
 *   setIsLoading(true);
 *   setError(null);
 *   try {
 *     const result = await login(data);
 *     // Gérer le succès...
 *   } catch (err) {
 *     setError(err);
 *   } finally {
 *     setIsLoading(false);
 *   }
 * };
 * ```
 *
 * AVEC React Query :
 * ```tsx
 * const { mutate, isLoading, error } = useLogin();
 *
 * const handleLogin = () => {
 *   mutate(data, {
 *     onSuccess: (result) => {
 *       // Gérer le succès...
 *     }
 *   });
 * };
 * ```
 *
 * UTILISATION :
 * -------------
 * import { useLogin, useRegister } from '@/lib/auth/hooks';
 *
 * function LoginPage() {
 *   const { mutate: login, isLoading, error } = useLogin();
 *
 *   const handleSubmit = (data) => {
 *     login(data, {
 *       onSuccess: () => {
 *         router.push('/dashboard');
 *       }
 *     });
 *   };
 * }
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  login,
  register,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
  type LoginData,
  type RegisterData,
  type ChangePasswordData,
  type ForgotPasswordData,
  type ResetPasswordData,
} from "../api/auth";
import { useAuth } from "./context";

// ============= HOOK LOGIN =============

/**
 * Hook pour la connexion
 *
 * Ce hook utilise React Query pour gérer la mutation de login.
 * Il met automatiquement à jour le context d'authentification
 * après un login réussi.
 *
 * RETOURNE :
 * - mutate: Fonction pour déclencher le login
 * - isLoading: État de chargement
 * - error: Erreur éventuelle
 * - isSuccess: Indique si le login a réussi
 *
 * EXEMPLE :
 * ```tsx
 * function LoginPage() {
 *   const router = useRouter();
 *   const { mutate: loginUser, isLoading, error } = useLogin();
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     loginUser(
 *       { email: 'user@example.com', password: 'pass' },
 *       {
 *         onSuccess: () => {
 *           router.push('/dashboard');
 *         },
 *         onError: (error) => {
 *           console.error('Erreur:', error.message);
 *         }
 *       }
 *     );
 *   };
 * }
 * ```
 */
export function useLogin() {
  const router = useRouter();
  const { login: setUser } = useAuth();

  return useMutation({
    // Fonction qui fait la requête
    mutationFn: (data: LoginData) => login(data),

    // Callback en cas de succès
    onSuccess: (response) => {
      // Mettre à jour le context avec les infos utilisateur
      setUser(response.user);

      // Rediriger selon le rôle de l'utilisateur
      if (response.user.role === "admin") {
        // Admin → Interface admin
        router.push("/app/admin");
      } else {
        // User normal → Dashboard
        router.push("/app/dashboard");
      }
    },

    // Callback en cas d'erreur (optionnel)
    // L'erreur est déjà gérée par le client API
    onError: (error: Error) => {
      // On peut ajouter des logs ou notifications ici
      console.error("Erreur de connexion:", error);
    },
  });
}

// ============= HOOK REGISTER =============

/**
 * Hook pour l'inscription
 *
 * Similaire à useLogin, mais pour l'inscription.
 * Après une inscription réussie, on redirige vers la page de login
 * (ou on peut directement connecter l'utilisateur si le backend le permet).
 *
 * EXEMPLE :
 * ```tsx
 * function RegisterPage() {
 *   const router = useRouter();
 *   const { mutate: registerUser, isLoading, error } = useRegister();
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     registerUser(
 *       { username: 'john', email: 'john@example.com', password: 'pass' },
 *       {
 *         onSuccess: () => {
 *           // Rediriger vers login ou directement connecter
 *           router.push('/login');
 *         }
 *       }
 *     );
 *   };
 * }
 * ```
 */
export function useRegister() {
  const router = useRouter();

  return useMutation({
    // Fonction qui fait la requête
    mutationFn: (data: RegisterData) => register(data),

    // Callback en cas de succès
    onSuccess: () => {
      // Après inscription, rediriger vers login
      // L'utilisateur devra se connecter avec ses identifiants
      router.push("/login");
    },

    // Callback en cas d'erreur
    onError: (error: Error) => {
      console.error("Erreur d'inscription:", error);
    },
  });
}

/**
 * NOTE IMPORTANTE :
 * -----------------
 * Si votre backend retourne un token après l'inscription
 * (comme certains systèmes le font), vous pouvez modifier
 * useRegister pour connecter automatiquement l'utilisateur :
 *
 * ```ts
 * export function useRegister() {
 *   const router = useRouter();
 *   const { login: setUser } = useAuth();
 *
 *   return useMutation({
 *     mutationFn: (data: RegisterData) => register(data),
 *     onSuccess: (response) => {
 *       // Si le backend retourne un token
 *       if (response.token) {
 *         setUser(response.user);
 *         router.push("/app/dashboard");
 *       } else {
 *         router.push("/login");
 *       }
 *     },
 *   });
 * }
 * ```
 */

// ============= HOOK CHANGE PASSWORD =============

/**
 * Hook pour changer le mot de passe
 *
 * Ce hook utilise React Query pour gérer la mutation de changement de mot de passe.
 * Il nécessite que l'utilisateur soit authentifié (le token est automatiquement
 * ajouté par le client API).
 *
 * RETOURNE :
 * - mutate: Fonction pour déclencher le changement de mot de passe
 * - isPending: État de chargement
 * - error: Erreur éventuelle
 * - isSuccess: Indique si le changement a réussi
 *
 * EXEMPLE :
 * ```tsx
 * function ChangePasswordPage() {
 *   const { mutate: changePassword, isPending, error } = useChangePassword();
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     changePassword(
 *       {
 *         oldPassword: 'ancienMotDePasse',
 *         newPassword: 'nouveauMotDePasse123'
 *       },
 *       {
 *         onSuccess: () => {
 *           alert('Mot de passe changé avec succès !');
 *         },
 *         onError: (error) => {
 *           console.error('Erreur:', error.message);
 *         }
 *       }
 *     );
 *   };
 * }
 * ```
 */
export function useChangePassword() {
  return useMutation({
    // Fonction qui fait la requête
    mutationFn: (data: ChangePasswordData) => changePassword(data),

    // Callback en cas d'erreur
    onError: (error: Error) => {
      console.error("Erreur de changement de mot de passe:", error);
    },
  });
}

// ============= HOOK FORGOT PASSWORD =============

/**
 * Hook pour demander la réinitialisation du mot de passe
 *
 * Ce hook envoie un email avec un lien de réinitialisation.
 *
 * RETOURNE :
 * - mutate: Fonction pour déclencher l'envoi de l'email
 * - isPending: État de chargement
 * - error: Erreur éventuelle
 * - isSuccess: Indique si l'email a été envoyé
 *
 * EXEMPLE :
 * ```tsx
 * function ForgotPasswordPage() {
 *   const { mutate: sendResetEmail, isPending } = useForgotPassword();
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     sendResetEmail(
 *       { email: 'user@example.com' },
 *       {
 *         onSuccess: () => {
 *           alert('Email envoyé !');
 *         }
 *       }
 *     );
 *   };
 * }
 * ```
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => forgotPassword(data),
    onError: (error: Error) => {
      console.error("Erreur d'envoi d'email:", error);
    },
  });
}

// ============= HOOK RESET PASSWORD =============

/**
 * Hook pour réinitialiser le mot de passe avec un token
 *
 * Ce hook réinitialise le mot de passe après que l'utilisateur
 * ait cliqué sur le lien dans l'email.
 *
 * RETOURNE :
 * - mutate: Fonction pour réinitialiser le mot de passe
 * - isPending: État de chargement
 * - error: Erreur éventuelle
 * - isSuccess: Indique si la réinitialisation a réussi
 *
 * EXEMPLE :
 * ```tsx
 * function ResetPasswordPage() {
 *   const router = useRouter();
 *   const { mutate: resetPassword, isPending } = useResetPassword();
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     resetPassword(
 *       { token: 'token-from-url', newPassword: 'nouveauMotDePasse' },
 *       {
 *         onSuccess: () => {
 *           router.push('/login');
 *         }
 *       }
 *     );
 *   };
 * }
 * ```
 */
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordData) => resetPassword(data),
    onSuccess: () => {
      // Rediriger vers login après succès
      router.push("/login");
    },
    onError: (error: Error) => {
      console.error("Erreur de réinitialisation:", error);
    },
  });
}

// ============= HOOK DELETE ACCOUNT =============

/**
 * Hook pour supprimer le compte de l'utilisateur connecté
 *
 * Ce hook utilise React Query pour gérer la mutation de suppression de compte.
 * Après une suppression réussie, l'utilisateur est déconnecté et redirigé vers la page de login.
 *
 * RETOURNE :
 * - mutate: Fonction pour déclencher la suppression de compte
 * - isPending: État de chargement
 * - error: Erreur éventuelle
 * - isSuccess: Indique si la suppression a réussi
 *
 * EXEMPLE :
 * ```tsx
 * function DeleteAccountButton() {
 *   const router = useRouter();
 *   const { mutate: deleteUserAccount, isPending } = useDeleteAccount();
 *
 *   const handleDelete = () => {
 *     deleteUserAccount(undefined, {
 *       onSuccess: () => {
 *         // L'utilisateur est déjà déconnecté et redirigé
 *       },
 *       onError: (error) => {
 *         console.error('Erreur:', error.message);
 *       }
 *     });
 *   };
 * }
 * ```
 */
export function useDeleteAccount() {
  const router = useRouter();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: () => {
      // Déconnecter l'utilisateur
      logout();
      // Rediriger vers login
      router.push("/login");
    },
    onError: (error: Error) => {
      console.error("Erreur de suppression de compte:", error);
    },
  });
}
