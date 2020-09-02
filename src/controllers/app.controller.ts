/* eslint-disable @typescript-eslint/ban-types */
import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root() {
    return {
      message : "Hello Node JS Web API."
    };
  }


}
 