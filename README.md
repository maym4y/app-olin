# 🦷 OLIN - Odonto-Legal Interface (Mobile)

Esta é a versão mobile da plataforma **OLIN**, que busca facilitar e padronizar o registro de perícias criminais.  
Nosso app permite:

- Criação e visualização de casos
- Adição de evidências com upload de arquivos
- Criação de laudos para evidências
- Adição e visualização de vítimas
- Registro de arcada dentária
- Geração de relatórios e laudos em PDF

---

## 🚀 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

---

## 🧪 Funcionalidades

- Login de usuário
- Dashboard com análise de casos
- Upload de arquivos para evidências
- Adição de vítimas aos casos
- Visualização de vítimas e evidências
- Filtro de casos por status, localização e título
- Geração e download de laudos e relatórios em PDF

---

## 💻 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Expo Go App](https://expo.dev/client) (no celular para testes)

---

## 🛠️ Como rodar o projeto localmente

```bash
# Clone o repositório
git clone https://github.com/maym4y/app-olin.git

# Acesse a pasta do projeto
cd app-olin

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

---

## 📁 Estrutura de Pastas (resumo)

```
olin-mobile/
│
├── app/
│ ├── casos/
│ │ ├── [id].jsx
│ │ └── index.jsx
│ ├── evidencias/
│ │ └── [id].jsx
│ ├── vitimas/
│ │ ├── [id].jsx
│ │ └── [id]/
│ │ └── odontograma.jsx
│ ├── _layout.jsx
│ ├── dashboard.jsx
│ ├── index.jsx
│ └── login.jsx
│
├── assets/
│ ├── images/
│ │ ├── logo.png
│ │ └── fdgdfg
│
├── components/
│ ├── auth/
│ │ └── auth-context.jsx
│ ├── cases/
│ │ └── recent-cases.jsx
│ ├── forms/
│ │ ├── edit-evidence-modal.jsx
│ │ ├── new-case-modal.jsx
│ │ ├── new-evidence-modal.jsx
│ │ ├── new-relatorio-modal.jsx
│ │ └── new-vitima-modal.jsx
│ ├── lists/
│ │ ├── list-evidencias.jsx
│ │ ├── list-relatorios.jsx
│ │ └── list-vitimas.jsx
│ └── modal-nova-vitima.jsx
│
├── constants/
│ └── colors.js
│
├── styles/
│ └── styles.js
│
├── .gitignore
├── App.js
├── README.md
├── app.json
├── package.json
└── package-lock.json
```

---

## 📸 Demonstrações

> *(Adicione aqui prints ou GIFs do app em funcionamento)*

---

## 📄 Licença

Este projeto ainda **não possui uma licença** definida.

---

## 🤝 Contribuindo

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir _issues_ ou enviar _pull requests_.

---

> Projeto desenvolvido com ❤️ para auxiliar profissionais da odontologia legal.
