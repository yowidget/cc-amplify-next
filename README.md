# Para crear un ambiente de backend sandbox con log streaming de las funciones https://docs.amplify.aws/react/build-a-backend/functions/streaming-logs/
npx ampx sandbox --stream-function-logs

# Para ejecutar el frontend
npm run dev

# Para agregar funcionalidad graphql a una function
npx ampx generate graphql-client-code --out amplify/functions/sendEmailRecompensa/graphql --profile Molaca