import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import exp from 'constants'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notifications', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString()
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date)
    )
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: '2',
      notificationId: notification.id.toString()
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})


