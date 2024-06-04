import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export interface AnswerAttachmentsRepository {
  findManyByAnswerId(answer: string): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answer: string): Promise<void>
}