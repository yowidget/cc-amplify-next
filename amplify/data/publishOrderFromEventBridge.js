export function request(ctx) {
    console.log('ctx', ctx)
    return {
      payload: ctx.arguments,
    };
  }
  
  export function response(ctx) {
    return ctx.arguments;
  }