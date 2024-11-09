import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const { username, sub } = ctx.identity;
  const id = util.autoId();
  const now = util.time.nowISO8601();
  const owner = `${sub}::${username}`;
  const concepto = ctx.args.concepto;
  const categoriaId = ctx.args.categoriaId;
  const item = {
    __typename: "Transaccion",
    concepto,
    categoriaId,
    owner,
    createdAt: now,
    updatedAt: now,
    ...ctx.args,
  };
  const key = { id: util.autoId() };
  return ddb.put({ item, key });
}
export function response(ctx) {
  return ctx.result;
}
