import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as proxy from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/api',
    proxy.createProxyMiddleware({
      target: 'https://swapi.dev/api',
      changeOrigin: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
