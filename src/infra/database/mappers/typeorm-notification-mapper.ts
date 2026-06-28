import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { NotificationEntity } from '../entities/notification.entity';

export class TypeORMNotificationMapper {
  static toDomain(raw: NotificationEntity): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        readAt: raw.readAt ?? undefined,
        createdAt: raw.createdAt,
        recipientId: new UniqueEntityID(raw.recipientId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(
    notification: Notification,
  ): Partial<NotificationEntity> {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      createdAt: notification.createdAt,
      readAt: notification.readAt ?? undefined,
      recipientId: notification.recipientId.toString(),
    };
  }
}
