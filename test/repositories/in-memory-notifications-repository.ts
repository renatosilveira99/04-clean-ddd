import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationsRepository implements NotificationsRepository {
  public items: Notification[] = []
  
  async create(notification: Notification) {
    this.items.push(notification)
  }

  async findById(id: string): Promise<Notification | null> {
    return this.items.find(notification => notification.id.toString() === id) ?? null
  }	

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex(item => item.id.toString() === notification.id.toString())
    this.items[index] = notification
  }
}