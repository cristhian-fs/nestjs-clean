import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { UserEntity } from '../entities/user.entity';

export class TypeORMStudentMapper {
  static toDomain(raw: UserEntity): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(student: Student): UserEntity {
    const entity = new UserEntity();
    entity.id = student.id.toString();
    entity.name = student.name;
    entity.email = student.email;
    entity.password = student.password;

    return entity;
  }
}
