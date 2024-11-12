import { util, runtime } from '@aws-appsync/utils'



export function request(ctx) {
	console.log('the context identity', ctx.identity)
	if (!ctx.prev.result.id) {
		runtime.earlyReturn({
			message: 'error saving recording to database, no message scheduled',
		})
	}
	console.log('the context prev', ctx.prev)
	return {
		resourcePath: `/schedules/${ctx.prev.result.concepto}-${ctx.prev.result.id}`,
		method: 'POST',
		params: {
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				ActionAfterCompletion: 'DELETE',
				ScheduleExpression: `at(${ctx.prev.result.deliverDate})`,
				ScheduleExpressionTimezone:`${ctx.prev.result.userTimeZone}`,
				ClientToken: util.autoId(),
				FlexibleTimeWindow: {
					Mode: 'OFF',
				},
				Target: {
					Arn: ctx.env.SCHEDULE_FUNCTION_ARN,
					RoleArn: ctx.env.SCHEDULE_FUNCTION_ROLE_ARN,
					Input: JSON.stringify({
						transaccionId: ctx.prev.result.id,
						userEmail: ctx.prev.result.email,
					}),
				},
			},
		},
	}
}
export function response(ctx) {
	console.log('ctx result', ctx.result)
	const parsedBody = JSON.parse(ctx.result?.body || '{}')
	console.log('parsedBody', parsedBody)
	if (parsedBody.error) {
		runtime.earlyReturn({
			message: `error scheduling message, ${JSON.stringify(parsedBody)}`,
		})
	}
	return { message: `message successfully scheduled, ${JSON.stringify(parsedBody)}` }
}
