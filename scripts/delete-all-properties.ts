import { pool, db, query } from '../src/config/database';
import { properties } from '../src/database/schema';

const main = async () => {
  console.log('[delete-all-properties] Iniciando exclusão de todos os imóveis...');

  try {
    // Primeiro, vamos contar quantos imóveis existem
    const propertiesCount = await db.select().from(properties);
    console.log(`[delete-all-properties] Encontrados ${propertiesCount.length} imóveis no banco de dados.`);

    if (propertiesCount.length === 0) {
      console.log('[delete-all-properties] Nenhum imóvel encontrado. Nenhuma ação necessária.');
      return;
    }

    // Contar inspeções antes de deletar usando SQL direto para evitar problemas com schema
    const inspectionsResult = await query('SELECT COUNT(*) as count FROM inspections');
    const inspectionsCount = parseInt(inspectionsResult.rows[0].count);
    console.log(`[delete-all-properties] Encontradas ${inspectionsCount} inspeções associadas.`);

    // Deletar todas as inspeções primeiro (isso também deletará os anexos devido ao CASCADE)
    if (inspectionsCount > 0) {
      console.log('[delete-all-properties] Deletando inspeções...');
      await query('DELETE FROM inspections');
      console.log('[delete-all-properties] Inspeções deletadas com sucesso.');
    }

    // Agora podemos deletar todos os imóveis
    console.log('[delete-all-properties] Deletando imóveis...');
    await db.delete(properties);
    console.log(`[delete-all-properties] ${propertiesCount.length} imóveis deletados com sucesso!`);
  } catch (error) {
    console.error('[delete-all-properties] Erro ao deletar imóveis:', error);
    throw error;
  }
};

main()
  .catch((error) => {
    console.error('[delete-all-properties] Falha ao deletar imóveis:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end().catch(() => undefined);
  });

