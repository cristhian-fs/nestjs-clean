import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { TypeORMStudentMapper } from '../mappers/typeorm-student-mapper';

@Injectable()
export class TypeORMStudentsRepository implements StudentsRepository {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.repo.findOne({
      where: {
        email,
      },
    });

    if (!student) return null;

    return TypeORMStudentMapper.toDomain(student);
  }
  async create(student: Student): Promise<void> {
    const data = TypeORMStudentMapper.toPersistence(student);

    await this.repo.save(this.repo.create(data));
  }
}
