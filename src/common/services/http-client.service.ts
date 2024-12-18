import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { ExternalListResponse } from '../interfaces/external-list-response.interface';
import { ExternalItemResponse } from '../interfaces/external-item-response.interface';

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);

  constructor(private readonly http: HttpService) {}

  async getAll<T>(
    path_model: string,
    params,
  ): Promise<ExternalListResponse<T>> {
    return await firstValueFrom(
      this.http
        .get<ExternalListResponse>(`${process.env.API_URL}/${path_model}`, {
          params,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw error.response.data;
          }),
          map((response) => response.data),
          map(async (data) => {
            const results = await Promise.all(
              data.results.map(async (results) => {
                const details = (
                  await this.getOne<T>(`${path_model}/${results.uid}`)
                ).result?.properties;

                return {
                  ...details,
                  id: results?.uid,
                };
              }),
            );

            return {
              ...data,
              results,
            };
          }),
        ),
    );
  }

  async getOne<T>(path_model: string) {
    const { data } = await firstValueFrom(
      this.http
        .get<ExternalItemResponse<T>>(`${process.env.API_URL}/${path_model}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw error.response.data;
          }),
        ),
    );
    return data;
  }
}
