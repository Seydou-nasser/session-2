Pour forker et lancer le projet sur GitHub, suivez ces étapes :

### Étape 1 : Forker le projet
1. Accédez au dépôt GitHub du projet que vous souhaitez forker.
2. Cliquez sur le bouton **Fork** en haut à droite de la page.  
   Cela crée une copie du dépôt sous votre compte GitHub.

### Étape 2 : Cloner le projet sur votre machine
1. Accédez à votre dépôt forké (sous votre compte GitHub).
2. Copiez le lien HTTPS ou SSH du dépôt.
3. Ouvrez un terminal sur votre machine et exécutez la commande suivante :
   ```bash
   git clone <URL_du_dépôt>
   ```
   Exemple :
   ```bash
   git clone https://github.com/votre-nom-utilisateur/session-2.git
   ```

### Étape 3 : Naviguer dans le répertoire du projet
1. Allez dans le répertoire du projet cloné :
   ```bash
   cd session-2
   ```

### Étape 4 : Installer les dépendances
1. Assurez-vous que vous avez Node.js et npm (ou yarn) installés sur votre machine.
2. Installez les dépendances en exécutant :
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

### Étape 5 : Lancer le projet
1. Une fois les dépendances installées, lancez le projet avec :
   ```bash
   npm run dev
   ```
   ou
   ```bash
   yarn run dev
   ```

### Étape 6 : Accéder au projet
1. Ouvrez un navigateur web et allez à l'adresse indiquée, généralement `http://localhost:3000` (ou un autre port, selon la configuration).

Si vous avez des étapes spécifiques ou des problèmes, n'hésitez pas à demander !
