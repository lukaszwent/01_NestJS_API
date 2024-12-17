export interface ExternalItemResponse<T> {
  message: string;
  result: {
    properties: T;
    description: string;
    _id: string;
    uid: string;
    __v: number;
  };
}
