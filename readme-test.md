# Enterprise Hub

Sistema full-stack para gestão de empresas e fornecedores.

## ▶️ Como rodar

```bash
docker compose up --build

Front-end disponível em http://localhost:4200.
🧱 Tecnologias

    Front-end: Angular 21 + Bootstrap (CSS)

    Back-end: Java 21 + Spring Boot 4.1.0 + PostgreSQL

    Infra: Docker Compose

🗺️ Modelo do banco de dados

https://image.png
🧠 Decisões técnicas
JPA ao invés de JDBC manual

O escopo do projeto permite o uso de um ORM sem prejuízo da qualidade. Utilizei JPA para ganhar produtividade, mas tenho domínio sobre SQL e acesso direto ao banco quando necessário.
Hibernate criando as tabelas (sem Flyway)

Considerei versionar o schema com Flyway e adicionar comentários descritivos nas colunas. Para o escopo atual, manter o Hibernate com ddl-auto=update foi suficiente. O projeto já inclui uma migration pronta caso se opte pelo Flyway no futuro.
Relacionamento N:N sem @ManyToMany

A tabela associativa company_supplier possui campos de auditoria (created_at, updated_at). Preferi uma entidade explícita a usar @ManyToMany com ajustes posteriores via DDL — isso evita overengineering e mantém o controle sobre a relação.
Validação de CEP

O requisito pedia validação na API http://cep.la/api. Como esse serviço não retorna JSON legível, utilizei a API pública viacep.com.br/ws/{cep}/json/.

Fiquei em dúvida se "validar" significava comparar os campos preenchidos com os retornados pela API ou apenas preencher automaticamente (prática mais comum). Sem poder alinhar com a equipe, implementei a busca e preenchimento automático — a abordagem que me pareceu mais útil. Em um cenário real, eu alinharia essa expectativa antes de codificar.
```
