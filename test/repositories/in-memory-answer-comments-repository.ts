import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    this.items = this.items.filter(item => item.id.toString() !== answerComment.id.toString())
  }

  async findById(id: string) {
    return this.items.find(item => item.id.toString() === id) || null
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((answerComment) => answerComment.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }
}