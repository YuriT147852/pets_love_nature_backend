interface CustomResponse {
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const successResponse = ({ data, message }: { data?: any; message?: string }) => {
  const result: CustomResponse = { status: 'success' };
  if (data) result.data = data;
  if (message) result.message = message;
  return result;
};
