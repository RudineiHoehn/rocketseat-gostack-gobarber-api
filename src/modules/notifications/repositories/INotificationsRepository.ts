import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notifications from '@modules/notifications/infra/typeorm/schemas/Notifications';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notifications>;
}
