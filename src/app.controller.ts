import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { UrlService } from './url/url.service';
import { CreateUrlDto } from './url/create-url.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller()
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/api/shorten')
  async shorten(@Body() body: CreateUrlDto) {
    const result = await this.urlService.shortenUrl(body);
    const base = this.configService.get<string>('BASE_URL');
    return {
      originalUrl: result.originalUrl,
      shortUrl: `${base}/r/${result.shortCode}`,
    };
  }

  @Get('/r/:code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const url = await this.urlService.getByCode(code);
    if (!url) throw new NotFoundException('URL not found');
    await this.urlService.incrementClicks(code);
    return res.redirect(302, url.originalUrl);
  }

  @Get('/api/stats/:code')
  async stats(@Param('code') code: string) {
    const url = await this.urlService.getByCode(code);
    if (!url) throw new NotFoundException('URL not found');

    const base = this.configService.get<string>('BASE_URL');
    return {
      originalUrl: url.originalUrl,
      shortUrl: `${base}/r/${url.shortCode}`,
      clicks: url.clicks,
    };
  }
}
