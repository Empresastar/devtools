import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

/**
 * Componente de Editor estilo VS Code
 * @param {string} code - O conteúdo do arquivo vindo do backend
 * @param {string} fileName - Nome do arquivo para definir a linguagem (ex: index.html)
 * @param {function} onChange - Função para capturar alterações no código
 */
const CodeEditor = ({ code, fileName, onChange }) => {
  const [language, setLanguage] = useState('javascript');

  // Lógica para detectar a linguagem baseada na extensão do arquivo
  useEffect(() => {
    if (!fileName) return;
    
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'html':
        setLanguage('html');
        break;
      case 'css':
        setLanguage('css');
        break;
      case 'js':
        setLanguage('javascript');
        break;
      case 'json':
        setLanguage('json');
        break;
      default:
        setLanguage('javascript');
    }
  }, [fileName]);

  // Configurações visuais do Monaco para parecer o VS Code (Tema Dark)
  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true, // Resolve o bug do editor não redimensionar com a janela
    fontSize: 14,
    minimap: { enabled: true }, // Aquele mapa pequeno na direita do VS Code
    scrollBeyondLastLine: false,
    theme: 'vs-dark',
  };

  return (
    <div style={{ height: '100%', width: '100%', borderLeft: '1px solid #333' }}>
      <Editor
        height="100vh"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={onChange}
        options={editorOptions}
        loading={<div style={{ color: '#fff', padding: '20px' }}>Carregando Editor...</div>}
      />
    </div>
  );
};

export default CodeEditor;
