import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { pool } from '../src/config/database';

const fixPropertiesColumns = async () => {
  try {
    console.log('Aplicando correção nas colunas da tabela properties...');

    const sqlPath = join(__dirname, '..', 'fix_properties_columns.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Executa o SQL
    await pool.query(sql);

    console.log('✅ Correção aplicada com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao aplicar correção:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

fixPropertiesColumns();

