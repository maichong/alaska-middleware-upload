/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-06
 * @author Liang <liang@maichong.it>
 */

'use strict';

const asyncBusboy = require('async-busboy');

module.exports = function (options) {
  return function (ctx, next) {
    if (ctx.method !== 'POST' || ctx.files !== undefined) return next();
    if (!ctx.request.is('multipart/*')) return next();
    ctx.files = {};
    return asyncBusboy(ctx.req, options).then(res => {
      const files = res.files;
      const fields = res.fields;
      ctx.files = {};
      files.forEach(file => {
        let fieldname = file.fieldname;
        if (ctx.files[fieldname]) {
          if (Array.isArray(ctx.files[fieldname])) {
            ctx.files[fieldname].push(file);
          } else {
            ctx.files[fieldname] = [ctx.files[fieldname], file];
          }
        } else {
          ctx.files[fieldname] = file;
        }
      });
      ctx.request.body = fields;
      return next();
    });
  };
};
