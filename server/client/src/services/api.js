import axios from 'axios';

// Define a URL base do seu servidor backend
const API_URL = 'http://localhost:5000/api';

/**
 * Envia a URL para o servidor iniciar o scraping e a filtragem
 * @param {string} targetUrl - A URL do site que queremos puxar
 */
export const startExtraction = async (targetUrl) => {
    try {
        const response = await axios.post(`${API_URL}/extract`, {
            url: targetUrl
        });
        return response.data; // Retorna { success, data: { id, files, title } }
    } catch (error) {
        console.error("Erro na extração:", error.response?.data || error.message);
        throw error.response?.data || new Error("Erro ao conectar com o servidor");
    }
};

/**
 * Busca o conteúdo de um arquivo específico dentro de um projeto extraído
 * @param {string} storageId - O ID da pasta gerado pelo servidor
 * @param {string} filePath - O caminho relativo do arquivo (ex: 'js/script.js')
 */
export const getFileContent = async (storageId, filePath) => {
    try {
        const response = await axios.get(`${API_URL}/file-content`, {
            params: {
                storageId,
                filePath
            }
        });
        return response.data.content; // Retorna o texto bruto do código
    } catch (error) {
        console.error("Erro ao buscar conteúdo do arquivo:", error.message);
        throw error;
    }
};

/**
 * Função utilitária para formatar a árvore de arquivos para o componente Sidebar
 * (Resolve o bug de visualização de listas planas transformando-as em objetos)
 */
export const parseFileTree = (files) => {
    const tree = {};
    files.forEach(file => {
        const parts = file.split(window.navigator.platform.includes('Win') ? '\\' : '/');
        let current = tree;
        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = index === parts.length - 1 ? 'file' : {};
            }
            current = current[part];
        });
    });
    return tree;
};

export default {
    startExtraction,
    getFileContent,
    parseFileTree
};
