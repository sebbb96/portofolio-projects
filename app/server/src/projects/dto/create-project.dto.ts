import { IsString, IsUrl, IsIn } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  clientLink: string;

  @IsIn(['hidden', 'visible'])
  status: 'hidden' | 'visible';
  // @IsString()
  image: string;
}
