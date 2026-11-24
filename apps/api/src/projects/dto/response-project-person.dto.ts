import { ResponsePersonDto } from '../../persons/dto/response-person.dto.js';

export class ResponseProjectPersonDto {
  id: string;
  role: string | null;
  extra: string | null;
  person: ResponsePersonDto;
}
