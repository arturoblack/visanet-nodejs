

const request = require('request');

/**
 * VisaNet
 */
class VisaNet {

  /**
   * VisaNet object
   * @param {object} config 
   */
  constructor(config) {
    config = config || {};

    this.user = config.user || process.env.VISANET_USER;
    this.password = config.password || process.env.VISANET_PASSWORD;
    this.merchantId = config.merchantId || process.env.VISANET_MERCHANT_ID;

    // defaults
    const env = config.env || process.env.VISANET_ENV || 'prod';
    const apiUrlProd =  process.env.VISANET_API_URL_PROD || 'https://apiprod.vnforapps.com';
    const apiUrlDev =  process.env.VISANET_API_URL_DEV || 'https://apitestenv.vnforapps.com';
    this.apiUrl = env === 'prod' ? apiUrlProd : apiUrlDev;

    this.channel = config.channel || process.env.VISANET_MERCHANT_ID || 'web';
    this.currency = config.currency || process.env.VISANET_DEFAULT_CURRENCY || 'PEN';
  }

  /**
   * Crea el token de seguridad
   * @returns Promise<string>
   */
  createToken() {
    return new Promise( (resolve, reject) => {

      const credentials = Buffer
        .from(`${this.user}:${this.password}`)
        .toString('base64');

      request({
          headers: {
            'Authorization': `Basic ${credentials}`
          },
          url: `${this.apiUrl}/api.security/v1/security`,
          method: 'POST'
        }, function (err, res, body) {
          if (!err && res.statusCode == 201) {
            resolve(body);
          } else if (!err) {
            console.error(res.statusCode);
            // reject({status: res.statusCode});
            reject({status: res.statusCode, error: JSON.parse(Buffer.from(body).toString())});
            
          }
          else{
            reject(err);
          }
        });
    });
  }

  /**
   * Crea la sesion de visanet (datos para el boton)
   * @param {string} securityToken 
   * @param {object} data cuerpo de la peticion 
   * @returns {Promise<{sessionKey: string, expirationTime: number}>}
   */
  createSession(securityToken, data) {

    const jsonBody = JSON.stringify(data);
    console.log(`url is: ${this.apiUrl}/api.ecommerce/v2/ecommerce/token/session/${this.merchantId}`);
    console.log('body:', jsonBody);
    
    return new Promise( (resolve, reject) => {
      request({
          headers: {
            'Content-Type': 'application/json',
            'Authorization': securityToken,
          },
          encoding: null,
          body: jsonBody,
          url: `${this.apiUrl}/api.ecommerce/v2/ecommerce/token/session/${this.merchantId}`,
          method: 'POST',
        }, function (err, res, body) {
          if (!err && res.statusCode == 200) {
            console.error( Buffer.from(body).toString());
            resolve(JSON.parse(Buffer.from(body).toString()));
          } else if (!err) {
            console.error(res.statusCode);
            console.error( Buffer.from(body).toString());
            reject({status: res.statusCode, error: JSON.parse(Buffer.from(body).toString())});
          }
          else{
            reject(err);
          }
        });
    });
  }

  /**
   * 
   * @param {string} securityToken 
   * @param {object} data 
   * @returns {Promise<{header: any, order: any, dataMap: any}>}
   */
  getAuthorization(securityToken, data) {
    const jsonBody = JSON.stringify(data);
    return new Promise( (resolve, reject) => {
      request(
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': securityToken
          },
          body: jsonBody,
          url: `${this.apiUrl}/api.authorization/v3/authorization/ecommerce/${this.merchantId}`,
          method: 'POST'
        }, function (err, res, body) {
          if (!err && res.statusCode == 200) {
            resolve(JSON.parse(Buffer.from(body).toString()));
          } else if (!err) {
            console.error(res.statusCode);
            console.error(body);
            
            console.error(Buffer.from(body).toString());
            reject({status: res.statusCode,});
          }
          else{
            reject(err);
          }
        }
      );
    });
  }
}

module.exports = VisaNet;
