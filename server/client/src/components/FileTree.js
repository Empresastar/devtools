import React from 'react';

/**
 * Componente de navegação de arquivos lateral
 * @param {Array} files - Lista de strings com os caminhos dos arquivos
 * @param {Function} onFileSelect - Função chamada ao clicar em um arquivo
 * @param {string} selectedFile - O arquivo que está aberto no momento
 */
const FileTree = ({ files, onFileSelect, selectedFile }) => {
  
  // Estilos básicos para simular o visual Dark do VS Code
  const treeStyle = {
    backgroundColor: '#252526',
    color: '#cccccc',
    height: '100%',
    width: '250px',
    overflowY: 'auto',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    fontSize: '13px',
    userSelect: 'none',
    borderRight: '1px solid #333'
  };

  const itemStyle = (isPathSelected) => ({
    padding: '4px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: isPathSelected ? '#37373d' : 'transparent',
    borderLeft: isPathSelected ? '2px solid #007acc' : '2px solid transparent',
  });

  // Ícones simples baseados na extensão (Resolvendo o bug visual de "tudo igual")
  const getIcon = (fileName) => {
    if (fileName.endsWith('.html')) return <span style={{ color: '#e34c26', marginRight: '8px' }}>HTML</span>;
    if (fileName.endsWith('.css')) return <span style={{ color: '#563d7c', marginRight: '8px' }}>CSS</span>;
    if (fileName.endsWith('.js')) return <span style={{ color: '#f1e05a', marginRight: '8px' }}>JS</span>;
    return <span style={{ color: '#858585', marginRight: '8px' }}>📄</span>;
  };

  return (
    <div style={treeStyle}>
      <div style={{ padding: '10px', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', color: '#858585' }}>
        EXPLORER: WEB-EXTRACTOR
      </div>
      
      {files && files.map((filePath) => {
        // Remove o ID do storage do nome exibido para ficar mais limpo
        const displayName = filePath.split('/').pop() || filePath.split('\\').pop();
        const isSelected = selectedFile === filePath;

        return (
          <div 
            key={filePath} 
            style={itemStyle(isSelected)}
            onClick={() => onFileSelect(filePath)}
            title={filePath}
          >
            {getIcon(displayName)}
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </span>
          </div>
        );
      })}

      {(!files || files.length === 0) && (
        <div style={{ padding: '20px', fontSize: '12px', fontStyle: 'italic', color: '#666' }}>
          Nenhuma URL processada ainda...
        </div>
      )}
    </div>
  );
};

export default FileTree;
