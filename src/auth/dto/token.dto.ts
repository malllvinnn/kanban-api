export class TokenDto {
  kind: 'Bearer' | 'Refresh';
  token: string;
}
