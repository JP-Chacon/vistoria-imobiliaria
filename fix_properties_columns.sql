-- Script SQL para corrigir as colunas da tabela properties
-- Execute este script diretamente no banco de dados PostgreSQL

-- Primeiro, remove a constraint NOT NULL das colunas que podem ter sido parcialmente criadas
DO $$ 
BEGIN
    -- Remove NOT NULL de cep se existir e for NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'cep' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE "properties" ALTER COLUMN "cep" DROP NOT NULL;
    END IF;

    -- Remove NOT NULL de street se existir e for NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'street' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE "properties" ALTER COLUMN "street" DROP NOT NULL;
    END IF;

    -- Remove NOT NULL de number se existir e for NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'number' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE "properties" ALTER COLUMN "number" DROP NOT NULL;
    END IF;

    -- Remove NOT NULL de district se existir e for NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'district' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE "properties" ALTER COLUMN "district" DROP NOT NULL;
    END IF;

    -- Remove NOT NULL de city se existir e for NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'city' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE "properties" ALTER COLUMN "city" DROP NOT NULL;
    END IF;

    -- Remove NOT NULL de state se existir e for NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'state' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE "properties" ALTER COLUMN "state" DROP NOT NULL;
    END IF;
END $$;

-- Adiciona coluna cep se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'cep'
    ) THEN
        ALTER TABLE "properties" ADD COLUMN "cep" text;
    END IF;
END $$;

-- Adiciona coluna street se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'street'
    ) THEN
        ALTER TABLE "properties" ADD COLUMN "street" text;
    END IF;
END $$;

-- Adiciona coluna number se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'number'
    ) THEN
        ALTER TABLE "properties" ADD COLUMN "number" text;
    END IF;
END $$;

-- Adiciona coluna district se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'district'
    ) THEN
        ALTER TABLE "properties" ADD COLUMN "district" text;
    END IF;
END $$;

-- Adiciona coluna city se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'city'
    ) THEN
        ALTER TABLE "properties" ADD COLUMN "city" text;
    END IF;
END $$;

-- Adiciona coluna state se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'state'
    ) THEN
        ALTER TABLE "properties" ADD COLUMN "state" text;
    END IF;
END $$;

-- Adiciona coluna observations se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'observations'
    ) THEN
        ALTER TABLE "properties" ADD COLUMN "observations" text;
    END IF;
END $$;

-- Preenche valores padrão para registros existentes (se houver valores nulos)
UPDATE "properties" 
SET 
    "cep" = COALESCE("cep", ''),
    "street" = COALESCE("street", ''),
    "number" = COALESCE("number", ''),
    "district" = COALESCE("district", ''),
    "city" = COALESCE("city", ''),
    "state" = COALESCE("state", '')
WHERE 
    "cep" IS NULL 
    OR "street" IS NULL 
    OR "number" IS NULL 
    OR "district" IS NULL 
    OR "city" IS NULL 
    OR "state" IS NULL;

-- Torna as colunas NOT NULL (exceto observations)
DO $$ 
BEGIN
    -- cep
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'cep' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE "properties" ALTER COLUMN "cep" SET NOT NULL;
    END IF;

    -- street
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'street' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE "properties" ALTER COLUMN "street" SET NOT NULL;
    END IF;

    -- number
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'number' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE "properties" ALTER COLUMN "number" SET NOT NULL;
    END IF;

    -- district
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'district' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE "properties" ALTER COLUMN "district" SET NOT NULL;
    END IF;

    -- city
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'city' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE "properties" ALTER COLUMN "city" SET NOT NULL;
    END IF;

    -- state
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'state' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE "properties" ALTER COLUMN "state" SET NOT NULL;
    END IF;
END $$;

