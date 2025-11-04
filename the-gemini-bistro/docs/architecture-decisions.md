# Architectural Decision Record (ADR)

This document outlines the key architectural decisions made for The Gemini Bistro's website MVP.

---

### **ADR-001: Frontend Framework Selection**

- **Decision:** Use **React** as the primary frontend library.
- **Reasoning:**
    - **Component-Based Architecture:** Allows for the creation of reusable UI components, making the codebase modular, easier to manage, and scalable.
    - **Strong Ecosystem:** React has a vast ecosystem of libraries, tools, and community support, which accelerates development.
    - **Performance:** Its virtual DOM implementation provides efficient UI updates, leading to a smooth user experience.
    - **Developer Experience:** The declarative syntax and tools like hot-reloading improve developer productivity.

---

### **ADR-002: Language Choice**

- **Decision:** Use **TypeScript** for all frontend code.
- **Reasoning:**
    - **Type Safety:** Catches common errors during development rather than at runtime, leading to more robust code.
    - **Improved Code Quality:** Enforces clearer contracts between components and data structures, making the code easier to read, refactor, and maintain.
    - **Enhanced Developer Tools:** Provides excellent autocompletion, navigation, and refactoring capabilities in modern code editors.

---

### **ADR-003: Styling Approach**

- **Decision:** Use **Tailwind CSS** for styling.
- **Reasoning:**
    - **Rapid Prototyping:** The utility-first approach allows for building custom designs quickly without writing custom CSS files.
    - **Consistency:** Promotes a consistent design system by using a predefined set of spacing, color, and typography utilities.
    - **Responsive Design:** Includes intuitive and powerful utilities for building responsive layouts that work across all screen sizes.
    - **Performance:** By purging unused classes, it produces a highly optimized, small CSS file for production.

---

### **ADR-004: AI Integration**

- **Decision:** Integrate the **Google Gemini API** (`@google/genai` library) for the AI chatbot.
- **Reasoning:**
    - **Advanced Capabilities:** Gemini provides powerful, context-aware conversational AI that can understand and respond to user queries naturally. `gemini-2.5-flash` is selected as a fast and capable model for this use case.
    - **Contextual Awareness:** The API's system instruction feature allows us to provide the entire restaurant menu as context, ensuring the AI's responses are accurate and confined to the restaurant's offerings.
    - **Ease of Integration:** The official JavaScript SDK is straightforward to use within our React application.

---

### **ADR-005: State Management**

- **Decision:** Use built-in **React Hooks** (`useState`, `useEffect`, `useRef`) for state management.
- **Reasoning:**
    - **Simplicity:** For the scope of the MVP, component-level state is sufficient. This avoids the overhead and complexity of introducing external state management libraries like Redux or Zustand.
    - **Sufficiency:** The application's state is not deeply nested or shared across many distant components, making hooks a perfect fit. Page navigation state is managed in the top-level `App` component and passed down via props.

---

### **ADR-006: Project Structure**

- **Decision:** Organize the project by feature/domain into a component-based structure.
- **Reasoning:**
    - **Separation of Concerns:** Code is organized into logical directories (`components`, `services`, `types`, etc.), making it easy to locate and work with files.
    - **Reusability:** Common UI elements (like `Header`, `Footer`, `MenuCard`) are built as reusable components.
    - **Scalability:** This structure can easily accommodate new features and pages as the application grows.

---

### **ADR-007: Backend and Data Handling**

- **Decision:** No dedicated backend for the MVP. Menu data is stored in a client-side constant file.
- **Reasoning:**
    - **MVP Focus:** The goal is to quickly build and deploy a functional frontend. A backend would add significant complexity and development time.
    - **Simplicity:** Storing static data like the menu in `constants.ts` is simple and effective for the current requirements.
    - **Future-Proofing:** The reservation form is built to be easily adaptable. The `handleSubmit` function can be modified in the future to send a request to a backend API without changing the UI.
