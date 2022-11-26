module.exports = () => {
  return async function errorHandler(ctx, next) {
    // await next();
    // if (ctx.status === 404 && !ctx.body) {
    //   if (ctx.acceptJSON) {
    //     ctx.body = { error: 'Not Found' };
    //   } else {
    //     ctx.body = '<h1>Page Not Found</h1>';
    //   }
    // }
    try{
      await next();
      if (ctx.status === 404 && !ctx.body) {
        ctx.body = { msg: 'fail', data: '404' };
      }
    } catch (err) {
      console.log(err);
    }
  };
};