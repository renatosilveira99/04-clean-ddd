import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendQuestionBestAnswerNotification.bind(this), QuestionBestAnswerChosenEvent.name);
  }

  private async sendQuestionBestAnswerNotification({ question, bestAnswerId }: QuestionBestAnswerChosenEvent): Promise<void> {
    const answer = await this.answersRepository.findById(bestAnswerId.toString());

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Your answer was chosen as the best answer on "${question.title.substring(0, 40).concat('...')}"`,
        content: `The answer you provided was chosen as the best answer on the question "${question.title.substring(0, 20)}". Congratulations!`,
      })
    }
  }
}