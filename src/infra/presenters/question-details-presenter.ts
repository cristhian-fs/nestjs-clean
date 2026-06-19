import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionDetailsPresenter {
  static toHTTP(questiondetails: QuestionDetails) {
    return {
      id: questiondetails.questionId.toString(),
			authorId: questiondetails.authorId.toString(),
			author: questiondetails.author,
      title: questiondetails.title,
			content: questiondetails.content,
			attachments: questiondetails.attachments.map(AttachmentPresenter.toHTTP),
      slug: questiondetails.slug.value,
      bestAnswserId: questiondetails.bestAnswerId?.toString(),
      createdAt: questiondetails.createdAt,
      updatedAt: questiondetails.updatedAt,
    };
  }
}
