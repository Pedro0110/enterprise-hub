# Erros por Endpoint

## POST /companies
- 400: Validação falha (CNPJ inválido, campos faltando)
- 409: CNPJ já registrado

## GET /companies
- Sem erros

## GET /companies/{id}
- 404: Empresa não encontrada

## PUT /companies/{id}
- 400: Validação falha
- 404: Empresa não encontrada
- 409: CNPJ já registrado

## DELETE /companies/{id}
- 404: Empresa não encontrada
- 409: Empresa tem fornecedores associados

## POST /companies/{companyId}/suppliers/{supplierId}
- 404: Empresa ou fornecedor não encontrado
- 422: Fornecedor menor de idade em empresa do PR

## DELETE /companies/{companyId}/suppliers/{supplierId}
- 404: Associação não encontrada

## GET /companies/{companyId}/suppliers
- 404: Empresa não encontrada

## POST /suppliers
- 400: Validação falha (CPF/CNPJ inválido, campos faltando)
- 409: CPF/CNPJ já registrado

## GET /suppliers
- Sem erros

## GET /suppliers/{id}
- 404: Fornecedor não encontrado

## PUT /suppliers/{id}
- 400: Validação falha
- 404: Fornecedor não encontrado
- 409: CPF/CNPJ já registrado

## DELETE /suppliers/{id}
- 404: Fornecedor não encontrado
- 409: Fornecedor tem empresas associadas

## GET /cep/{cep}
- 404: CEP não encontrado
- 503: Serviço de CEP indisponível

