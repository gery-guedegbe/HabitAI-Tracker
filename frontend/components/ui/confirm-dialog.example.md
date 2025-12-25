# ConfirmDialog - Modal de Confirmation Réutilisable

## Vue d'ensemble

Le composant `ConfirmDialog` est un modal de confirmation réutilisable qui permet de confirmer des actions sensibles (suppression, modifications importantes, etc.) dans toute l'application.

## Caractéristiques

- ✅ Réutilisable dans tout le projet
- ✅ Conforme à l'UI/UX globale de l'app
- ✅ Support dark/light mode
- ✅ Traductions FR/EN
- ✅ Responsive (mobile, tablette, desktop)
- ✅ Accessible (ARIA, navigation clavier)
- ✅ Animation fluide
- ✅ Empêche le scroll du body quand ouvert

## Installation

Le `ConfirmDialogProvider` est déjà intégré dans `app/providers.tsx`. Aucune installation supplémentaire n'est nécessaire.

## Utilisation

### 1. Importer le hook

```tsx
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
```

### 2. Utiliser dans un composant

```tsx
function MyComponent() {
  const confirmDialog = useConfirmDialog();

  const handleDelete = async () => {
    const confirmed = await confirmDialog.confirm({
      title: "Supprimer l'élément",
      message: "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
      variant: "danger", // "default" ou "danger"
      confirmText: "Supprimer", // Optionnel, par défaut "Confirmer"
      cancelText: "Annuler", // Optionnel, par défaut "Annuler"
      onConfirm: async () => {
        // Action à exécuter si confirmé
        await deleteItem();
      },
      onCancel: () => {
        // Action optionnelle si annulé
        console.log("Action annulée");
      },
    });

    // Le modal retourne true si confirmé, false si annulé
    if (confirmed) {
      console.log("Action confirmée");
    }
  };

  return <button onClick={handleDelete}>Supprimer</button>;
}
```

## Exemples d'utilisation

### Suppression simple

```tsx
const handleDelete = async () => {
  await confirmDialog.confirm({
    title: t("deleteTask"),
    message: t("deleteTaskConfirmation"),
    variant: "danger",
    confirmText: t("delete"),
    cancelText: t("cancel"),
    onConfirm: async () => {
      await deleteTaskMutation.mutateAsync(taskId);
    },
  });
};
```

### Confirmation avec action personnalisée

```tsx
const handleSave = async () => {
  const confirmed = await confirmDialog.confirm({
    title: "Enregistrer les modifications",
    message: "Voulez-vous enregistrer les modifications ?",
    variant: "default",
    onConfirm: async () => {
      await saveChanges();
    },
  });

  if (confirmed) {
    // Faire quelque chose après confirmation
    router.push("/success");
  }
};
```

## Options

| Option | Type | Requis | Description |
|--------|------|--------|-------------|
| `title` | `string` | ✅ | Titre du modal |
| `message` | `string` | ✅ | Message de confirmation |
| `variant` | `"default" \| "danger"` | ❌ | Style du modal (défaut: "default") |
| `confirmText` | `string` | ❌ | Texte du bouton de confirmation |
| `cancelText` | `string` | ❌ | Texte du bouton d'annulation |
| `onConfirm` | `() => void \| Promise<void>` | ✅ | Fonction appelée si confirmé |
| `onCancel` | `() => void` | ❌ | Fonction appelée si annulé |

## Variantes

### Default (par défaut)

Utilisé pour les confirmations générales (sauvegarde, modifications, etc.)

```tsx
variant: "default"
```

### Danger

Utilisé pour les actions destructives (suppression, etc.)

```tsx
variant: "danger"
```

Affiche une icône d'alerte et un bouton rouge.

## Accessibilité

- ✅ Support ARIA (`role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`)
- ✅ Navigation clavier (Escape pour fermer)
- ✅ Focus trap (le focus reste dans le modal)
- ✅ Labels accessibles pour les boutons

## Responsive

Le modal s'adapte automatiquement à toutes les tailles d'écran :
- **Mobile** : Pleine largeur avec padding
- **Tablette** : Largeur maximale avec marges
- **Desktop** : Largeur maximale de `max-w-md` (28rem)

## Thèmes

Le modal supporte automatiquement les thèmes light et dark grâce aux classes Tailwind :
- `bg-white dark:bg-neutral-900`
- `border-neutral-200 dark:border-neutral-800`
- Etc.

## Traductions

Utilisez le système de traduction existant avec `getTranslation` :

```tsx
const t = (key: Parameters<typeof getTranslation>[0]) =>
  getTranslation(key, language);

await confirmDialog.confirm({
  title: t("deleteTask"),
  message: t("deleteTaskConfirmation"),
  // ...
});
```

## Notes

- Le modal empêche le scroll du body quand il est ouvert
- Le modal se ferme automatiquement après confirmation ou annulation
- Le modal peut être fermé en cliquant sur l'overlay ou en appuyant sur Escape
- Le hook retourne une Promise qui se résout avec `true` si confirmé, `false` si annulé

