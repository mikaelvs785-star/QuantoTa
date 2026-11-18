-- Migration: imagem global do produto (independente da oferta/mercado).
-- Execute uma única vez no banco QuantoTa antes de publicar o backend.
ALTER TABLE public.produtos
    ADD COLUMN IF NOT EXISTS imagem_id UUID;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_produtos_imagem'
          AND conrelid = 'public.produtos'::regclass
    ) THEN
        ALTER TABLE public.produtos
            ADD CONSTRAINT fk_produtos_imagem
            FOREIGN KEY (imagem_id) REFERENCES public.imagens(id)
            ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_produtos_imagem_id
    ON public.produtos (imagem_id)
    WHERE imagem_id IS NOT NULL;
