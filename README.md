VISANET(Perú) NODEJS 
===

implementacion de visanet(Perú) para NodeJS

[ver ejemplo](https://github.com/arturoblack/visanet-nodejs-ejemplo)


Instalación
---

``` bash
npm i @arturoblack/visanet
```

Uso
---

Instanciacón de la clase VisaNet

``` js
const {VisaNet} = require('@arturoblack/visanet');


const visa = new VisaNet({
  user: 'email',
  password: 'password',
  merchantId: 'codigo de comercio',
  env: 'dev', // por default es prod
});
```

Obtención de la llave de session

```js 
  // ontencion del token
  const securityToken = await visa.createToken();

  // cuerpo del mensaje
  const body = { 
    amount = 12.50, 
    channel: visa.channel, //web por defecto
    antifraud: 
      { 
        clientIp, 
        merchantDefineData: {MDD1: 'web', MDD2: 'Canl', MDD3: 'Canl'},
      },
  };

  // obtencion de la sessionKey (prar frontend)
  const {
    sessionKey,
    expirationTime
  } = await visa.createSession(securityToken, body);

```

Recepcion de la respuesta

``` js

    const body = {
      antifraud: null,
      captureType: 'manual',
      channel: visa.channel,
      countable: true,
      order: {
        amount:  12.50,
        currency: visa.currency, // PEN por defecto
        purchaseNumber,
        tokenId: transactionToken
      },
    };

    const payload = await visa.getAuthorization(securityToken, body);
```