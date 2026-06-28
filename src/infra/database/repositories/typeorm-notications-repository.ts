import { Injectable } from '@nestjs/common';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { Repository } from 'typeorm';
import { TypeORMNotificationMapper } from '../mappers/typeorm-notification-mapper';

@Injectable()
export class TypeORMNotificationsRepository implements NotificationsRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private repo: Repository<NotificationEntity>,
  ) {}

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.repo.findOne({
      where: { id },
    });

    if (!notification) {
      return null;
    }

    return TypeORMNotificationMapper.toDomain(notification);
  }
  async create(notification: Notification): Promise<void> {
    const data = TypeORMNotificationMapper.toPersistence(notification);

    await this.repo.save(this.repo.create(data));
  }
  async save(notification: Notification): Promise<void> {
    const data = TypeORMNotificationMapper.toPersistence(notification);

    await this.repo.update(
      {
        id: notification.id.toString(),
      },
      data,
    );
  }
}
