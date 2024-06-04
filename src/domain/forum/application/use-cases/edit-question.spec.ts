import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion({ authorId: new UniqueEntityID('author-1') }, new UniqueEntityID('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('attachment-1')
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('attachment-2')
      })
    )

    await sut.execute({
      authorId: 'author-1',
      title: 'New title',
      content: 'New content',
      questionId: newQuestion.id.toString(),
      attachmentsIds: ['attachment-1', 'attachment-3']
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'New title',
      content: 'New content'
    })

    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)

    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-3') })
    ])
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      title: 'New title',
      content: 'New content',
      questionId: newQuestion.id.toString(),
      attachmentsIds: []
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)

  })
})
