-- Таблица для хранения модификаций тренировочных дней
-- Изменения применяются ко всем будущим дням с таким же именем
CREATE TABLE public.training_modifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  training_day_name TEXT NOT NULL, -- Имя дня (День A, День B, etc.)
  modification_type TEXT NOT NULL CHECK (modification_type IN ('replace_exercise', 'add_exercise', 'delete_exercise', 'change_weight', 'change_sets')),
  
  -- Для замены/удаления упражнения
  original_exercise_id TEXT,
  
  -- Для замены/добавления упражнения
  new_exercise_id TEXT,
  new_exercise_name TEXT,
  
  -- Для изменения веса
  new_weight NUMERIC,
  
  -- Для изменения количества подходов
  new_sets_count INTEGER,
  
  -- Порядок упражнения (для добавления)
  order_index INTEGER,
  
  -- Целевые повторения (для добавления)
  target_reps INTEGER DEFAULT 10,
  
  -- Дата создания модификации
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Флаг активности (можно отменить модификацию)
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.training_modifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own modifications"
ON public.training_modifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own modifications"
ON public.training_modifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own modifications"
ON public.training_modifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own modifications"
ON public.training_modifications FOR DELETE
USING (auth.uid() = user_id);

-- Index for fast lookups by day name
CREATE INDEX idx_training_modifications_day_name ON public.training_modifications(user_id, training_day_name, is_active);

-- Comment
COMMENT ON TABLE public.training_modifications IS 'Хранит модификации тренировочных дней для применения к будущим аналогичным дням';