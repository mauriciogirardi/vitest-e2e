### Instalação do vitest

Comandos e detalhes sobre o que instalamos

```bash
  npm i -D vitest @vitejs/plugin-react @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

  # Abaixo são só coisas que vamos usar ao longo das aulas
  npm i drizzle-orm better-sqlite3 clsx date-fns lucide-react
  npm i -D dotenv dotenv-cli drizzle-kit @types/better-sqlite3 tsx
```

### Configuração do vitest

Criar arquivo ./vitest.config.ts (code vitest.config.ts):

```bash
  /// <reference types="vitest" />
  // Garante que o TypeScript reconheça os tipos do Vitest

  import { defineConfig } from 'vitest/config';
  import react from '@vitejs/plugin-react';
  import path from 'path';

  // Carrega variáveis de ambiente antes de tudo
  // Estou usando a linha de comando para isso (mas deixei aqui caso queira)
  // import dotenv from 'dotenv';
  // dotenv.config({ path: '.env.test' });

  export default defineConfig({
    test: {
      // Define o ambiente de testes como jsdom
      // (simula o DOM no Node.js, ideal para testes de componentes React)
      environment: 'jsdom',

      // Permite usar funções como `describe`, `it`, `expect`
      // sem importar manualmente
      globals: true,

      // Rodar testes em paralelo (comportamento padrão do Vitest)
      // Mantido explícito caso algum teste com acesso ao SQLite
      // gere conflito em constraints únicas (ex: UNIQUE constraint)
      fileParallelism: false,

      // Arquivo executado antes de cada **arquivo de teste**
      // (ideal para configuração global como jest-dom e cleanup)
      setupFiles: ['vitest.setup.ts'],

      // Executado uma única vez antes (setup) e depois (tearDown) da suíte
      // inteira de testes
      globalSetup: ['vitest.global.setup.ts'],

      // Define quais arquivos serão considerados testes (unit e integration)
      // Testes de integração: .test.ts(x) | Testes Unitários: .spec.ts(x)
      include: ['src/**/*.{spec,test}.{ts,tsx}'],

      // Tempo máximo para cada teste (em milissegundos)
      // antes de ser considerado travado ou falho
      testTimeout: 10000,

      // Configuração de cobertura de testes
      coverage: {
        // Pasta onde os relatórios de cobertura serão gerados
        reportsDirectory: './coverage',

        // Usa o mecanismo de coverage nativo do Node.js
        provider: 'v8',

        // Quais arquivos serão analisados para cobertura de código
        include: ['src/**/*.{ts,tsx}'],

        // Arquivos e pastas que serão ignorados no relatório de cobertura
        exclude: [
          // Ignora arquivos de teste
          '**/*.test.{ts,tsx}',
          '**/*.spec.{ts,tsx}',

          // Ignora arquivos que TEM APENAS types ou interfaces
          '**/types/**',
          '**/*.d.ts',
          '**/*.type.{ts,tsx}',
          '**/*.types.{ts,tsx}',
          '**/*.contract.{ts,tsx}',
          '**/*.protocol.{ts,tsx}',
          '**/*.interface.{ts,tsx}',

          // Ignora layout.tsx (se for precisar testar o layout, remova)
          'src/app/**/layout.{ts,tsx}',

          // Ignora arquivos e pastas de mocks e utilitários de testes
          '**/*.mock.{ts,tsx}',
          '**/*.mocks.{ts,tsx}',
          '**/mocks/**',
          '**/__mocks__/**',
          '**/__tests__/**',
          '**/__test-utils__/**',
          '**/*.test-util.ts',

          // Ignora arquivos e pastas do Storybook
          '**/*.story.{ts,tsx}',
          '**/*.stories.{ts,tsx}',
          '**/stories/**',
          '**/__stories__/**',
        ],
      },
    },
    // Ativa o plugin do React (JSX transform, HMR, etc)
    plugins: [react()],
    resolve: {
      alias: {
        // Permite usar @/ como atalho para a pasta src
        // Exemplo: import Button from '@/components/Button'
        '@': path.resolve(__dirname, 'src'),
      },
    },
  });
  Criar arquivo ./vitest.setup.ts (code vitest.setup.ts):
```

Criar arquivo ./vitest.setup.ts (code vitest.setup.ts):

```bash
  // Esse arquivo é executado antes de cada ARQUIVO de teste.
  // Ideal para configurar jest-dom, mocks globais, ou resetar estados entre arquivos.

  // Importa funções do Vitest para usar depois dos testes
  // `afterEach` = executa algo depois de cada teste
  // `expect` = função principal para fazer asserções (testar resultados)
  import { afterEach, expect } from 'vitest';

  // Importa a função `cleanup` da Testing Library
  // Ela "limpa" o DOM após cada teste pra garantir que um teste não afete outro
  import { cleanup } from '@testing-library/react';

  // Importa os matchers extras do jest-dom, adaptados pro Vitest
  // Exemplo: `.toBeInTheDocument()`, `.toHaveAttribute()`, etc.
  // Sem isso, o `expect(...).toBeInTheDocument()` daria erro
  import '@testing-library/jest-dom/vitest';

  // Importa todos os matchers do jest-dom adaptados para Vitest
  // Isso evita warnings relacionados ao act(...) em atualizações do React
  // e garante que matchers como `.toBeInTheDocument()` funcionem corretamente
  import * as matchers from '@testing-library/jest-dom/matchers';
  import { clearDrizzleTodoTable } from '@/core/todo/__tests__/utils/clear-drizzle-todo-table';

  // Estende o expect global com os matchers do jest-dom
  // Sem isso, pode aparecer warning do tipo "You might have forgotten to wrap an update in act(...)"
  expect.extend(matchers);

  // Essa função roda automaticamente depois de **cada** teste
  // Serve pra limpar tudo e evitar que um teste interfira no outro
  afterEach(async () => {
    // Limpa o DOM entre os testes (remove o que foi renderizado)
    cleanup();

    // Reseta todos os spies e mocks do Vitest (`vi.fn`, `vi.spyOn`, etc.)
    // Garante que os testes sejam independentes e não tenham "lixo" de execuções anteriores
    vi.resetAllMocks();

    // Limpa a tabela da base de dados caso tenha ficado lixo
    await clearDrizzleTodoTable();
  });
```

Arquivo vitest.global.setup.ts:

import cleanupTestDatabase from '@/utils/**tests**/utils/cleanup-test-database';

```bash
// Executado uma única vez antes (setup) e depois (tearDown) da suíte
// inteira de testes

export async function setup() {
  // Roda antes de todos os testes
  // Isso é meio demais, mas às vezes o teste não roda por completo
  // e deixa lixo, como bases de dados antigas ou dados na tabela
  await cleanupTestDatabase();
}

export async function teardown() {
  // Roda depois de todos os testes
  await cleanupTestDatabase();
}
```

Arquivo tsconfig.json:

```bash
{
  // outras configs
  "compilerOptions": {
    // outras configs
    "types": ["vitest/globals"],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
  // outras configs
}
```

Arquivo package.json:

```bash
{
  // outras configs
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "drizzle:generate": "drizzle-kit generate",
    "drizzle:migrate": "drizzle-kit migrate",
    "dev:test": "dotenv -e .env.e2e -- next dev",
    "start:test": "dotenv -e .env.e2e -- next start",
    "test": "dotenv -e .env.test -- vitest run --bail 1",
    "test:all": "npm run test && npm run test:e2e",
    "test:watch": "dotenv -e .env.test -- vitest --bail 1",
    "test:unit": "dotenv -e .env.test -- vitest run --exclude 'src/**/*.{test,e2e}.{ts,tsx}' --fileParallelism",
    "test:unit:watch": "dotenv -e .env.test -- vitest --exclude 'src/**/*.{test,e2e}.{ts,tsx}' --fileParallelism",
    "test:int": "dotenv -e .env.test -- vitest run --exclude 'src/**/*.{spec,e2e}.{ts,tsx}' --no-file-parallelism",
    "test:int:watch": "dotenv -e .env.test -- vitest --exclude 'src/**/*.{spec,e2e}.{ts,tsx}' --no-file-parallelism",
    "test:cov": "dotenv -e .env.test -- vitest run --coverage --no-file-parallelism",
    "test:e2e": "dotenv -e .env.e2e -- playwright test",
    "test:e2e:headed": "dotenv -e .env.e2e -- playwright test --headed",
    "test:e2e:debug": "dotenv -e .env.e2e -- playwright test --debug",
    "test:e2e:ui": "dotenv -e .env.e2e -- playwright test --ui",
    "test:e2e:report": "dotenv -e .env.e2e -- playwright show-report",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
  // outras configs
}
```

### Tipos de testes: unitários, integração e e2e

🧪 Testes unitários (\*.spec.ts(x)) Testam um único elemento isolado — como
funções puras, classes ou até componentes pequenos. Se esse elemento depende de
outro (ex: uma função chama outra, ou um componente usa outro), a dependência
deve ser mockada. Esses testes não envolvem DOM, rede, banco, nem efeitos
colaterais reais.

📌 Exemplos:

- Testar uma função sum(a, b) retorna o valor correto.
- Testar que um componente <Button> renderiza o texto correto.
- Testar que uma função chama outra com os argumentos esperados (com vi.fn).

🔄 Testes de integração (\*.test.ts(x))

Validam a integração entre dois ou mais elementos reais do sistema, como um
componente que usa outros componentes, um hook que depende de contexto, ou uma
função que interage com a API interna. Não há efeitos colaterais externos reais
— mockamos banco, rede, arquivos, e-mail, etc.

📌 Exemplos:

- Testar que <TodoForm /> renderiza os todos corretamente e chama a
  createTodoAction.
- Testar que um formulário envia os dados corretos para a função handleSubmit.
- Testar que uma API chama o repositório corretamente (com mock do banco).

🌐 Testes end-to-end (\*.e2e.ts)

Simulam o comportamento real do usuário ou do sistema completo. Envolvem o app
rodando de verdade (via Playwright, Vitest com fetch real, etc.). Idealmente
usam um banco de dados separado e limpo, podendo ou não mockar serviços externos
como e-mail, storage, etc.

📌 Exemplos:

- O usuário preenche um formulário, envia, e vê o item novo na tela.
- Um teste de API acessa /login, envia credenciais, recebe JWT e acessa rota
  privada. -Um e-mail de verificação é simulado via mock, mas todo o fluxo roda
  real.
