import { QuestionSummary } from '@/domain/forum/enterprise/entities/value-objects/question-summary';

export class QuestionSummaryPresenter {
  static toHTTP(questionSummary: QuestionSummary) {
    return {
      id: questionSummary.questionId.toString(),
      authorId: questionSummary.authorId.toString(),
      author: questionSummary.author,
      title: questionSummary.title,
      slug: questionSummary.slug.value,
      excerpt: questionSummary.excerpt,
      bestAnswserId: questionSummary.bestAnswerId?.toString(),
      createdAt: questionSummary.createdAt,
      updatedAt: questionSummary.updatedAt,
    };
  }
}
