import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDetails } from 'src/common';
import { getAPIdetails, getAPIversion } from 'src/util';

@Controller('app')
@ApiTags('app')
export class AppController {
  @Get('version')
  @ApiOperation({ summary: 'Get the version of the API.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'API version retrieved successfully.',
    type: String,
  })
  public getAPIversion(): string {
    return getAPIversion();
  }

  @Get('details')
  @ApiOperation({ summary: 'Get the details of the API.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'API details retrieved successfully.',
    type: ApiDetails,
  })
  public getAPIdetails(): ApiDetails {
    return getAPIdetails();
  }
}
