import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  Redirect,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './create-url.dto';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('api') // 👈 This means: base path = /api
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly configService: ConfigService,
  ) {}

  @Post('shorten')
  async shorten(@Body() body: CreateUrlDto) {
    const result = await this.urlService.shortenUrl(body);

    const baseUrl = process.env.BASE_URL;

    return {
      originalUrl: result.originalUrl,
      shortUrl: `${baseUrl}/r/${result.shortCode}`,
    };
  }

  @Get('/r/:code')
  @Redirect() // 👈 ye magic karega
  async redirect(@Param('code') code: string) {
    const url = await this.urlService.getByCode(code);
    if (!url) throw new NotFoundException('Short URL not found');

    await this.urlService.incrementClicks(code);

    return { url: url.originalUrl, statusCode: 302 };
  }
  @Get('stats/:code')
  @ApiOperation({ summary: 'Get analytics for a short URL' })
  @ApiParam({ name: 'code', type: 'string' })
  @ApiResponse({ status: 200, description: 'Analytics data' })
  @ApiResponse({ status: 404, description: 'Short code not found' })
  async getStats(@Param('code') code: string) {
    const url = await this.urlService.getByCode(code);
    if (!url) throw new NotFoundException('Short URL not found');

    const baseUrl = process.env.BASE_URL;
    return {
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl}/r/${url.shortCode}`,
      clicks: url.clicks,
    };
  }
}
