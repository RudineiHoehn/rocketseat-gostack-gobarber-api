import IMailProvider from '@shared/container/providers/MailProvider/model/IMailProvider';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';

class FakeMailProvider implements IMailProvider {
  private message: ISendMailDTO[] = [];

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.message.push(message);
  }
}

export default FakeMailProvider;
