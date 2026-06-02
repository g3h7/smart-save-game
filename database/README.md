# Camada de Persistência - Banco de Dados

Este diretório contém os scripts estruturais (DDL) e populacionais (DML) para o banco de dados MySQL do EduCa$h.

## Estrutura de Arquivos
- `init.sql`: Script DDL para criar a base de dados `educash`, as tabelas (`usuarios`, `carteiras`, `investimentos_fii`), chaves estrangeiras e índices necessários.
- `seed.sql`: Script DML contendo registros iniciais de teste (usuários fictícios, carteiras e investimentos em fundos imobiliários).

## Como Executar no MySQL Workbench

Siga os passos abaixo para preparar o banco de dados:

1. **Executar a Estrutura (DDL)**:
   - Abra o **MySQL Workbench** e conecte-se à sua instância local/remota.
   - Vá em `File` -> `Open SQL Script...` e selecione o arquivo `init.sql`.
   - Clique no ícone de raio (**Execute**) ou pressione `Ctrl + Shift + Enter`.
   - Atualize a lista de Schemas para certificar-se de que a base `educash` e as tabelas foram criadas com sucesso.

2. **Popular Dados Iniciais (DML)**:
   - Vá em `File` -> `Open SQL Script...` e selecione o arquivo `seed.sql`.
   - Clique no ícone de raio (**Execute**) ou pressione `Ctrl + Shift + Enter`.
   - As tabelas serão populadas com os dados de teste (dois jogadores cadastrados).

> **Atenção**: O arquivo `seed.sql` limpa (`TRUNCATE`) as tabelas antes de inserir os dados de teste. Use apenas em ambiente de desenvolvimento.
