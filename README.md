# 📱 Trivia Quiz App - Ionic Angular

Aplicación híbrida de trivia/quiz desarrollada con **Ionic 8** y **Angular 20** para la **ACTIVIDAD 2 - TEMA 5** del módulo DAM.

## 🎯 Características

### Funcionalidades Principales
- **5 Tabs visibles** (Home, Buscar, Favoritos, Estadísticas, Perfil)
- **2 Páginas adicionales** fuera de tabs (Detalle, Configuración)
- **Consumo de API externa** (Open Trivia Database)
- **Gestión de estado** con BehaviorSubject y localStorage
- **Pruebas unitarias/integración** con Karma + Jasmine (20+)
- **Pruebas E2E** con Cypress (4 suites)

### API Utilizada
**Open Trivia Database** - https://opentdb.com
- Gratuita, sin necesidad de API key
- +4000 preguntas verificadas
- Categorías, dificultades y tipos de preguntas

## 🏗️ Estructura del Proyecto

```
src/app/
├── core/
│   ├── models/
│   │   └── trivia.model.ts      # Interfaces y tipos
│   └── services/
│       ├── api.service.ts        # Llamadas HTTP a la API
│       ├── favorites.store.ts    # Estado de favoritos (BehaviorSubject)
│       ├── stats.service.ts      # Estadísticas y resultados
│       ├── settings.service.ts   # Configuración de usuario
│       └── quiz.service.ts       # Estado del quiz activo
├── pages/
│   ├── home/                     # Tab 1: Página principal
│   ├── search/                   # Tab 2: Buscar y jugar quiz
│   ├── favorites/                # Tab 3: Preguntas favoritas
│   ├── stats/                    # Tab 4: Estadísticas
│   ├── profile/                  # Tab 5: Perfil de usuario
│   ├── detail/                   # Página extra: Detalle de resultado
│   └── settings/                 # Página extra: Configuración
├── tabs/
│   ├── tabs.page.*               # Componente de navegación
│   └── tabs.routes.ts            # Rutas de tabs
└── app.routes.ts                 # Rutas principales
```

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js 18+ 
- npm 9+
- Angular CLI 20

### Pasos de Instalación

```bash
# 1. Clonar o descargar el proyecto
cd lgomdom-dam-tabs-app

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm start
# La app estará disponible en http://localhost:4200
```

## 🧪 Pruebas

### Pruebas Unitarias y de Integración (Karma + Jasmine)

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con cobertura
npm run test:coverage
```

**Suites de pruebas incluidas:**
- `api.service.spec.ts` - Pruebas del servicio HTTP
- `favorites.store.spec.ts` - Pruebas del store de favoritos
- `stats.service.spec.ts` - Pruebas del servicio de estadísticas
- `settings.service.spec.ts` - Pruebas del servicio de configuración
- `quiz.service.spec.ts` - Pruebas del servicio de quiz
- `home.page.spec.ts` - Pruebas de la página home
- `search.page.spec.ts` - Pruebas de la página de búsqueda
- `favorites.page.spec.ts` - Pruebas de la página de favoritos
- `stats.page.spec.ts` - Pruebas de la página de estadísticas
- `profile.page.spec.ts` - Pruebas de la página de perfil
- `tabs.page.spec.ts` - Pruebas del componente tabs
- `detail.page.spec.ts` - Pruebas de la página de detalle
- `settings.page.spec.ts` - Pruebas de la página de configuración

**Total: 60+ pruebas unitarias/integración**

### Pruebas E2E (Cypress)

```bash
# Instalar Cypress (primera vez)
npm install cypress --save-dev

# Ejecutar pruebas E2E en modo headless
npm run e2e

# Abrir Cypress en modo interactivo
npm run e2e:open
```

**Suites E2E incluidas:**
- `tabs-navigation.cy.ts` - Navegación entre tabs
- `quiz-flow.cy.ts` - Flujo completo del quiz
- `favorites-management.cy.ts` - Gestión de favoritos
- `profile-settings.cy.ts` - Perfil y configuración

**Total: 4 suites E2E con 25+ tests**

## 📱 Despliegue Móvil (Capacitor)

### Android

```bash
# Añadir plataforma Android
npx cap add android

# Sincronizar archivos
npm run build
npx cap sync

# Abrir en Android Studio
npx cap open android
```

### iOS (solo macOS)

```bash
# Añadir plataforma iOS
npx cap add ios

# Sincronizar archivos
npm run build
npx cap sync

# Abrir en Xcode
npx cap open ios
```

## 🔧 Servicios Implementados

### ApiService
- `getCategories()` - Obtiene categorías de trivia
- `getQuestions()` - Obtiene preguntas con filtros

### FavoritesStore  
- `add()` - Añade pregunta a favoritos
- `remove()` - Elimina de favoritos
- `exists()` - Verifica si existe
- `clear()` - Limpia todos los favoritos

### StatsService
- `addResult()` - Guarda resultado de quiz
- `calculateStats()` - Calcula estadísticas
- `clearStats()` - Limpia historial

### SettingsService
- `updateSettings()` - Actualiza configuración
- `resetToDefault()` - Restaura valores por defecto
- `applyDarkMode()` - Aplica tema oscuro

### QuizService
- `startQuiz()` - Inicia nuevo quiz
- `answerQuestion()` - Registra respuesta
- `nextQuestion()` / `previousQuestion()` - Navegación
- `finishQuiz()` - Finaliza y calcula resultados

## 📚 Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Ionic | 8.0.0 | Framework UI híbrido |
| Angular | 20.0.0 | Framework frontend |
| Capacitor | 8.0.2 | Runtime nativo |
| RxJS | 7.8.0 | Programación reactiva |
| Karma | 6.4.0 | Test runner |
| Jasmine | 5.1.0 | Framework de testing |
| Cypress | 13.6.0 | E2E testing |
| TypeScript | 5.9.0 | Lenguaje |

## 👤 Autor

**Nombre del Estudiante** - ACTIVIDAD 2 - TEMA 5 DAM

## 📝 Licencia

Este proyecto es parte de una actividad académica.
