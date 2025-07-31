// Sistema de Administração Visual
class AdminPanel {
  constructor() {
    this.currentSection = 'home';
    this.currentTab = null;
    this.changes = {};
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupTabs();
    this.setupFormHandlers();
    this.setupModals();
    this.setupToast();
    this.loadCurrentData();
  }

  // Navegação entre seções
  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.admin-section');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const sectionId = item.dataset.section;
        
        // Atualizar navegação ativa
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Mostrar seção correspondente
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(`section-${sectionId}`).classList.add('active');
        
        this.currentSection = sectionId;
      });
    });
  }

  // Sistema de tabs
  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        const parentSection = button.closest('.admin-section');
        
        // Atualizar tabs ativos na seção atual
        parentSection.querySelectorAll('.tab-btn').forEach(btn => 
          btn.classList.remove('active')
        );
        button.classList.add('active');
        
        // Mostrar conteúdo da tab
        parentSection.querySelectorAll('.tab-content').forEach(content => 
          content.classList.remove('active')
        );
        parentSection.querySelector(`#tab-${tabId}`).classList.add('active');
        
        this.currentTab = tabId;
      });
    });
  }

  // Manipuladores de formulário
  setupFormHandlers() {
    // Monitorar mudanças em todos os inputs
    const inputs = document.querySelectorAll('.form-input, .form-textarea, .color-picker');
    
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        this.trackChange(e.target);
        this.showUnsavedIndicator();
      });
    });

    // Botão de salvar
    document.getElementById('save-all-btn').addEventListener('click', () => {
      this.saveAllChanges();
    });

    // Color pickers
    const colorPickers = document.querySelectorAll('.color-picker');
    colorPickers.forEach(picker => {
      picker.addEventListener('change', (e) => {
        this.updateColorVariable(e.target);
      });
    });

    // Menu editor
    this.setupMenuEditor();
  }

  // Editor de menu
  setupMenuEditor() {
    const menuEditor = document.querySelector('.menu-editor');
    
    // Botão adicionar item
    const addButton = menuEditor.querySelector('.btn-secondary');
    addButton.addEventListener('click', () => {
      this.addMenuItem();
    });

    // Botões de remover
    menuEditor.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-danger')) {
        this.removeMenuItem(e.target.closest('.menu-item'));
      }
    });
  }

  // Adicionar item ao menu
  addMenuItem() {
    const menuEditor = document.querySelector('.menu-editor');
    const addButton = menuEditor.querySelector('.btn-secondary');
    
    const newItem = document.createElement('div');
    newItem.className = 'menu-item';
    newItem.innerHTML = `
      <input type="text" class="form-input" placeholder="Nome do menu">
      <button class="btn btn-small btn-danger">🗑️</button>
    `;
    
    menuEditor.insertBefore(newItem, addButton);
    
    // Focar no novo input
    newItem.querySelector('.form-input').focus();
    
    this.showToast('Item adicionado ao menu', 'success');
  }

  // Remover item do menu
  removeMenuItem(item) {
    if (confirm('Tem certeza que deseja remover este item do menu?')) {
      item.remove();
      this.showToast('Item removido do menu', 'success');
    }
  }

  // Rastrear mudanças
  trackChange(element) {
    const id = element.id || element.name || 'unnamed';
    this.changes[id] = {
      element: element,
      value: element.value,
      timestamp: Date.now()
    };
  }

  // Indicador de mudanças não salvas
  showUnsavedIndicator() {
    const saveButton = document.getElementById('save-all-btn');
    saveButton.textContent = '💾 Salvar Alterações *';
    saveButton.classList.add('btn-warning');
    saveButton.classList.remove('btn-primary');
  }

  // Salvar todas as mudanças
  saveAllChanges() {
    const saveButton = document.getElementById('save-all-btn');
    saveButton.textContent = '⏳ Salvando...';
    saveButton.disabled = true;

    // Simular salvamento (aqui você integraria com backend)
    setTimeout(() => {
      this.processChanges();
      
      saveButton.textContent = '💾 Salvar Alterações';
      saveButton.classList.remove('btn-warning');
      saveButton.classList.add('btn-primary');
      saveButton.disabled = false;
      
      this.changes = {};
      this.showToast('Alterações salvas com sucesso!', 'success');
    }, 1500);
  }

  // Processar mudanças
  processChanges() {
    Object.keys(this.changes).forEach(key => {
      const change = this.changes[key];
      console.log(`Salvando: ${key} = ${change.value}`);
      
      // Aqui você implementaria a lógica para:
      // 1. Atualizar arquivos HTML
      // 2. Salvar no banco de dados
      // 3. Regenerar páginas estáticas
      // 4. Etc.
    });
  }

  // Atualizar variáveis CSS de cor
  updateColorVariable(colorPicker) {
    const color = colorPicker.value;
    const root = document.documentElement;
    
    // Mapear color pickers para variáveis CSS
    const colorMap = {
      0: '--primary-color',
      1: '--secondary-color', 
      2: '--accent-color'
    };
    
    const index = Array.from(document.querySelectorAll('.color-picker')).indexOf(colorPicker);
    const cssVar = colorMap[index];
    
    if (cssVar) {
      root.style.setProperty(cssVar, color);
      this.showToast(`Cor ${cssVar} atualizada`, 'success');
    }
  }

  // Configurar modais
  setupModals() {
    const previewBtn = document.getElementById('preview-btn');
    const modal = document.getElementById('preview-modal');
    const closeBtn = modal.querySelector('.modal-close');
    
    previewBtn.addEventListener('click', () => {
      this.showPreview();
    });
    
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
    
    // Fechar modal clicando fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  }

  // Mostrar preview
  showPreview() {
    const modal = document.getElementById('preview-modal');
    const iframe = document.getElementById('preview-frame');
    
    // Recarregar iframe para mostrar mudanças
    iframe.src = iframe.src;
    
    modal.classList.add('show');
  }

  // Sistema de toast
  setupToast() {
    // Toast já configurado, apenas métodos de uso
  }

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const messageEl = document.getElementById('toast-message');
    
    messageEl.textContent = message;
    
    // Definir cor baseada no tipo
    const colors = {
      success: '#27ae60',
      warning: '#f39c12',
      error: '#e74c3c',
      info: '#3498db'
    };
    
    toast.style.backgroundColor = colors[type] || colors.success;
    toast.classList.add('show');
    
    // Remover após 3 segundos
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Carregar dados atuais
  loadCurrentData() {
    // Aqui você carregaria os dados atuais do site
    // Por exemplo, fazendo uma requisição para uma API
    console.log('Carregando dados atuais do site...');
    
    // Simular carregamento
    setTimeout(() => {
      this.showToast('Dados carregados com sucesso', 'info');
    }, 500);
  }

  // Exportar configurações
  exportSettings() {
    const settings = {
      changes: this.changes,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gesoper-settings.json';
    a.click();
    
    URL.revokeObjectURL(url);
    this.showToast('Configurações exportadas', 'success');
  }

  // Importar configurações
  importSettings(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target.result);
        this.changes = settings.changes || {};
        this.applyImportedSettings();
        this.showToast('Configurações importadas com sucesso', 'success');
      } catch (error) {
        this.showToast('Erro ao importar configurações', 'error');
      }
    };
    
    reader.readAsText(file);
  }

  // Aplicar configurações importadas
  applyImportedSettings() {
    Object.keys(this.changes).forEach(key => {
      const change = this.changes[key];
      const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
      
      if (element) {
        element.value = change.value;
      }
    });
  }
}

// Utilitários adicionais
const AdminUtils = {
  // Validar formulários
  validateForm(formElement) {
    const inputs = formElement.querySelectorAll('.form-input[required], .form-textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    });
    
    return isValid;
  },

  // Formatar texto
  formatText(text, type = 'title') {
    switch (type) {
      case 'title':
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      case 'slug':
        return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      default:
        return text;
    }
  },

  // Debounce para otimizar eventos
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Inicializar quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  window.adminPanel = new AdminPanel();
  
  // Adicionar estilos de erro para validação
  const style = document.createElement('style');
  style.textContent = `
    .form-input.error,
    .form-textarea.error {
      border-color: #e74c3c;
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
  `;
  document.head.appendChild(style);
});

// Exportar para uso global
window.AdminPanel = AdminPanel;
window.AdminUtils = AdminUtils;