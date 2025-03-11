import { IsAscii, IsNotEmpty, Length } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'title tidak boleh kosong' })
  @Length(3, 10, { message: 'panjang title harus 3 - 10 karakter' })
  @IsAscii({ message: 'karakter title harus berformat ASCII' })
  readonly title: string;

  @IsNotEmpty({ message: 'deskripsi tidak boleh kosong' })
  @Length(3, 100, { message: 'panjang deskripsi harus 3 - 100 karakter' })
  readonly description: string;
}
