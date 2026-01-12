# 🚀 GUIA DE DEPLOY NO RENDER - JM Engenharia

## ⚠️ IMPORTANTE: Estrutura do Projeto

Seu projeto tem esta estrutura:
```
/
├── frontend/          ← React (package.json está aqui)
│   ├── package.json
│   ├── src/
│   └── public/
├── backend/           ← FastAPI (requirements.txt está aqui)
│   ├── requirements.txt
│   ├── server.py
│   └── ...
└── README.md
```

**Por isso, você DEVE configurar o "Root Directory" no Render!**

---

## 📋 PASSO A PASSO COMPLETO

### PASSO 1: Criar Banco de Dados no MongoDB Atlas

1. Acesse: https://mongodb.com/atlas
2. Crie conta gratuita
3. Clique em **"Build a Database"** → Escolha **"M0 FREE"**
4. Região: São Paulo (ou mais próxima)
5. Clique **"Create"**

#### Criar usuário do banco:
1. Menu lateral → **"Database Access"**
2. **"Add New Database User"**
3. Username: `jmengenharia`
4. Password: `SuaSenhaForte123` (anote!)
5. **"Add User"**

#### Liberar acesso:
1. Menu lateral → **"Network Access"**
2. **"Add IP Address"**
3. **"Allow Access from Anywhere"** (0.0.0.0/0)
4. **"Confirm"**

#### Copiar URL de conexão:
1. Menu lateral → **"Database"**
2. Clique **"Connect"** no seu cluster
3. **"Connect your application"**
4. Copie a URL:
```
mongodb+srv://jmengenharia:SuaSenhaForte123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

### PASSO 2: Deploy do BACKEND no Render

1. Acesse: https://dashboard.render.com
2. Clique **"New +"** → **"Web Service"**
3. Conecte seu GitHub e selecione o repositório

#### ⚠️ CONFIGURAÇÕES IMPORTANTES:

| Campo | Valor |
|-------|-------|
| **Name** | `jm-engenharia-api` |
| **Region** | `Oregon (US West)` |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT` |

#### Variáveis de Ambiente (clique em "Advanced"):

| Key | Value |
|-----|-------|
| `MONGO_URL` | `mongodb+srv://jmengenharia:SuaSenhaForte123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority` |
| `DB_NAME` | `jm_engenharia` |
| `CORS_ORIGINS` | `*` |
| `SECRET_KEY` | `jm-engenharia-secret-key-2024` |
| `PYTHON_VERSION` | `3.11.0` |

4. Clique **"Create Web Service"**
5. Aguarde o deploy (5-10 minutos)
6. Anote a URL gerada: `https://jm-engenharia-api.onrender.com`

#### Testar Backend:
Acesse no navegador:
```
https://jm-engenharia-api.onrender.com/api/
```
Deve retornar: `{"message":"Hello World"}`

---

### PASSO 3: Deploy do FRONTEND no Render

1. No Render, clique **"New +"** → **"Static Site"**
2. Selecione o mesmo repositório

#### ⚠️ CONFIGURAÇÕES IMPORTANTES:

| Campo | Valor |
|-------|-------|
| **Name** | `jm-engenharia` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `yarn install && yarn build` |
| **Publish Directory** | `build` |

#### Variáveis de Ambiente:

| Key | Value |
|-----|-------|
| `REACT_APP_BACKEND_URL` | `https://jm-engenharia-api.onrender.com` |

#### Configurar Redirect (MUITO IMPORTANTE):
1. Vá em **"Redirects/Rewrites"**
2. Adicione:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`

3. Clique **"Create Static Site"**
4. Aguarde o deploy (5-10 minutos)

---

## ✅ CHECKLIST FINAL

- [ ] MongoDB Atlas configurado com usuário e IP liberado
- [ ] Backend no Render com **Root Directory = `backend`**
- [ ] Frontend no Render com **Root Directory = `frontend`**
- [ ] Variável `REACT_APP_BACKEND_URL` apontando para o backend
- [ ] Redirect `/*` → `/index.html` configurado no frontend

---

## 🔑 CREDENCIAIS DO SISTEMA

**Admin do Site:**
- URL: `https://seu-site.onrender.com/admin`
- Senha: `JM@engcivil`

---

## 🆘 PROBLEMAS COMUNS

### "Cannot find package.json"
**Solução:** Configure **Root Directory = `frontend`** no Static Site

### "Cannot find requirements.txt"  
**Solução:** Configure **Root Directory = `backend`** no Web Service

### Backend não inicia
**Solução:** Verifique se `MONGO_URL` está correta e IP liberado no Atlas

### Frontend não conecta ao backend
**Solução:** Verifique se `REACT_APP_BACKEND_URL` está correta

### Páginas dão erro 404
**Solução:** Configure o redirect `/*` → `/index.html`

---

## 📱 URLs FINAIS

Após o deploy, suas URLs serão:
- **Site:** `https://jm-engenharia.onrender.com`
- **API:** `https://jm-engenharia-api.onrender.com`
- **Admin:** `https://jm-engenharia.onrender.com/admin`

---

## ⏰ NOTA SOBRE PLANO GRATUITO

O plano gratuito do Render "adormece" o backend após 15 minutos de inatividade.
- A primeira requisição após o "sono" pode demorar 30-60 segundos
- Isso é normal e não afeta o funcionamento

Para evitar isso, você pode:
1. Fazer upgrade para plano pago ($7/mês)
2. Usar um serviço de "ping" como UptimeRobot para manter ativo
