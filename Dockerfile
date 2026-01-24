FROM node:22-bullseye

# Instala pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copia arquivos necessários para instalar dependências com pnpm
COPY package.json pnpm-lock.yaml ./

# Instala as dependências
RUN pnpm install

# Copia o restante do código
COPY . .

EXPOSE 3333

# Mantém o container em execução (modo dev)
CMD ["tail", "-f", "/dev/null"]