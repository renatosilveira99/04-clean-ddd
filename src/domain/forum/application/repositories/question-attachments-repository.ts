import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export interface QuestionAttachmentsRepository {
  findManyByQuestionId(question: string): Promise<QuestionAttachment[]>
  deleteManyByQuestionId(question: string): Promise<void>
}