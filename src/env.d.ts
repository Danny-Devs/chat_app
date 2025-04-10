// This triple-slash directive tells TypeScript "hey, go look at Vite's built-in type definitions"
// It's like an import but for type information only
/// <reference types="vite/client" />

// We MUST use these exact names (ImportMetaEnv and ImportMeta) because Vite expects them
// Think of these as templates that TypeScript uses to check our code

// This defines the structure of our environment variables
// Like a blueprint saying "here are the env variables we're using"
interface ImportMetaEnv {
  readonly VITE_API_URL: string; // matches our .env file
}

// This connects our env variables to Vite's import.meta.env
// When we type import.meta.env in our code, it will know about VITE_API_URL
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
