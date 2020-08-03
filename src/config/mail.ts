interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'email.configurado.awa@dominio.proprio.com.br',
      name: 'nome padrão  de envio de email',
    },
  },
} as IMailConfig;
