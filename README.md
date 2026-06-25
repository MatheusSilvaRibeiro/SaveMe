## SaveMe Games

> Extensão Inteligente para Monitoramento e Comparação de Preços de Jogos Online.

O **SaveMe Games** é um projeto desenvolvido para a disciplina de Projeto Multidisciplinar Integrador (PMI) III, cujo objetivo é ajudar jogadores a economizar na compra de jogos digitais através da comparação automática de preços entre diferentes plataformas.

A aplicação consulta os preços em múltiplas lojas, apresenta a melhor oferta disponível e, futuramente, será disponibilizada como uma extensão para navegadores, permitindo que o usuário acompanhe promoções em tempo real.

---

## Problema

Os jogadores enfrentam diversos desafios ao adquirir jogos digitais:

- Diferença significativa de preços entre plataformas;
- Promoções rápidas que passam despercebidas;
- Comparação manual demorada;
- Compras impulsivas sem pesquisa prévia;
- Perda de dinheiro ao comprar um jogo fora de promoção.

---

## Solução

O SaveMe Games automatiza esse processo através de uma plataforma capaz de:

- pesquisar jogos;
- comparar preços automaticamente;
- exibir a plataforma mais barata;
- alertar promoções;
- reduzir o tempo gasto procurando ofertas;
- reduzir os custos para os amantes de jogos.

---

## Funcionalidades

- Pesquisa de jogos
- Comparação de preços
- Interface Web
- Cadastro de usuários
- Login seguro utilizando bcrypt
- API REST
- Integração com banco de dados PostgreSQL
- Estrutura preparada para futura implementação de notificações

---

## Tecnologias

## Backend

- Node.js
- Express.js
- PostgreSQL
- bcrypt
- CORS

## Frontend

- HTML
- CSS
- JavaScript

## Ferramentas

- Git
- GitHub
- VS Code
- Nodemon

---

## Estrutura do Projeto

```
SaveMe
│
├── apps
│   └── backend
│       ├── src
│       │   ├── controller
│       │   ├── routes
│       │   ├── db.js
│       │   └── server.js
│       │
│       ├── .env
│       ├── .env.example
│       ├── package.json
│       └── package-lock.json
│
├── frontend
│   ├── admin
│   ├── css
│   ├── js
│   ├── index.html
│   └── signup.html
│
└── .gitignore
```

---

## Pré-requisitos

Antes de executar o projeto é necessário possuir instalado:

- Node.js
- npm
- PostgreSQL
- Git

---

## Instalação

Clonar o repositório

```bash
git clone https://github.com/MatheusSilvaRibeiro/SaveMe.git
```

Entre na pasta do projeto

```bash
cd SaveMe/apps/backend
```

Instale as dependências

```bash
npm install
```

Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`.

---

## Executando o projeto

### Ambiente de desenvolvimento

```bash
npm run dev
```

### Ambiente de produção

```bash
npm start
```

O servidor será iniciado em:

```
http://localhost:3000
```

*(Caso a porta seja diferente, altere conforme definido no arquivo `server.js`.)*

---

## Banco de Dados

O projeto utiliza PostgreSQL.

As configurações de conexão ficam centralizadas em:

```
src/db.js
```

As credenciais devem ser informadas através do arquivo:

```
.env
```

---

## Segurança

Para garantir maior segurança no armazenamento das senhas dos usuários, o projeto utiliza a biblioteca **bcrypt**, responsável por criptografar as senhas antes de serem armazenadas no banco de dados.

---

## Próximos Passos

- Transformar o sistema em uma extensão para navegadores;
- Comparação em tempo real entre Steam, Epic Games e outras plataformas;
- Sistema de favoritos;
- Histórico de preços;
- Notificações automáticas de promoções;
- Dashboard do usuário;
- Lista de desejos;
- Integração com mais lojas digitais.

---

## Equipe

Projeto desenvolvido para a disciplina de Projeto Multidisciplinar Integrador III

Integrantes:

- Igor da Rosa Mafalda
- Matheus Silva Ribeiro
- Tauane Carolina
- Nicolas Noronha
- Luan Sastre

---


## Considerações

O SaveMe Games busca tornar a compra de jogos digitais mais inteligente, prática e econômica, permitindo que o usuário encontre sempre a melhor oferta disponível com rapidez e segurança.
