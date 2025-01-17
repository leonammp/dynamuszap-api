## CONFIGURAÇÃO DAS PASTAS

```
src/
  ├── config/
  │   ├── app.config.js
  │   └── swagger.config.js
  ├── controllers/
  │   └── WhatsAppController.js
  ├── middleware/
  │   ├── errorHandler.js
  │   ├── rateLimiter.js
  │   ├── requestValidator.js
  │   └── sessionValidator.js
  ├── models/
  │   └── Session.js
  ├── routes/
  │   └── whatsapp.routes.js
  ├── services/
  │   └── WhatsAppService.js
  └── app.js
```

### Validação Robusta:

Validação de formato de número de telefone
Validação de base64 para PDFs
Validação de nomes de sessão


### Documentação Detalhada:

Todos os endpoints documentados
Exemplos de uso
Descrições claras dos parâmetros


### Segurança:

Rate limiting para prevenir abusos
Validação de inputs
Tratamento de erros consistente


### Organização:

Código ainda mais modular
Separação clara de responsabilidades
Fácil de manter e expandir