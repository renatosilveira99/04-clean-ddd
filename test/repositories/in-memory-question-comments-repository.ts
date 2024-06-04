import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    this.items = this.items.filter(item => item.id !== questionComment.id)
  }

  async findById(id: string): Promise<QuestionComment | null> {
    return this.items.find(item => item.id.toString() === id) || null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((questionComment) => questionComment.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }
}