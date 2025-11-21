-- Adiciona coluna completed_at à tabela inspections
-- Esta coluna armazena a data e horário em que a vistoria foi concluída

-- Adiciona coluna completed_at se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inspections' AND column_name = 'completed_at'
    ) THEN
        ALTER TABLE "inspections" ADD COLUMN "completed_at" timestamp with time zone;
    END IF;
END $$;

