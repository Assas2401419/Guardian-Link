/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

// Fix for 'google' not found on 'window'
declare global {
  interface Window {
    google: any;
  }
}

// 1. --- LOCALIZATION SETUP ---
const translations = {
    en: {
        appName: "GuardianLink",
        login: {
            signIn: "Sign In",
            createAccount: "Create an Account",
            subtext: "Secure your world with one tap.",
            footer: "By signing in you accept our <terms>Terms of use</terms> and <privacy>Privacy policy</privacy>."
        },
        auth: {
            email: "Email",
            password: "Password",
            fullName: "Full Name",
            confirmPassword: "Confirm Password",
            signInGoogle: "Sign In with Google",
            signInApple: "Sign In with Apple",
            signUpGoogle: "Sign Up with Google",
            signUpApple: "Sign Up with Apple",
            or: "OR",
            forgotPassword: "Forgot Password?",
            noAccount: "Don’t have an account?",
            createOne: "Create one",
            hasAccount: "Already have an account?",
            signInHere: "Sign In",
            passwordValidationError: "Passwords do not match.",
            signInFailed: "Sign in failed. Please check your credentials.",
            passReq: {
                title: "Password must contain:",
                length: "At least 8 characters",
                uppercase: "One uppercase letter",
                number: "One number",
                symbol: "One symbol (!@#$...)"
            }
        },
        companionModal: {
            title: "Start Companion Mode",
            close: "Close",
            description: "Select contacts to share your live location with and set a duration for the session.",
            shareWith: "Share with:",
            noContacts: "Please add an emergency contact first.",
            duration: "Duration:",
            minutes: "min",
            hour: "hr",
            cancel: "Cancel",
            startSharing: "Start Sharing",
            alertNoContact: "Please select at least one contact to share your location with."
        },
        home: {
            elderlyMode: "Elderly Mode",
            sos: "SOS",
            cancel: "CANCEL",
            statusSafe: "You're Safe",
            statusActive: "EMERGENCY ACTIVE",
            companionMode: "Companion Mode",
            status: "Status:",
            active: "Active",
            inactive: "Inactive",
            sharingWith: "Sharing location with:",
            mapLoading: "Loading map...",
            stopSharing: "Stop Sharing",
            markSafe: "Mark Me as Safe"
        },
        contacts: {
            title: "Emergency Contacts",
            description: "Manage the people who will be notified in an emergency.",
            addContact: "Add Contact",
            contactNum: "Contact #",
            remove: "Remove Contact",
            fullName: "Full Name",
            phone: "Phone Number",
            email: "Email Address"
        },
        history: {
            title: "Alert History",
            description: "Recent alerts and activity logs will be shown here."
        },
        camera: {
            error: "Could not access the camera. Please check permissions.",
            cancel: "Cancel",
            capture: "Capture"
        },
        shareModal: {
            title: "Share Profile",
            description: "Share a link to your profile with others.",
            copy: "Copy",
            copied: "Copied!",
            shareVia: "Share via...",
            error: "Web Share API is not supported in your browser."
        },
        statusModal: {
            title: "Edit Status",
            emojiLabel: "Emoji",
            textLabel: "Status",
            save: "Save",
            cancel: "Cancel"
        },
        profile: {
            settings: "Settings",
            share: "Share Profile",
            setStatus: "Set your status",
            viewPicture: "View profile picture"
        },
        settings: {
            title: "Settings",
            back: "Back",
            profile: "Profile",
            upload: "Upload",
            camera: "Camera",
            username: "Username",
            email: "Email Address",
            safeword: "Voice Activation Safeword",
            safewordPlaceholder: "e.g., 'Guardian Angel'",
            changePass: "Change Password",
            currentPass: "Current Password",
            newPass: "New Password",
            confirmPass: "Confirm New Password",
            appearance: "Appearance",
            light: "Light",
            dark: "Dark",
            automatic: "Automatic",
            language: "App Language",
            notifications: "Notifications",
            sosAlerts: "SOS Alerts",
            sosAlertsDesc: "Receive alerts for emergency situations.",
            companionUpdates: "Companion Mode Updates",
            companionUpdatesDesc: "Get notified when live tracking starts or ends.",
            statusUpdates: "Status Updates",
            statusUpdatesDesc: "Alerts for “User Marked Safe” or system activity.",
            save: "Save Settings",
            signOut: "Sign Out",
            signOutConfirm: "Are you sure you want to sign out?",
            saveSuccess: "Settings saved!",
            langChanged: "Language changed to "
        },
        nav: {
            home: "Home",
            contacts: "Contacts",
            history: "History",
            profile: "Profile"
        }
    },
    es: {
        appName: "GuardianLink",
        login: { signIn: "Iniciar Sesión", createAccount: "Crear Cuenta", subtext: "Asegura tu mundo con un solo toque.", footer: "Al iniciar sesión, aceptas nuestros <terms>Términos de uso</terms> y <privacy>Política de privacidad</privacy>." },
        auth: { email: "Correo Electrónico", password: "Contraseña", fullName: "Nombre Completo", confirmPassword: "Confirmar Contraseña", signInGoogle: "Iniciar Sesión con Google", signInApple: "Iniciar Sesión con Apple", signUpGoogle: "Registrarse con Google", signUpApple: "Registrarse con Apple", or: "O", forgotPassword: "¿Olvidaste tu contraseña?", noAccount: "¿No tienes una cuenta?", createOne: "Crea una", hasAccount: "¿Ya tienes una cuenta?", signInHere: "Iniciar Sesión", passwordValidationError: "Las contraseñas no coinciden.", signInFailed: "Fallo de inicio de sesión. Revisa tus credenciales.", passReq: { title: "La contraseña debe contener:", length: "Al menos 8 caracteres", uppercase: "Una letra mayúscula", number: "Un número", symbol: "Un símbolo (!@#$...)" } },
        companionModal: { title: "Iniciar Modo Compañero", close: "Cerrar", description: "Selecciona contactos para compartir tu ubicación en vivo y establece una duración.", shareWith: "Compartir con:", noContacts: "Por favor, añade un contacto de emergencia primero.", duration: "Duración:", minutes: "min", hour: "h", cancel: "Cancelar", startSharing: "Empezar a Compartir", alertNoContact: "Por favor, selecciona al menos un contacto." },
        home: { elderlyMode: "Modo Mayor", sos: "SOS", cancel: "CANCELAR", statusSafe: "Estás a Salvo", statusActive: "EMERGENCIA ACTIVA", companionMode: "Modo Compañero", status: "Estado:", active: "Activo", inactive: "Inactivo", sharingWith: "Compartiendo ubicación con:", mapLoading: "Cargando mapa...", stopSharing: "Dejar de Compartir", markSafe: "Marcar como Seguro" },
        contacts: { title: "Contactos de Emergencia", description: "Administra las personas que serán notificadas en una emergencia.", addContact: "Añadir Contacto", contactNum: "Contacto #", remove: "Eliminar Contacto", fullName: "Nombre Completo", phone: "Número de Teléfono", email: "Correo Electrónico" },
        history: { title: "Historial de Alertas", description: "Las alertas y registros de actividad recientes se mostrarán aquí." },
        camera: { error: "No se pudo acceder a la cámara. Revisa los permisos.", cancel: "Cancelar", capture: "Capturar" },
        shareModal: { title: "Compartir Perfil", description: "Comparte un enlace a tu perfil con otros.", copy: "Copiar", copied: "¡Copiado!", shareVia: "Compartir vía...", error: "La API de Compartir Web no es compatible con tu navegador." },
        statusModal: { title: "Editar Estado", emojiLabel: "Emoji", textLabel: "Estado", save: "Guardar", cancel: "Cancelar" },
        profile: { settings: "Ajustes", share: "Compartir Perfil", setStatus: "Define tu estado", viewPicture: "Ver foto de perfil" },
        settings: { title: "Ajustes", back: "Atrás", profile: "Perfil", upload: "Subir", camera: "Cámara", username: "Usuario", email: "Correo Electrónico", safeword: "Palabra Clave de Activación por Voz", safewordPlaceholder: "ej. 'Ángel Guardián'", changePass: "Cambiar Contraseña", currentPass: "Contraseña Actual", newPass: "Nueva Contraseña", confirmPass: "Confirmar Nueva Contraseña", appearance: "Apariencia", light: "Claro", dark: "Oscuro", automatic: "Automático", language: "Idioma de la App", notifications: "Notificaciones", sosAlerts: "Alertas SOS", sosAlertsDesc: "Recibir alertas en situaciones de emergencia.", companionUpdates: "Actualizaciones Modo Compañero", companionUpdatesDesc: "Recibir notificaciones cuando el seguimiento en vivo comienza o termina.", statusUpdates: "Actualizaciones de Estado", statusUpdatesDesc: "Alertas para “Usuario Marcado como Seguro” o actividad del sistema.", save: "Guardar Ajustes", signOut: "Cerrar Sesión", signOutConfirm: "¿Seguro que quieres cerrar sesión?", saveSuccess: "¡Ajustes guardados!", langChanged: "Idioma cambiado a " },
        nav: { home: "Inicio", contacts: "Contactos", history: "Historial", profile: "Perfil" }
    },
    fr: {
        appName: "GuardianLink",
        login: { signIn: "Se Connecter", createAccount: "Créer un Compte", subtext: "Sécurisez votre monde d'un simple toucher.", footer: "En vous connectant, vous acceptez nos <terms>Conditions d'utilisation</terms> et notre <privacy>Politique de confidentialité</privacy>." },
        auth: { email: "E-mail", password: "Mot de passe", fullName: "Nom Complet", confirmPassword: "Confirmer le mot de passe", signInGoogle: "Se connecter avec Google", signInApple: "Se connecter avec Apple", signUpGoogle: "S'inscrire avec Google", signUpApple: "S'inscrire avec Apple", or: "OU", forgotPassword: "Mot de passe oublié ?", noAccount: "Pas de compte ?", createOne: "En créer un", hasAccount: "Déjà un compte ?", signInHere: "Se connecter", passwordValidationError: "Les mots de passe ne correspondent pas.", signInFailed: "Échec de la connexion. Veuillez vérifier vos identifiants.", passReq: { title: "Le mot de passe doit contenir :", length: "Au moins 8 caractères", uppercase: "Une lettre majuscule", number: "Un chiffre", symbol: "Un symbole (!@#$...)" } },
        companionModal: { title: "Démarrer le Mode Compagnon", close: "Fermer", description: "Sélectionnez des contacts pour partager votre position en direct et définissez une durée.", shareWith: "Partager avec :", noContacts: "Veuillez d'abord ajouter un contact d'urgence.", duration: "Durée :", minutes: "min", hour: "h", cancel: "Annuler", startSharing: "Commencer le Partage", alertNoContact: "Veuillez sélectionner au moins un contact." },
        home: { elderlyMode: "Mode Senior", sos: "SOS", cancel: "ANNULER", statusSafe: "Vous êtes en Sécurité", statusActive: "URGENCE ACTIVE", companionMode: "Mode Compagnon", status: "Statut :", active: "Actif", inactive: "Inactif", sharingWith: "Partage de la position avec :", mapLoading: "Chargement de la carte...", stopSharing: "Arrêter le Partage", markSafe: "Me Marquer comme Sûr" },
        contacts: { title: "Contacts d'Urgence", description: "Gérez les personnes qui seront notifiées en cas d'urgence.", addContact: "Ajouter un Contact", contactNum: "Contact #", remove: "Supprimer le Contact", fullName: "Nom Complet", phone: "Numéro de Téléphone", email: "Adresse E-mail" },
        history: { title: "Historique des Alertes", description: "Les alertes récentes et les journaux d'activité seront affichés ici." },
        camera: { error: "Impossible d'accéder à la caméra. Veuillez vérifier les autorisations.", cancel: "Annuler", capture: "Capturer" },
        shareModal: { title: "Partager le Profil", description: "Partagez un lien vers votre profil.", copy: "Copier", copied: "Copié !", shareVia: "Partager via...", error: "L'API de partage Web n'est pas prise en charge par votre navigateur." },
        statusModal: { title: "Modifier le Statut", emojiLabel: "Emoji", textLabel: "Statut", save: "Enregistrer", cancel: "Annuler" },
        profile: { settings: "Paramètres", share: "Partager le Profil", setStatus: "Définir votre statut", viewPicture: "Voir la photo de profil" },
        settings: { title: "Paramètres", back: "Retour", profile: "Profil", upload: "Télécharger", camera: "Caméra", username: "Nom d'utilisateur", email: "Adresse E-mail", safeword: "Mot de Sécurité pour Activation Vocale", safewordPlaceholder: "ex. 'Ange Gardien'", changePass: "Changer de Mot de Passe", currentPass: "Mot de Passe Actuel", newPass: "Nouveau Mot de Passe", confirmPass: "Confirmer le Nouveau Mot de Passe", appearance: "Apparence", light: "Clair", dark: "Sombre", automatic: "Automatique", language: "Langue de l'App", notifications: "Notifications", sosAlerts: "Alertes SOS", sosAlertsDesc: "Recevoir des alertes en cas d'urgence.", companionUpdates: "Mises à Jour Mode Compagnon", companionUpdatesDesc: "Être notifié lorsque le suivi en direct commence ou se termine.", statusUpdates: "Mises à Jour de Statut", statusUpdatesDesc: "Alertes pour “Utilisateur Marqué comme Sûr” ou activité du système.", save: "Enregistrer", signOut: "Se Déconnecter", signOutConfirm: "Êtes-vous sûr de vouloir vous déconnecter ?", saveSuccess: "Paramètres enregistrés !", langChanged: "Langue changée en " },
        nav: { home: "Accueil", contacts: "Contacts", history: "Historique", profile: "Profil" }
    },
    pt: {
        appName: "GuardianLink",
        login: { signIn: "Entrar", createAccount: "Criar Conta", subtext: "Proteja seu mundo com um toque.", footer: "Ao entrar, você aceita nossos <terms>Termos de Uso</terms> e <privacy>Política de Privacidade</privacy>." },
        auth: { email: "E-mail", password: "Senha", fullName: "Nome Completo", confirmPassword: "Confirmar Senha", signInGoogle: "Entrar com Google", signInApple: "Entrar com Apple", signUpGoogle: "Registrar com Google", signUpApple: "Registrar com Apple", or: "OU", forgotPassword: "Esqueceu a senha?", noAccount: "Não tem uma conta?", createOne: "Crie uma", hasAccount: "Já tem uma conta?", signInHere: "Entrar", passwordValidationError: "As senhas não correspondem.", signInFailed: "Falha ao entrar. Verifique suas credenciais.", passReq: { title: "A senha deve conter:", length: "Pelo menos 8 caracteres", uppercase: "Uma letra maiúscula", number: "Um número", symbol: "Um símbolo (!@#$...)" } },
        companionModal: { title: "Iniciar Modo Companheiro", close: "Fechar", description: "Selecione contatos para compartilhar sua localização ao vivo e defina una duração.", shareWith: "Compartilhar com:", noContacts: "Por favor, adicione um contato de emergência primeiro.", duration: "Duração:", minutes: "min", hour: "h", cancel: "Cancelar", startSharing: "Começar a Compartilhar", alertNoContact: "Por favor, selecione pelo menos um contato." },
        home: { elderlyMode: "Modo Idoso", sos: "SOS", cancel: "CANCELAR", statusSafe: "Você está Seguro", statusActive: "EMERGÊNCIA ATIVA", companionMode: "Modo Companheiro", status: "Status:", active: "Ativo", inactive: "Inativo", sharingWith: "Compartilhando localização com:", mapLoading: "Carregando mapa...", stopSharing: "Parar de Compartilhar", markSafe: "Marcar como Seguro" },
        contacts: { title: "Contatos de Emergência", description: "Gerencie as pessoas que serão notificadas em uma emergência.", addContact: "Adicionar Contato", contactNum: "Contato #", remove: "Remover Contato", fullName: "Nome Completo", phone: "Número de Telefone", email: "Endereço de E-mail" },
        history: { title: "Histórico de Alertas", description: "Alertas recentes e registros de atividades serão mostrados aqui." },
        camera: { error: "Não foi possível acessar a câmera. Verifique as permissões.", cancel: "Cancelar", capture: "Capturar" },
        shareModal: { title: "Compartilhar Perfil", description: "Compartilhe um link para o seu perfil.", copy: "Copiar", copied: "Copiado!", shareVia: "Compartilhar via...", error: "A API de Compartilhamento Web não é suportada no seu navegador." },
        statusModal: { title: "Editar Status", emojiLabel: "Emoji", textLabel: "Status", save: "Salvar", cancel: "Cancelar" },
        profile: { settings: "Configurações", share: "Compartilhar Perfil", setStatus: "Defina seu status", viewPicture: "Ver foto do perfil" },
        settings: { title: "Configurações", back: "Voltar", profile: "Perfil", upload: "Carregar", camera: "Câmera", username: "Nome de usuário", email: "Endereço de E-mail", safeword: "Palavra de Segurança para Ativação por Voz", safewordPlaceholder: "ex. 'Anjo da Guarda'", changePass: "Alterar Senha", currentPass: "Senha Atual", newPass: "Nova Senha", confirmPass: "Confirmar Nova Senha", appearance: "Aparência", light: "Claro", dark: "Escuro", automatic: "Automático", language: "Idioma do App", notifications: "Notificações", sosAlerts: "Alertas SOS", sosAlertsDesc: "Receber alertas em situações de emergência.", companionUpdates: "Atualizações do Modo Companheiro", companionUpdatesDesc: "Ser notificado quando o rastreamento ao vivo começa ou termina.", statusUpdates: "Atualizações de Status", statusUpdatesDesc: "Alertas para “Usuário Marcado como Seguro” ou atividade do sistema.", save: "Salvar", signOut: "Sair", signOutConfirm: "Tem certeza de que deseja sair?", saveSuccess: "Configurações salvas!", langChanged: "Idioma alterado para " },
        nav: { home: "Início", contacts: "Contatos", history: "Histórico", profile: "Perfil" }
    },
    hi: {
        appName: "गार्डियनलिंक",
        login: { signIn: "साइन इन करें", createAccount: "खाता बनाएं", subtext: "एक टैप से अपनी दुनिया सुरक्षित करें।", footer: "साइन इन करके आप हमारी <terms>उपयोग की शर्तें</terms> और <privacy>गोपनीयता नीति</privacy> स्वीकार करते हैं।" },
        auth: { email: "ईमेल", password: "पासवर्ड", fullName: "पूरा नाम", confirmPassword: "पासवर्ड की पुष्टि करें", signInGoogle: "Google से साइन इन करें", signInApple: "Apple से साइन इन करें", signUpGoogle: "Google से साइन अप करें", signUpApple: "Apple से साइन अप करें", or: "या", forgotPassword: "पासवर्ड भूल गए?", noAccount: "खाता नहीं है?", createOne: "एक बनाएं", hasAccount: "पहले से ही खाता है?", signInHere: "साइन इन करें", passwordValidationError: "पासवर्ड मेल नहीं खाते।", signInFailed: "साइन इन विफल। कृपया अपनी साख जांचें।", passReq: { title: "पासवर्ड में होना चाहिए:", length: "कम से कम 8 अक्षर", uppercase: "एक बड़ा अक्षर", number: "एक संख्या", symbol: "एक प्रतीक (!@#$...)" } },
        companionModal: { title: "साथी मोड शुरू करें", close: "बंद करें", description: "लाइव लोकेशन साझा करने के लिए संपर्क चुनें और अवधि निर्धारित करें।", shareWith: "इनके साथ साझा करें:", noContacts: "कृपया पहले एक आपातकालीन संपर्क जोड़ें।", duration: "अवधि:", minutes: "मिनट", hour: "घंटा", cancel: "रद्द करें", startSharing: "साझा करना शुरू करें", alertNoContact: "कृपया कम से कम एक संपर्क चुनें।" },
        home: { elderlyMode: "बुजुर्ग मोड", sos: "SOS", cancel: "रद्द करें", statusSafe: "आप सुरक्षित हैं", statusActive: "आपातकाल सक्रिय", companionMode: "साथी मोड", status: "स्थिति:", active: "सक्रिय", inactive: "निष्क्रिय", sharingWith: "इनके साथ लोकेशन साझा हो रही है:", mapLoading: "नक्शा लोड हो रहा है...", stopSharing: "साझा करना बंद करें", markSafe: "मुझे सुरक्षित चिह्नित करें" },
        contacts: { title: "आपातकालीन संपर्क", description: "उन लोगों का प्रबंधन करें जिन्हें आपात स्थिति में सूचित किया जाएगा।", addContact: "संपर्क जोड़ें", contactNum: "संपर्क #", remove: "संपर्क हटाएं", fullName: "पूरा नाम", phone: "फोन नंबर", email: "ईमेल पता" },
        history: { title: "अलर्ट इतिहास", description: "हाल के अलर्ट और गतिविधि लॉग यहां दिखाए जाएंगे।" },
        camera: { error: "कैमरे तक नहीं पहुंच सका। कृपया अनुमतियों की जांच करें।", cancel: "रद्द करें", capture: "कैप्चर करें" },
        shareModal: { title: "प्रोफ़ाइल साझा करें", description: "दूसरों के साथ अपनी प्रोफ़ाइल का लिंक साझा करें।", copy: "कॉपी करें", copied: "कॉपी किया गया!", shareVia: "इसके माध्यम से साझा करें...", error: "वेब शेयर एपीआई आपके ब्राउज़र में समर्थित नहीं है।" },
        statusModal: { title: "स्थिति संपादित करें", emojiLabel: "इमोजी", textLabel: "स्थिति", save: "सहेजें", cancel: "रद्द करें" },
        profile: { settings: "सेटिंग्स", share: "प्रोफ़ाइल साझा करें", setStatus: "अपनी स्थिति सेट करें", viewPicture: "प्रोफ़ाइल चित्र देखें" },
        settings: { title: "सेटिंग्स", back: "वापस", profile: "प्रोफ़ाइल", upload: "अपलोड करें", camera: "कैमरा", username: "उपयोगकर्ता नाम", email: "ईमेल पता", safeword: "वॉयस एक्टिवेशन सेफवर्ड", safewordPlaceholder: "जैसे, 'गार्जियन एंजेल'", changePass: "पासवर्ड बदलें", currentPass: "वर्तमान पासवर्ड", newPass: "नया पासवर्ड", confirmPass: "नए पासवर्ड की पुष्टि करें", appearance: "दिखावट", light: "लाइट", dark: "डार्क", automatic: "स्वचालित", language: "ऐप की भाषा", notifications: "सूचनाएं", sosAlerts: "SOS अलर्ट", sosAlertsDesc: "आपातकालीन स्थितियों के लिए अलर्ट प्राप्त करें।", companionUpdates: "साथी मोड अपडेट", companionUpdatesDesc: "लाइव ट्रैकिंग शुरू या समाप्त होने पर सूचित करें।", statusUpdates: "स्थिति अपडेट", statusUpdatesDesc: "'उपयोगकर्ता सुरक्षित चिह्नित' या सिस्टम गतिविधि के लिए अलर्ट।", save: "सेटिंग्स सहेजें", signOut: "साइन आउट करें", signOutConfirm: "क्या आप वाकई साइन आउट करना चाहते हैं?", saveSuccess: "सेटिंग्स सहेजी गईं!", langChanged: "भाषा इसमें बदल गई है " },
        nav: { home: "होम", contacts: "संपर्क", history: "इतिहास", profile: "प्रोफ़ाइल" }
    },
    zh: {
        appName: "守护链接",
        login: { signIn: "登录", createAccount: "创建账户", subtext: "一键守护您的世界。", footer: "登录即表示您接受我们的<terms>使用条款</terms>和<privacy>隐私政策</privacy>。" },
        auth: { email: "电子邮件", password: "密码", fullName: "全名", confirmPassword: "确认密码", signInGoogle: "使用 Google 登录", signInApple: "使用 Apple 登录", signUpGoogle: "使用 Google 注册", signUpApple: "使用 Apple 注册", or: "或", forgotPassword: "忘记密码？", noAccount: "没有账户？", createOne: "创建一个", hasAccount: "已有账户？", signInHere: "登录", passwordValidationError: "密码不匹配。", signInFailed: "登录失败。请检查您的凭据。", passReq: { title: "密码必须包含：", length: "至少8个字符", uppercase: "一个大写字母", number: "一个数字", symbol: "一个符号 (!@#$...)" } },
        companionModal: { title: "开启陪伴模式", close: "关闭", description: "选择联系人分享您的实时位置并设置持续时间。", shareWith: "分享给：", noContacts: "请先添加紧急联系人。", duration: "持续时间：", minutes: "分钟", hour: "小时", cancel: "取消", startSharing: "开始分享", alertNoContact: "请至少选择一个联系人。" },
        home: { elderlyMode: "长者模式", sos: "SOS", cancel: "取消", statusSafe: "您是安全的", statusActive: "紧急情况激活", companionMode: "陪伴模式", status: "状态：", active: "活动中", inactive: "未激活", sharingWith: "正在与以下用户分享位置：", mapLoading: "地图加载中...", stopSharing: "停止分享", markSafe: "标记我为安全" },
        contacts: { title: "紧急联系人", description: "管理在紧急情况下将收到通知的人员。", addContact: "添加联系人", contactNum: "联系人 #", remove: "移除联系人", fullName: "全名", phone: "电话号码", email: "电子邮件地址" },
        history: { title: "警报历史", description: "最近的警报和活动日志将在此处显示。" },
        camera: { error: "无法访问相机。请检查权限。", cancel: "取消", capture: "拍摄" },
        shareModal: { title: "分享个人资料", description: "与他人分享您的个人资料链接。", copy: "复制", copied: "已复制！", shareVia: "通过...分享", error: "您的浏览器不支持Web Share API。" },
        statusModal: { title: "编辑状态", emojiLabel: "表情符号", textLabel: "状态", save: "保存", cancel: "取消" },
        profile: { settings: "设置", share: "分享个人资料", setStatus: "设置您的状态", viewPicture: "查看个人资料图片" },
        settings: { title: "设置", back: "返回", profile: "个人资料", upload: "上传", camera: "相机", username: "用户名", email: "电子邮件地址", safeword: "语音激活安全词", safewordPlaceholder: "例如，“守护天使”", changePass: "更改密码", currentPass: "当前密码", newPass: "新密码", confirmPass: "确认新密码", appearance: "外观", light: "浅色", dark: "深色", automatic: "自动", language: "应用语言", notifications: "通知", sosAlerts: "SOS 警报", sosAlertsDesc: "接收紧急情况警报。", companionUpdates: "陪伴模式更新", companionUpdatesDesc: "在实时跟踪开始或结束时收到通知。", statusUpdates: "状态更新", statusUpdatesDesc: "“用户标记为安全”或系统活动的警报。", save: "保存设置", signOut: "退出登录", signOutConfirm: "您确定要退出登录吗？", saveSuccess: "设置已保存！", langChanged: "语言已更改为 " },
        nav: { home: "主页", contacts: "联系人", history: "历史", profile: "个人资料" }
    },
    ar: {
        appName: "جارديان لينك",
        login: { signIn: "تسجيل الدخول", createAccount: "إنشاء حساب", subtext: "أمّن عالمك بنقرة واحدة.", footer: "بتسجيل الدخول، فإنك توافق على <terms>شروط الاستخدام</terms> و<privacy>سياسة الخصوصية</privacy>." },
        auth: { email: "البريد الإلكتروني", password: "كلمة المرور", fullName: "الاسم الكامل", confirmPassword: "تأكيد كلمة المرور", signInGoogle: "تسجيل الدخول باستخدام Google", signInApple: "تسجيل الدخول باستخدام Apple", signUpGoogle: "التسجيل باستخدام Google", signUpApple: "التسجيل باستخدام Apple", or: "أو", forgotPassword: "هل نسيت كلمة المرور؟", noAccount: "ليس لديك حساب؟", createOne: "أنشئ حسابًا", hasAccount: "هل لديك حساب بالفعل؟", signInHere: "تسجيل الدخول", passwordValidationError: "كلمتا المرور غير متطابقتين.", signInFailed: "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.", passReq: { title: "يجب أن تحتوي كلمة المرور على:", length: "8 أحرف على الأقل", uppercase: "حرف كبير واحد", number: "رقم واحد", symbol: "رمز واحد (!@#$...)" } },
        companionModal: { title: "بدء وضع الرفيق", close: "إغلاق", description: "حدد جهات اتصال لمشاركة موقعك المباشر معها وتعيين مدة للجلسة.", shareWith: "مشاركة مع:", noContacts: "يرجى إضافة جهة اتصال للطوارئ أولاً.", duration: "المدة:", minutes: "دقيقة", hour: "ساعة", cancel: "إلغاء", startSharing: "بدء المشاركة", alertNoContact: "يرجى تحديد جهة اتصال واحدة على الأقل." },
        home: { elderlyMode: "وضع كبار السن", sos: "SOS", cancel: "إلغاء", statusSafe: "أنت آمن", statusActive: "الطوارئ نشطة", companionMode: "وضع الرفيق", status: "الحالة:", active: "نشط", inactive: "غير نشط", sharingWith: "تتم مشاركة الموقع مع:", mapLoading: "جارٍ تحميل الخريطة...", stopSharing: "إيقاف المشاركة", markSafe: "تحديد أنني آمن" },
        contacts: { title: "جهات اتصال الطوارئ", description: "إدارة الأشخاص الذين سيتم إخطارهم في حالات الطوارئ.", addContact: "إضافة جهة اتصال", contactNum: "جهة اتصال #", remove: "إزالة جهة اتصال", fullName: "الاسم الكامل", phone: "رقم الهاتف", email: "البريد الإلكتروني" },
        history: { title: "سجل التنبيهات", description: "سيتم عرض التنبيهات الأخيرة وسجلات النشاط هنا." },
        camera: { error: "تعذر الوصول إلى الكاميرا. يرجى التحقق من الأذونات.", cancel: "إلغاء", capture: "التقاط" },
        shareModal: { title: "مشاركة الملف الشخصي", description: "شارك رابط ملفك الشخصي مع الآخرين.", copy: "نسخ", copied: "تم النسخ!", shareVia: "مشاركة عبر...", error: "واجهة برمجة تطبيقات المشاركة على الويب غير مدعومة في متصفحك." },
        statusModal: { title: "تعديل الحالة", emojiLabel: "رمز تعبيري", textLabel: "الحالة", save: "حفظ", cancel: "إلغاء" },
        profile: { settings: "الإعدادات", share: "مشاركة الملف الشخصي", setStatus: "عيّن حالتك", viewPicture: "عرض صورة الملف الشخصي" },
        settings: { title: "الإعدادات", back: "رجوع", profile: "الملف الشخصي", upload: "تحميل", camera: "الكاميرا", username: "اسم المستخدم", email: "البريد الإلكتروني", safeword: "كلمة الأمان للتفعيل الصوتي", safewordPlaceholder: "مثال: 'الملاك الحارس'", changePass: "تغيير كلمة المرور", currentPass: "كلمة المرور الحالية", newPass: "كلمة المرور الجديدة", confirmPass: "تأكيد كلمة المرور الجديدة", appearance: "المظهر", light: "فاتح", dark: "داكن", automatic: "تلقائي", language: "لغة التطبيق", notifications: "الإشعارات", sosAlerts: "تنبيهات SOS", sosAlertsDesc: "استقبال تنبيهات لحالات الطوارئ.", companionUpdates: "تحديثات وضع الرفيق", companionUpdatesDesc: "الحصول على إشعار عند بدء أو انتهاء التتبع المباشر.", statusUpdates: "تحديثات الحالة", statusUpdatesDesc: "تنبيهات لـ 'تم تحديد المستخدم كآمن' أو نشاط النظام.", save: "حفظ الإعدادات", signOut: "تسجيل الخروج", signOutConfirm: "هل أنت متأكد أنك تريد تسجيل الخروج؟", saveSuccess: "تم حفظ الإعدادات!", langChanged: "تم تغيير اللغة إلى " },
        nav: { home: "الرئيسية", contacts: "جهات الاتصال", history: "السجل", profile: "الملف الشخصي" }
    }
};

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'pt', name: 'Português' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'zh', name: '中文 (简体)' },
    { code: 'ar', name: 'العربية' },
];

const rtlLanguages = ['ar'];

const LocalizationContext = createContext(null);

const LocalizationProvider = ({ children }: { children?: React.ReactNode }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const storedLang = localStorage.getItem('guardianlink-lang');
        const browserLang = navigator.language.split('-')[0];
        const initialLang = storedLang || (translations[browserLang] ? browserLang : 'en');
        setLanguage(initialLang);
    }, []);

    useEffect(() => {
        localStorage.setItem('guardianlink-lang', language);
        document.documentElement.lang = language;
        if (rtlLanguages.includes(language)) {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl-mode');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl-mode');
        }
    }, [language]);

    const t = (key) => {
        const keys = key.split('.');
        let result = translations[language] || translations.en;
        for (const k of keys) {
            result = result[k];
            if (!result) {
                // Fallback to English
                let fallback = translations.en;
                for (const fk of keys) {
                    fallback = fallback[fk];
                    if (!fallback) return key;
                }
                return fallback;
            }
        }
        return result || key;
    };
    
    return (
        <LocalizationContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LocalizationContext.Provider>
    );
};

const useLocalization = () => useContext(LocalizationContext);

// --- END LOCALIZATION SETUP ---

const GuardianLinkLogo = () => (
    <svg viewBox="0 0 120 145" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
            {/* Shield Path */}
            <path 
                d="M60 5 L110 30 V70 C110 100 60 120 60 120 C60 120 10 100 10 70 V30 L60 5 Z" 
                fill="#d5e9ff" 
                fillOpacity="0.1"
                stroke="#d5e9ff" 
                strokeWidth="4" 
            />
            
            {/* Stylized G */}
            <path 
                d="M85,62.5 A22.5,22.5 0 1 1 62.5,40 L62.5,55 L75,55"
                fill="none"
                stroke="#d5e9ff"
                strokeWidth="8"
                strokeLinecap="round"
            />

             {/* People/Wave Symbol */}
            <path
                d="M45 68 C 52 62, 63 62, 70 68 M 45 75 C 52 69, 63 69, 70 75"
                fill="none"
                stroke="#d5e9ff"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </g>
        <text x="60" y="138" textAnchor="middle" fontSize="20" fill="#d5e9ff" fontFamily="Inter, sans-serif" fontWeight="600" opacity="0.8">
            GuardianLink
        </text>
    </svg>
);

const LandingScreen = ({ onNavigateToSignIn, onNavigateToSignUp }) => {
    const { t } = useLocalization();
    const footerText = t('login.footer');
    const parts = footerText.split(/<terms>|<\/terms>|<privacy>|<\/privacy>/);
    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-logo">
                    <GuardianLinkLogo />
                </div>

                <div className="login-actions">
                    <button className="btn btn-login-primary" onClick={onNavigateToSignIn}>
                        {t('login.signIn')}
                    </button>
                    <button className="btn btn-login-secondary" onClick={onNavigateToSignUp}>
                        {t('login.createAccount')}
                    </button>
                    <p className="login-subtext">{t('login.subtext')}</p>
                </div>

                <div className="login-footer">
                   <p>
                        {parts[0]}
                        <a href="#">{parts[1]}</a>
                        {parts[2]}
                        <a href="#">{parts[3]}</a>
                        {parts[4]}
                    </p>
                </div>
            </div>
        </div>
    );
};

const SignInScreen = ({ onLogin, onNavigateToSignUp }) => {
    const { t } = useLocalization();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            if (email === 'alex.doe@example.com' && password === 'password123') {
                onLogin();
            } else {
                setError(t('auth.signInFailed'));
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="auth-container">
            <div className="login-logo">
                <GuardianLinkLogo />
            </div>
            <h1>{t('login.signIn')}</h1>
            <button className="btn social-btn google-btn">{t('auth.signInGoogle')}</button>
            <button className="btn social-btn apple-btn">{t('auth.signInApple')}</button>
            <div className="social-login-divider"><span>{t('auth.or')}</span></div>

            <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="email">{t('auth.email')}</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">{t('auth.password')}</label>
                    <div className="password-input-wrapper">
                        <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn" aria-label="Toggle password visibility">
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <a href="#" className="forgot-password-link">{t('auth.forgotPassword')}</a>
                </div>
                <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
                    {isLoading ? <div className="spinner"></div> : t('login.signIn')}
                </button>
            </form>

            <p className="auth-switcher">
                {t('auth.noAccount')} <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToSignUp(); }}>{t('auth.createOne')}</a>
            </p>
        </div>
    );
};

const PasswordValidationFeedback = ({ password }) => {
    const { t } = useLocalization();
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const criteria = [
        { key: 'length', text: t('auth.passReq.length'), valid: checks.length },
        { key: 'uppercase', text: t('auth.passReq.uppercase'), valid: checks.uppercase },
        { key: 'number', text: t('auth.passReq.number'), valid: checks.number },
        { key: 'symbol', text: t('auth.passReq.symbol'), valid: checks.symbol },
    ];
    
    if (!password) return null;

    return (
        <div className="password-validation-feedback">
            <p>{t('auth.passReq.title')}</p>
            <ul>
                {criteria.map(item => (
                    <li key={item.key} className={item.valid ? 'valid' : ''}>
                        {item.valid ? '✓' : '•'} {item.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const SignUpScreen = ({ onLogin, onNavigateToSignIn }) => {
    const { t } = useLocalization();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError(t('auth.passwordValidationError'));
            return;
        }
        setError('');
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Account created');
            onLogin();
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="auth-container">
            <div className="login-logo">
                <GuardianLinkLogo />
            </div>
            <h1>{t('login.createAccount')}</h1>
            <button className="btn social-btn google-btn">{t('auth.signUpGoogle')}</button>
            <button className="btn social-btn apple-btn">{t('auth.signUpApple')}</button>
            <div className="social-login-divider"><span>{t('auth.or')}</span></div>

            <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="fullName">{t('auth.fullName')}</label>
                    <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="signup-email">{t('auth.email')}</label>
                    <input type="email" id="signup-email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="signup-password">{t('auth.password')}</label>
                    <div className="password-input-wrapper">
                        <input type={showPassword ? "text" : "password"} id="signup-password" value={password} onChange={e => setPassword(e.target.value)} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn" aria-label="Toggle password visibility">
                           {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <PasswordValidationFeedback password={password} />
                <div className="form-group">
                    <label htmlFor="confirm-password">{t('auth.confirmPassword')}</label>
                    <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
                    {isLoading ? <div className="spinner"></div> : t('login.createAccount')}
                </button>
            </form>

            <p className="auth-switcher">
                {t('auth.hasAccount')} <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToSignIn(); }}>{t('auth.signInHere')}</a>
            </p>
        </div>
    );
};

const CompanionModeModal = ({ contacts, onClose, onStart }) => {
    const [selectedContactIds, setSelectedContactIds] = useState([]);
    const [duration, setDuration] = useState(30);
    const { t } = useLocalization();

    const handleContactToggle = (contactId) => {
        setSelectedContactIds(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    const handleStart = () => {
        if (selectedContactIds.length === 0) {
            alert(t('companionModal.alertNoContact'));
            return;
        }
        onStart(selectedContactIds, duration);
    };
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleEsc = (event) => {
           if (event.keyCode === 27) onClose();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('companionModal.title')}</h2>
                    <button onClick={onClose} className="close-btn" aria-label={t('companionModal.close')}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <p>{t('companionModal.description')}</p>

                    <div className="form-group">
                        <label>{t('companionModal.shareWith')}</label>
                        <div className="contact-selection-list">
                            {contacts.length > 0 ? contacts.map(contact => (
                                <label key={contact.id} className="contact-selection-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedContactIds.includes(contact.id)}
                                        onChange={() => handleContactToggle(contact.id)}
                                    />
                                    <span>{contact.name}</span>
                                </label>
                            )) : <p>{t('companionModal.noContacts')}</p>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="duration">{t('companionModal.duration')}</label>
                        <div className="duration-options">
                            {[15, 30, 60, 120].map(d => (
                                <button
                                    key={d}
                                    type="button"
                                    className={`btn ${duration === d ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setDuration(d)}
                                >
                                    {d < 60 ? `${d} ${t('companionModal.minutes')}` : `${d/60} ${t('companionModal.hour')}`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>{t('companionModal.cancel')}</button>
                    <button type="button" className="btn btn-primary" onClick={handleStart} disabled={contacts.length === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                            <path d="M1 14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.5a.5.5 0 0 0-1 0V14a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5.5V2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v4.5a.5.5 0 0 0 1 0V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12z"/>
                        </svg>
                        {t('companionModal.startSharing')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const MapView = ({ center }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const markerRef = useRef(null);

  useEffect(() => {
    async function initMap() {
        if (ref.current && !map && window.google) {
            const { Map } = await window.google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
            
            const newMap = new Map(ref.current, {
                center,
                zoom: 16,
                mapId: 'GUARDIANLINK_MAP_ID',
                disableDefaultUI: true,
            });
            
            const markerElement = document.createElement('div');
            markerElement.className = 'custom-marker';

            markerRef.current = new AdvancedMarkerElement({
                position: center,
                map: newMap,
                title: "Your Location",
                content: markerElement,
            });
            
            setMap(newMap);
        }
    }
    if (window.google) {
        initMap();
    }
  }, [ref, map, center]);

  useEffect(() => {
    if (map && markerRef.current) {
        markerRef.current.position = center;
        map.panTo(center);
    }
  }, [center, map]);

  return <div ref={ref} id="map" />;
};

const HomeScreen = ({
  isElderlyMode,
  setIsElderlyMode,
  isSosActive,
  companionSession,
  handleStartSos,
  handleCancelSos,
  handleMarkSafe,
  sosCountdown,
  timeLeft,
  formatTime,
  isMapScriptLoaded,
  currentPosition,
  stopCompanionMode
}) => {
  const { t } = useLocalization();
  return (
    <div className="home-screen">
      <div className="home-header">
        <h1>{t('appName')}</h1>
        <div className="form-group toggle-group">
          <label htmlFor="elderly-mode-home">{t('home.elderlyMode')}</label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              id="elderly-mode-home"
              checked={isElderlyMode}
              onChange={() => setIsElderlyMode(!isElderlyMode)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      <div className="sos-panel">
        <button
          className={`sos-button ${sosCountdown !== null ? 'sos-pending' : ''}`}
          aria-label="Activate SOS"
          onClick={sosCountdown !== null ? handleCancelSos : handleStartSos}
        >
          {sosCountdown !== null ? (
            <>
              {t('home.cancel')}
              <span className="sos-timer">{sosCountdown}</span>
            </>
          ) : (
            t('home.sos')
          )}
        </button>
        <p className={`status-label ${isSosActive ? 'status-active' : ''}`}>
          {isSosActive ? t('home.statusActive') : t('home.statusSafe')}
        </p>
      </div>

      <div className="companion-panel">
        <h2>{t('home.companionMode')}</h2>
        <p>{t('home.status')} <strong>{companionSession.isActive ? t('home.active') : t('home.inactive')}</strong></p>
        
        {companionSession.isActive && (
          <div className="companion-active-details">
            <div className="timer">{formatTime(timeLeft)}</div>
            <p>{t('home.sharingWith')} <strong>{companionSession.sharedWith.join(', ')}</strong></p>
            {isMapScriptLoaded && currentPosition ? (
                <MapView center={currentPosition} />
            ) : (
                <div className="map-placeholder">{t('home.mapLoading')}</div>
            )}
             <button type="button" className="btn btn-secondary" onClick={stopCompanionMode}>{t('home.stopSharing')}</button>
          </div>
        )}
      </div>

      {isSosActive && (
        <div className="mark-safe-container">
            <button className="btn btn-primary" onClick={handleMarkSafe}>
                {t('home.markSafe')}
            </button>
        </div>
      )}
    </div>
  );
};


const ContactsScreen = ({ contacts, handleContactChange, addContact, removeContact }) => {
    const { t } = useLocalization();
    return (
        <div className="page-content">
            <div className="header">
                <h1>{t('contacts.title')}</h1>
            </div>
             <div className="section-header" style={{marginTop: 0}}>
              <p>{t('contacts.description')}</p>
              <button type="button" className="btn btn-secondary" onClick={addContact}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                {t('contacts.addContact')}
              </button>
            </div>
            {contacts.map((contact, index) => (
              <div key={contact.id} className="contact-item">
                <div className="contact-header">
                  <h3>{t('contacts.contactNum')}{index + 1}</h3>
                  <button type="button" className="btn btn-danger" onClick={() => removeContact(contact.id)} aria-label={`${t('contacts.remove')} ${index + 1}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </button>
                </div>
                <div className="form-group">
                  <label htmlFor={`contact-name-${contact.id}`}>{t('contacts.fullName')}</label>
                  <input type="text" id={`contact-name-${contact.id}`} name="name" value={contact.name} onChange={(e) => handleContactChange(contact.id, e)} required />
                </div>
                <div className="form-group">
                  <label htmlFor={`contact-phone-${contact.id}`}>{t('contacts.phone')}</label>
                  <input type="tel" id={`contact-phone-${contact.id}`} name="phone" value={contact.phone} onChange={(e) => handleContactChange(contact.id, e)} required />
                </div>
                <div className="form-group">
                  <label htmlFor={`contact-email-${contact.id}`}>{t('contacts.email')}</label>
                  <input type="email" id={`contact-email-${contact.id}`} name="email" value={contact.email} onChange={(e) => handleContactChange(contact.id, e)} required />
                </div>
              </div>
            ))}
        </div>
    );
}

const HistoryScreen = () => {
    const { t } = useLocalization();
    return (
        <div className="page-content">
            <div className="header">
                <h1>{t('history.title')}</h1>
            </div>
            <p>{t('history.description')}</p>
        </div>
    );
}

const CameraView = ({ onCapture, onClose }) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const { t } = useLocalization();

    useEffect(() => {
        const openCamera = async () => {
            try {
                streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = streamRef.current;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert(t('camera.error'));
                onClose();
            }
        };
        openCamera();
        
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [onClose, t]);

    const handleCapture = () => {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
    };

    return (
        <div className="camera-overlay">
            <video ref={videoRef} autoPlay playsInline className="camera-video"></video>
            <div className="camera-controls">
                <button type="button" className="btn btn-secondary" onClick={onClose}>{t('camera.cancel')}</button>
                <button type="button" className="btn btn-primary" onClick={handleCapture}>{t('camera.capture')}</button>
            </div>
        </div>
    );
};

const ShareModal = ({ user, onClose }) => {
    const profileLink = `guardianlink.app/profile/${user.name.toLowerCase().replace(/\s+/g, '')}`;
    const [copied, setCopied] = useState(false);
    const { t } = useLocalization();

    const handleCopy = () => {
        navigator.clipboard.writeText(profileLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${user.name}'s ${t('appName')} Profile`,
                    text: `Check out my profile on ${t('appName')}.`,
                    url: `https://${profileLink}`,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            alert(t('shareModal.error'));
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('shareModal.title')}</h2>
                    <button onClick={onClose} className="close-btn" aria-label="Close">&times;</button>
                </div>
                <div className="modal-body">
                    <p>{t('shareModal.description')}</p>
                    <div className="share-link-container">
                        <input type="text" value={profileLink} readOnly />
                        <button className="btn btn-secondary" onClick={handleCopy}>
                            {copied ? t('shareModal.copied') : t('shareModal.copy')}
                        </button>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={handleShare}>
                        {t('shareModal.shareVia')}
                    </button>
                </div>
            </div>
        </div>
    );
};


const StatusEditModal = ({ currentStatus, onClose, onSave }) => {
    const { t } = useLocalization();
    const [emoji, setEmoji] = useState(currentStatus?.emoji || '😊');
    const [text, setText] = useState(currentStatus?.text || '');

    const handleSave = () => {
        onSave({ emoji, text });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('statusModal.title')}</h2>
                    <button onClick={onClose} className="close-btn" aria-label={t('companionModal.close')}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                         <label htmlFor="status-emoji">{t('statusModal.emojiLabel')}</label>
                         <input
                            id="status-emoji"
                            type="text"
                            value={emoji}
                            onChange={(e) => setEmoji(e.target.value)}
                            maxLength="2"
                            className="emoji-input"
                         />
                    </div>
                    <div className="form-group">
                         <label htmlFor="status-text">{t('statusModal.textLabel')}</label>
                         <input
                            id="status-text"
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={t('profile.setStatus')}
                         />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>{t('statusModal.cancel')}</button>
                    <button type="button" className="btn btn-primary" onClick={handleSave}>
                        {t('statusModal.save')}
                    </button>
                </div>
            </div>
        </div>
    );
};


const SettingsScreen = ({ 
    onBack, onSignOut, settings, setSettings, user, handleUserChange, 
    handleSubmit, profileImage, setProfileImage, setIsCameraOpen, 
    passwords, handlePasswordChange, showToast
}) => {
    const fileInputRef = useRef(null);
    const { t, setLanguage, language } = useLocalization();
    
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleThemeChange = (theme) => {
        setSettings(prev => ({ ...prev, theme }));
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        const selectedLang = languages.find(l => l.code === newLang);
        showToast(`${t('settings.langChanged')}${selectedLang.name}`);
    };

    const handleNotificationToggle = (key) => {
        setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: !prev.notifications[key] }
        }));
    };
    
    const handleSignOut = () => {
        if (confirm(t('settings.signOutConfirm'))) {
            onSignOut();
        }
    };

    return (
        <div className="page-content settings-screen">
             <div className="header settings-header">
                <button onClick={onBack} className="icon-btn back-btn" aria-label={t('settings.back')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <h1>{t('settings.title')}</h1>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="settings-section">
                    <h2>{t('settings.profile')}</h2>
                    <div className="profile-image-section">
                        <div className="profile-image-preview" style={{ backgroundImage: `url(${profileImage})` }}>
                            {!profileImage && 
                              <div className="avatar-placeholder-large">
                                <svg width="80" height="80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="8" y="8" width="8" height="8" fill="white"/>
                                  <rect x="24" y="8" width="8" height="8" fill="white"/>
                                  <rect x="8" y="24" width="24" height="8" fill="white"/>
                                </svg>
                              </div>
                            }
                        </div>
                        <div className="image-actions">
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                            <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current.click()}>{t('settings.upload')}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setIsCameraOpen(true)}>{t('settings.camera')}</button>
                        </div>
                    </div>
                     <div className="form-group">
                      <label htmlFor="name">{t('settings.username')}</label>
                      <input type="text" id="name" name="name" value={user.name} onChange={handleUserChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">{t('settings.email')}</label>
                      <input type="email" id="email" name="email" value={user.email} onChange={handleUserChange} required />
                    </div>
                     <div className="form-group">
                      <label htmlFor="safeword">{t('settings.safeword')}</label>
                      <input type="password" id="safeword" name="safeword" value={user.safeword} onChange={handleUserChange} placeholder={t('settings.safewordPlaceholder')} />
                    </div>
                </div>

                <div className="settings-section">
                    <h2>{t('settings.changePass')}</h2>
                    <div className="form-group">
                        <label htmlFor="current-password">{t('settings.currentPass')}</label>
                        <input type="password" id="current-password" name="current" value={passwords.current} onChange={handlePasswordChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="new-password">{t('settings.newPass')}</label>
                        <input type="password" id="new-password" name="new" value={passwords.new} onChange={handlePasswordChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">{t('settings.confirmPass')}</label>
                        <input type="password" id="confirm-password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} />
                    </div>
                </div>

                <div className="settings-section">
                    <h2>{t('settings.appearance')}</h2>
                    <div className="theme-options">
                        {[
                            { key: 'light', label: t('settings.light') }, 
                            { key: 'dark', label: t('settings.dark') }, 
                            { key: 'automatic', label: t('settings.automatic') }
                        ].map(theme => (
                            <button key={theme.key} type="button" className={`btn ${settings.theme === theme.key ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleThemeChange(theme.key)}>
                                {theme.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                 <div className="settings-section">
                    <h2>{t('settings.language')}</h2>
                    <div className="form-group">
                        <select id="language" value={language} onChange={handleLanguageChange} className="settings-select">
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>{t('settings.notifications')}</h2>
                    <div className="notification-options">
                        <div className="form-group toggle-group">
                            <div className="toggle-label">
                                <label htmlFor="sos-alerts">{t('settings.sosAlerts')}</label>
                                <p className="setting-description">{t('settings.sosAlertsDesc')}</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" id="sos-alerts" checked={settings.notifications.sos} onChange={() => handleNotificationToggle('sos')} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="form-group toggle-group">
                             <div className="toggle-label">
                                <label htmlFor="companion-updates">{t('settings.companionUpdates')}</label>
                                <p className="setting-description">{t('settings.companionUpdatesDesc')}</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" id="companion-updates" checked={settings.notifications.companion} onChange={() => handleNotificationToggle('companion')} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="form-group toggle-group">
                            <div className="toggle-label">
                                <label htmlFor="status-updates">{t('settings.statusUpdates')}</label>
                                <p className="setting-description">{t('settings.statusUpdatesDesc')}</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" id="status-updates" checked={settings.notifications.status} onChange={() => handleNotificationToggle('status')} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="footer">
                    <button type="submit" className="btn btn-primary">{t('settings.save')}</button>
                </div>
            </form>
            <div className="settings-footer">
                <button className="btn btn-danger sign-out-btn" onClick={handleSignOut}>{t('settings.signOut')}</button>
            </div>
        </div>
    );
};

const ProfileImageModal = ({ user, profileImage, onClose }) => {
    const { t } = useLocalization();

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="image-modal-close-btn" aria-label={t('companionModal.close')}>
                    &times;
                </button>
                <div className="enlarged-profile-image" style={{ backgroundImage: `url(${profileImage})` }}>
                     {!profileImage && 
                        <div className="avatar-placeholder-large">
                            <svg width="80" height="80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="8" y="8" width="8" height="8" fill="white"/>
                                <rect x="24" y="8" width="8" height="8" fill="white"/>
                                <rect x="8" y="24" width="24" height="8" fill="white"/>
                            </svg>
                        </div>
                     }
                </div>
                <div className="image-modal-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                </div>
            </div>
        </div>
    );
};


const ProfileScreen = ({ user, profileImage, onNavigateToSettings, onStatusUpdate }) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const { t } = useLocalization();

    return (
        <div className="page-content profile-screen">
             <div className="profile-header">
                <div className="profile-header-actions">
                    <button className="icon-btn" onClick={onNavigateToSettings} aria-label={t('profile.settings')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </button>
                     <button className="icon-btn" onClick={() => setIsShareModalOpen(true)} aria-label={t('profile.share')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                    </button>
                </div>
            </div>

            <div className="profile-main-info">
                 <button className="profile-avatar-btn" onClick={() => setIsImageModalVisible(true)} aria-label={t('profile.viewPicture')}>
                    <div className="profile-avatar" style={{backgroundImage: `url(${profileImage})`}}>
                      {!profileImage && 
                        <div className="avatar-placeholder">
                          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="8" width="8" height="8" fill="white"/>
                            <rect x="24" y="8" width="8" height="8" fill="white"/>
                            <rect x="8" y="24" width="24" height="8" fill="white"/>
                          </svg>
                        </div>
                      }
                    </div>
                </button>
                <span className="profile-username">{user.name}</span>
            </div>

            <button className="status-bar" onClick={() => setIsStatusModalOpen(true)}>
                <span className="status-emoji">{user.status?.emoji || '😊'}</span>
                <span className="status-text">{user.status?.text || t('profile.setStatus')}</span>
                <span className="status-edit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/></svg>
                </span>
            </button>
            {isShareModalOpen && <ShareModal user={user} onClose={() => setIsShareModalOpen(false)} />}
            {isStatusModalOpen && (
              <StatusEditModal
                currentStatus={user.status}
                onClose={() => setIsStatusModalOpen(false)}
                onSave={(newStatus) => {
                  onStatusUpdate(newStatus);
                  setIsStatusModalOpen(false);
                }}
              />
            )}
            {isImageModalVisible && (
              <ProfileImageModal
                user={user}
                profileImage={profileImage}
                onClose={() => setIsImageModalVisible(false)}
              />
            )}
        </div>
    );
};

const BottomNavBar = ({ activeTab, setActiveTab }) => {
    const { t } = useLocalization();
    const navItems = [
        { id: 'home', label: t('nav.home'), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
        { id: 'contacts', label: t('nav.contacts'), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><circle cx="12" cy="10" r="2"></circle><line x1="8" x2="8" y1="2" y2="4"></line><line x1="16" x2="16" y1="2" y2="4"></line></svg> },
        { id: 'history', label: t('nav.history'), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M12 8v4l2 2"></path></svg> },
        { id: 'profile', label: t('nav.profile'), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg> },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                <button
                    key={item.id}
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                    aria-label={item.label}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="toast-notification">
            <p>{message}</p>
            <button onClick={onClose}>&times;</button>
        </div>
    );
};

const App = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState({
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    safeword: '',
    status: { emoji: '😊', text: '' }
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [contacts, setContacts] = useState([
    { id: 1, name: 'Jane Smith', phone: '555-123-4567', email: 'jane.s@example.com' },
  ]);

  const [isElderlyMode, setIsElderlyMode] = useState(false);
  const [companionSession, setCompanionSession] = useState({
    isActive: false,
    sharedWith: [],
    endTime: null,
  });
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false);
  const watchIdRef = useRef(null);

  const [isSosActive, setIsSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(null);
  const countdownTimerRef = useRef(null);
  const sosActivationTimeoutRef = useRef(null);
  
  const [toastMessage, setToastMessage] = useState('');

  const [profileSubScreen, setProfileSubScreen] = useState('main');
  const [settings, setSettings] = useState({
      theme: 'automatic',
      notifications: {
          sos: true,
          companion: true,
          status: true,
      }
  });

  const { t } = useLocalization();

  useEffect(() => {
    const applyTheme = (theme) => {
      document.body.classList.remove('light-mode', 'dark-mode');
      if (theme !== 'automatic') {
        document.body.classList.add(`${theme}-mode`);
      }
    };
  
    if (settings.theme === 'automatic') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      const handleChange = () => {
        applyTheme(mediaQuery.matches ? 'light' : 'dark');
      };
      mediaQuery.addEventListener('change', handleChange);
      handleChange(); 
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(settings.theme);
    }
  }, [settings.theme]);


  useEffect(() => {
    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId) || window.google) {
      setIsMapScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&v=beta`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsMapScriptLoaded(true);
    script.onerror = () => console.error("Failed to load Google Maps script.");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (companionSession.isActive && companionSession.endTime) {
        const updateTimer = () => {
            const now = Date.now();
            const remaining = Math.round((companionSession.endTime - now) / 1000);
            if (remaining > 0) {
                setTimeLeft(remaining);
            } else {
                setTimeLeft(0);
                stopCompanionMode();
            }
        };

        const intervalId = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(intervalId);
    }
  }, [companionSession.isActive, companionSession.endTime]);


  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };
  
  const handlePasswordChange = (e) => {
      const { name, value } = e.target;
      setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (id, e) => {
    const { name, value } = e.target;
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === id ? { ...contact, [name]: value } : contact
      )
    );
  };

  const addContact = () => {
    const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    setContacts([...contacts, { id: newId, name: '', phone: '', email: '' }]);
  };

  const removeContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleStatusUpdate = (newStatus) => {
    setUser(prev => ({...prev, status: newStatus}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Settings Submitted");
    console.log("User Data:", user);
    console.log("Settings:", settings);
    showToast(t('settings.saveSuccess'));
    setProfileSubScreen('main');
  };
  
  const handleStartCompanionMode = (selectedContactIds, durationInMinutes) => {
    navigator.geolocation.getCurrentPosition(position => {
        const durationInSeconds = durationInMinutes * 60;
        const endTime = Date.now() + durationInSeconds * 1000;
        
        const sharedWithNames = contacts
            .filter(c => selectedContactIds.includes(c.id))
            .map(c => c.name);

        setCompanionSession({
            isActive: true,
            sharedWith: sharedWithNames,
            endTime: endTime,
        });

        setTimeLeft(durationInSeconds);
        
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCurrentPosition(coords);

        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
            (newPosition) => {
                setCurrentPosition({
                    lat: newPosition.coords.latitude,
                    lng: newPosition.coords.longitude,
                });
            },
            (error) => {
                console.error("Geolocation watch error:", error);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

    }, (error) => {
        console.error("Geolocation error:", error);
        alert("Could not get your location. Please enable location services and try again.");
    });
  };

  const stopCompanionMode = () => {
    if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
    }
    setCurrentPosition(null);
    setCompanionSession({
        isActive: false,
        sharedWith: [],
        endTime: null,
    });
    setTimeLeft(0);
    console.log('Companion Mode stopped.');
  };

  const handleStartSos = () => {
    setSosCountdown(5);
    countdownTimerRef.current = setInterval(() => {
        setSosCountdown(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    sosActivationTimeoutRef.current = setTimeout(() => {
        clearInterval(countdownTimerRef.current);
        setSosCountdown(null);
        setIsSosActive(true);
        // Automatically start companion mode with all contacts for 1 hour
        const allContactIds = contacts.map(c => c.id);
        if(allContactIds.length > 0) {
            handleStartCompanionMode(allContactIds, 60);
        }
        document.body.classList.add('sos-flash');
        setTimeout(() => document.body.classList.remove('sos-flash'), 500);
    }, 5000);
  };

  const handleCancelSos = () => {
      clearInterval(countdownTimerRef.current);
      clearTimeout(sosActivationTimeoutRef.current);
      setSosCountdown(null);
  };

  const handleMarkSafe = () => {
      setIsSosActive(false);
      stopCompanionMode();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  
  const handleCapturePhoto = (imageDataUrl) => {
      setProfileImage(imageDataUrl);
      setIsCameraOpen(false);
  }
  
  const showToast = (message) => {
    setToastMessage(message);
  }

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'contacts':
        return <ContactsScreen 
                contacts={contacts}
                handleContactChange={handleContactChange}
                addContact={addContact}
                removeContact={removeContact}
                />;
      case 'history':
        return <HistoryScreen />;
      case 'profile':
        if (profileSubScreen === 'settings') {
            return <SettingsScreen 
                onBack={() => setProfileSubScreen('main')}
                onSignOut={onSignOut}
                settings={settings}
                setSettings={setSettings}
                user={user}
                handleUserChange={handleUserChange}
                handleSubmit={handleSubmit}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                setIsCameraOpen={setIsCameraOpen}
                passwords={passwords}
                handlePasswordChange={handlePasswordChange}
                showToast={showToast}
            />;
        }
        return <ProfileScreen 
                user={user}
                profileImage={profileImage}
                onNavigateToSettings={() => setProfileSubScreen('settings')}
                onStatusUpdate={handleStatusUpdate}
                />;
      case 'home':
      default:
        return <HomeScreen 
                isElderlyMode={isElderlyMode}
                setIsElderlyMode={setIsElderlyMode}
                isSosActive={isSosActive}
                companionSession={companionSession}
                handleStartSos={handleStartSos}
                handleCancelSos={handleCancelSos}
                handleMarkSafe={handleMarkSafe}
                sosCountdown={sosCountdown}
                timeLeft={timeLeft}
                formatTime={formatTime}
                isMapScriptLoaded={isMapScriptLoaded}
                currentPosition={currentPosition}
                stopCompanionMode={stopCompanionMode}
                />;
    }
  };

  return (
    <>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
      <div className={`container ${isElderlyMode ? 'elderly-mode' : ''}`}>
        {renderActiveTab()}
      </div>
      {isCameraOpen && <CameraView onCapture={handleCapturePhoto} onClose={() => setIsCameraOpen(false)} />}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
};

const GuardianLinkApp = () => {
    const [authStatus, setAuthStatus] = useState({ isAuthenticated: false, screen: 'landing' }); // 'landing', 'signIn', 'signUp'

    const handleLogin = () => {
        setAuthStatus({ isAuthenticated: true, screen: 'landing' });
    };

    const handleSignOut = () => {
        setAuthStatus({ isAuthenticated: false, screen: 'signIn' });
    };

    if (!authStatus.isAuthenticated) {
        switch (authStatus.screen) {
            case 'signIn':
                return <SignInScreen 
                    onLogin={handleLogin} 
                    onNavigateToSignUp={() => setAuthStatus(prev => ({ ...prev, screen: 'signUp' }))} 
                />;
            case 'signUp':
                return <SignUpScreen 
                    onLogin={handleLogin} 
                    onNavigateToSignIn={() => setAuthStatus(prev => ({ ...prev, screen: 'signIn' }))} 
                />;
            case 'landing':
            default:
                return <LandingScreen 
                    onNavigateToSignIn={() => setAuthStatus(prev => ({ ...prev, screen: 'signIn' }))}
                    onNavigateToSignUp={() => setAuthStatus(prev => ({ ...prev, screen: 'signUp' }))}
                />;
        }
    }

    return <App onSignOut={handleSignOut} />;
};


const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <LocalizationProvider>
        <GuardianLinkApp />
    </LocalizationProvider>
);