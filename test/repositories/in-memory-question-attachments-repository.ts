import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";


export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (questionAttachment) => questionAttachment.questionId.toString() === questionId)

    return questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    this.items = this.items.filter(
      (questionAttachment) => questionAttachment.questionId.toString() !== questionId)
  }
}