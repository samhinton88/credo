import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
    providerType: string,
  ): Promise<any> {
    const authProvider = await this.prisma.authProvider.update({
      where: { userId_providerType: { userId, providerType } },
      data: { refreshToken: this.encryptRefreshToken(refreshToken) },
      include: { user: { include: { authProviders: true } } },
    });

    return authProvider.user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  encryptRefreshToken(refreshToken: string): string {
    const iv = crypto.randomBytes(16); // Generate a random initialization vector
    const key = process.env.ENCRYPTION_KEY;

    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'base64'),
      iv,
    );
    let encrypted = cipher.update(refreshToken);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decryptRefreshToken(encryptedToken: string): string {
    const textParts = encryptedToken.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.ENCRYPTION_KEY),
      iv,
    );

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  create(createUserDto: CreateUserDto) {
    const { authProvider, email } = createUserDto;
    return this.prisma.user.create({
      data: { email, authProviders: { create: authProvider } },
      include: { authProviders: true },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { addresses: true },
    });
  }

  findById(id: string, query: Partial<Prisma.UserFindUniqueArgs> = {}) {
    return this.prisma.user.findUnique({ where: { id }, ...query });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
