'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Authendicate {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response,session }, next) {
    // call next to advance the request
    if(session.get('uid') === ''){
      response.redirect('/');
    }
    await next()
  }
}

module.exports = Authendicate
