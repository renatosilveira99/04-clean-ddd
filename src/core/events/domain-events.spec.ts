import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";
import { vi } from 'vitest'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('DomainEvents', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscribe to the event
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Creating an answer without saving it in the database
    const aggregate = CustomAggregate.create()

    // Ensure that the event was added to the aggregate and not dispatched
    expect(aggregate.domainEvents.length).toBe(1)

    // Saving the event in the database and dispatching it
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Ensure that the event was dispatched
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents.length).toBe(0)
  })
})
