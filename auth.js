document.addEventListener('DOMContentLoaded', () => {
  // Configuración
  const API_BASE_URL = 'http://localhost:3000';
  const LOGIN_URL = `${API_BASE_URL}/auth/login`;
  const REGISTER_URL = `${API_BASE_URL}/auth/register`;

  // Función para mostrar notificaciones
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }, 10);
  }

  // Control de formularios
  const toggleForms = (showLogin) => {
    document.getElementById('login-form').style.display = showLogin ? 'block' : 'none';
    document.getElementById('register-form').style.display = showLogin ? 'none' : 'block';
    
    // Estilos para botones
    const loginBtn = document.getElementById('show-login');
    const registerBtn = document.getElementById('show-register');
    
    if (loginBtn && registerBtn) {
      loginBtn.style.backgroundColor = showLogin ? '#478ac9' : '#f5f5f5';
      loginBtn.style.color = showLogin ? 'white' : '#333';
      registerBtn.style.backgroundColor = !showLogin ? '#478ac9' : '#f5f5f5';
      registerBtn.style.color = !showLogin ? 'white' : '#333';
    }
  };

  // Inicializar formularios
  toggleForms(true);

  // Registrar usuario
  document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!username || !password) {
      showToast('⚠️ Todos los campos son requeridos', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('⚠️ La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      showToast('✅ Registro exitoso! Redirigiendo...');
      localStorage.setItem('token', data.access_token);
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);

    } catch (error) {
      showToast(`❌ ${error.message || 'Error al registrar'}`, 'error');
      console.error('Register error:', error);
    }
  });

  // Iniciar sesión
  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
      showToast('⚠️ Todos los campos son requeridos', 'error');
      return;
    }

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales inválidas');
      }

      showToast('✅ Inicio de sesión exitoso! Redirigiendo...');
      localStorage.setItem('token', data.access_token);
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);

    } catch (error) {
      showToast(`❌ ${error.message || 'Error al iniciar sesión'}`, 'error');
      console.error('Login error:', error);
    }
  });

  // Botones para alternar formularios
  document.getElementById('show-login')?.addEventListener('click', () => toggleForms(true));
  document.getElementById('show-register')?.addEventListener('click', () => toggleForms(false));
});