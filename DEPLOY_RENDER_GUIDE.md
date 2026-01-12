# 🚀 GUIA COMPLETO DE DEPLOY NO RENDER - JM Engenharia

## 📋 ÍNDICE
1. Pré-requisitos
2. Configurar MongoDB Atlas (Banco de Dados)
3. Deploy do Backend (FastAPI)
4. Deploy do Frontend (React)
5. Conectar Tudo
6. Testar

---

## 1️⃣ PRÉ-REQUISITOS

### Você vai precisar:
- Conta no Render (https://render.com) - Gratuito
- Conta no MongoDB Atlas (https://mongodb.com/atlas) - Gratuito
- Código do projeto no GitHub

### Como salvar o código no GitHub:
1. No Emergent, clique em "Save to GitHub"
2. Conecte sua conta GitHub
3. Crie um novo repositório ou selecione um existente
4. Clique em "PUSH TO GITHUB"

---

## 2️⃣ CONFIGURAR MONGODB ATLAS (BANCO DE DADOS)

### Passo 1: Criar conta
1. Acesse https://mongodb.com/atlas
2. Crie uma conta gratuita

### Passo 2: Criar Cluster
1. Clique em "Build a Database"
2. Escolha "M0 FREE" (gratuito)
3. Escolha a região mais próxima (ex: São Paulo)
4. Clique em "Create"

### Passo 3: Criar usuário do banco
1. Vá em "Database Access" no menu lateral
2. Clique em "Add New Database User"
3. Anote:
   - Username: `jmengenharia`
   - Password: (crie uma senha forte e ANOTE)
4. Clique em "Add User"

### Passo 4: Permitir acesso de qualquer IP
1. Vá em "Network Access" no menu lateral
2. Clique em "Add IP Address"
3. Clique em "Allow Access from Anywhere" (0.0.0.0/0)
4. Clique em "Confirm"

### Passo 5: Obter a URL de conexão
1. Vá em "Database" no menu lateral
2. Clique em "Connect" no seu cluster
3. Escolha "Connect your application"
4. Copie a URL, será algo como:
   ```
   mongodb+srv://jmengenharia:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Substitua `<password>` pela senha que você criou
6. **GUARDE ESTA URL** - Você vai usar no Render

---

## 3️⃣ DEPLOY DO BACKEND (FastAPI)

### Passo 1: Criar Web Service no Render
1. Acesse https://dashboard.render.com
2. Clique em "New +" → "Web Service"
3. Conecte seu GitHub e selecione o repositório

### Passo 2: Configurações do Backend
Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `jm-engenharia-backend` |
| **Region** | `Oregon (US West)` ou mais próximo |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT` |

### Passo 3: Variáveis de Ambiente do Backend
Clique em "Advanced" → "Add Environment Variable" e adicione:

| Key | Value |
|-----|-------|
| `MONGO_URL` | `mongodb+srv://jmengenharia:SUA_SENHA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority` |
| `DB_NAME` | `jm_engenharia` |
| `CORS_ORIGINS` | `*` |
| `SECRET_KEY` | `sua-chave-secreta-aqui-123456` |
| `PYTHON_VERSION` | `3.11.0` |

### Passo 4: Deploy
1. Clique em "Create Web Service"
2. Aguarde o deploy (5-10 minutos)
3. Quando terminar, você terá uma URL tipo:
   `https://jm-engenharia-backend.onrender.com`
4. **GUARDE ESTA URL** - Você vai usar no frontend

### Passo 5: Testar Backend
Acesse no navegador:
```
https://jm-engenharia-backend.onrender.com/api/
```
Deve retornar: `{"message":"Hello World"}`

---

## 4️⃣ DEPLOY DO FRONTEND (React)

### Passo 1: Criar Static Site no Render
1. No Render, clique em "New +" → "Static Site"
2. Selecione o mesmo repositório do GitHub

### Passo 2: Configurações do Frontend
Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `jm-engenharia` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `yarn install && yarn build` |
| **Publish Directory** | `build` |

### Passo 3: Variáveis de Ambiente do Frontend
Clique em "Advanced" → "Add Environment Variable":

| Key | Value |
|-----|-------|
| `REACT_APP_BACKEND_URL` | `https://jm-engenharia-backend.onrender.com` |

⚠️ **IMPORTANTE**: Use a URL do seu backend que você criou no passo anterior!

### Passo 4: Configurar Redirecionamentos (SPA)
Em "Redirects/Rewrites", adicione:
- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

Isso é necessário para o React Router funcionar.

### Passo 5: Deploy
1. Clique em "Create Static Site"
2. Aguarde o deploy (5-10 minutos)
3. Sua URL será algo como:
   `https://jm-engenharia.onrender.com`

---

## 5️⃣ VERIFICAÇÃO FINAL

### Teste estas páginas:
- [ ] Homepage: `https://jm-engenharia.onrender.com/`
- [ ] Imóveis: `https://jm-engenharia.onrender.com/imoveis`
- [ ] Simulação: `https://jm-engenharia.onrender.com/simulacao`
- [ ] Admin: `https://jm-engenharia.onrender.com/admin`

### Senha do Admin:
```
JM@engcivil
```

---

## 📝 RESUMO DAS VARIÁVEIS DE AMBIENTE

### Backend (.env):
```
MONGO_URL=mongodb+srv://jmengenharia:SUA_SENHA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=jm_engenharia
CORS_ORIGINS=*
SECRET_KEY=sua-chave-secreta-aqui-123456
```

### Frontend (.env):
```
REACT_APP_BACKEND_URL=https://jm-engenharia-backend.onrender.com
```

---

## ⚠️ NOTAS IMPORTANTES

1. **Plano Gratuito do Render**: O backend "dorme" após 15 minutos de inatividade. A primeira requisição pode demorar 30-60 segundos.

2. **MongoDB Atlas Gratuito**: Limite de 512MB de armazenamento. Suficiente para começar.

3. **Domínio Personalizado**: Você pode adicionar seu próprio domínio no Render (ex: jmengenharia.com.br)

4. **HTTPS**: O Render já fornece HTTPS gratuito automaticamente.

---

## 🆘 PROBLEMAS COMUNS

### Backend não inicia:
- Verifique se `MONGO_URL` está correta
- Verifique se o IP está liberado no MongoDB Atlas

### Frontend não conecta ao backend:
- Verifique se `REACT_APP_BACKEND_URL` está correta
- Verifique se o backend está rodando

### Erro de CORS:
- Adicione a URL do frontend em `CORS_ORIGINS` no backend

---

## 📞 SUPORTE

Se tiver problemas:
1. Verifique os logs no Render (aba "Logs")
2. Verifique se todas as variáveis de ambiente estão corretas
3. Teste o backend isoladamente antes do frontend

Boa sorte com o deploy! 🚀
