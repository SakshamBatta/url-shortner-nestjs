import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from './url.schema';
import { Model } from 'mongoose';
import { CreateUrlDto } from './create-url.dto';
import * as crypto from 'crypto';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<Url>) {}

  async shortenUrl(dto: CreateUrlDto): Promise<Url> {
    const { url, customCode } = dto;

    const code = customCode || crypto.randomBytes(4).toString('hex');

    const existing = await this.urlModel.findOne({ shortCode: code });
    if (existing) throw new ConflictException('Code already in use.');

    const shortUrl = new this.urlModel({
      originalUrl: url,
      shortCode: code,
    });

    return shortUrl.save();
  }

  async getByCode(code: string): Promise<Url> {
    const url = await this.urlModel.findOne({ shortCode: code });
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return url;
  }

  async incrementClicks(code: string): Promise<void> {
    await this.urlModel.updateOne({ shortCode: code }, { $inc: { clicks: 1 } });
  }
}
