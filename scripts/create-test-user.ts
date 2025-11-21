import bcrypt from 'bcryptjs';

import { pool } from '../src/config/database';
import { userRepository } from '../src/modules/users/user.repository';

const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = '123456';
const ADMIN_NAME = 'Administrador';

const main = async () => {
  console.log('[create-test-user] Iniciando criação do usuário admin padrão...');

  const existing = await userRepository.findByEmail(ADMIN_EMAIL);

  if (existing) {
    console.log(
      `[create-test-user] Usuário já existe (ID: ${existing.id}, e-mail: ${existing.email}). Nenhuma ação necessária.`,
    );
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const user = await userRepository.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    passwordHash,
  });

  console.log(
    `[create-test-user] Usuário criado com sucesso! ID: ${user.id}, e-mail: ${user.email}.`,
  );
};

main()
  .catch((error) => {
    console.error('[create-test-user] Falha ao criar usuário de teste:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end().catch(() => undefined);
  });


