import type * as monaco from 'monaco-editor'; // optional, for stronger typings
import { Language, EditorTheme } from '../types';

export const DEFAULT_CODE: Record<string, string> = {
    typescript: `console.log("Welcome to NeoRun");`,
    javascript: `console.log("Welcome to NeoRun");`,
    python: `print("Welcome to NeoRun")`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to NeoRun");
    }
}`,
    go: `package main

import "fmt"

func main() {
    fmt.Println("Welcome to NeoRun")
}`,
    rust: `fn main() {
    println!("Welcome to NeoRun");
}`,
    ruby: `puts "Welcome to NeoRun"`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to NeoRun";
    return 0;
}`,
    c: `#include <stdio.h>

int main() {
    printf("Welcome to NeoRun\\n");
    return 0;
}`
};

export const SUPPORTED_LANGUAGES: Language[] = [
    { id: 'java', name: 'Java', extension: 'java', version: '15.0.2' },
    { id: 'cpp', name: 'C++', extension: 'cpp', version: '10.2.0' },
    { id: 'c', name: 'C', extension: 'c', version: '10.2.0' },
    { id: 'python', name: 'Python', extension: 'py', version: '3.10.0' },
    { id: 'javascript', name: 'JavaScript', extension: 'js', version: '18.15.0' },
    { id: 'typescript', name: 'TypeScript', extension: 'ts', version: '5.0.3' },
    { id: 'go', name: 'Go', extension: 'go', version: '1.16.2' },
    { id: 'rust', name: 'Rust', extension: 'rs', version: '1.68.2' },
    { id: 'ruby', name: 'Ruby', extension: 'rb', version: '3.0.1' }
];

export const EDITOR_THEMES: EditorTheme[] = [
    { id: 'neo-dark', name: 'Neo Dark', theme: 'neo-dark' },
    { id: 'github-dark', name: 'GitHub Dark', theme: 'github-dark' },
    { id: 'vs-dark', name: 'VS Code Dark', theme: 'vs-dark' },
    { id: 'dracula', name: 'Dracula Dark', theme: 'dracula' },
    { id: 'night-owl', name: 'Night Owl', theme: 'night-owl' },
    { id: 'hc-black', name: 'High Contrast Dark', theme: 'hc-black' },
    { id: 'vs-light', name: 'VS Code Light', theme: 'light' },
    { id: 'hc-light', name: 'High Contrast Light', theme: 'hc-light' },
];

export const EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on',
    formatOnPaste: true,
    formatOnType: true,
    cursorBlinking: 'phase',
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
};